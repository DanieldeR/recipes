document.addEventListener('DOMContentLoaded', function () {
    let recipes = [];

    const selectedRecipeIndex = localStorage.getItem('selectedRecipeIndex');

    if (selectedRecipeIndex !== null) {
        // Remove the item from local storage so it doesn't persist
        localStorage.removeItem('selectedRecipeIndex');

        // Parse the index to an integer
        const index = parseInt(selectedRecipeIndex);
        fetch('recipes.json')
        .then(response => response.json())
        .then(recipes => {
            displayRecipe(recipes, index);
        })
    }

    fetch('recipes.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            recipes = data;
            populateDropdown(recipes);
            displayRecipe(recipes, 0);
        })
        .catch(error => {
            console.error('Error fetching or parsing recipes:', error);
            displayError("Failed to load recipes.");
        });

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const searchTerm = this.value.toLowerCase();
            filterRecipes(recipes, searchTerm);
        });
    }
});

function populateDropdown(recipes) {
    const select = document.getElementById('recipe-select');
    if (!select) return;

    recipes.forEach((recipe, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.text = recipe.name;
        select.appendChild(option);
    });

    select.addEventListener('change', function () {
        const selectedIndex = parseInt(this.value);
        if (!isNaN(selectedIndex) && selectedIndex >= 0 && selectedIndex < recipes.length) {
            displayRecipe(recipes, selectedIndex);
        } else {
            hideAllRecipes();
        }
    });
}

function displayRecipe(recipes, index) {
    hideAllRecipes();
    const recipesContainer = document.getElementById('recipes-container');
    if (!recipesContainer) return;

    if (!recipes || recipes.length === 0) {
        displayError("No recipes found.");
        return;
    }

    if (index < 0 || index >= recipes.length) {
        return;
    }

    const recipe = recipes[index];

    let recipeDiv = document.getElementById(`recipe-${index}`);
    if (!recipeDiv) {
        recipeDiv = document.createElement('div');
        recipeDiv.id = `recipe-${index}`;
        recipeDiv.classList.add('recipe', 'hidden', 'p-4', 'border', 'border-gray-300', 'mb-4', 'rounded-lg'); // Added rounded-lg here
        recipesContainer.appendChild(recipeDiv);
    }
    recipeDiv.innerHTML = createRecipeHTML(recipe);
    recipeDiv.classList.remove('hidden');
}

function hideAllRecipes() {
    const recipes = document.querySelectorAll(".recipe");
    recipes.forEach(recipe => recipe.classList.add('hidden'));
}

function createRecipeHTML(recipe) {
    let recipeHTML = `
        <div class="recipe">
            <h2 class="text-2xl font-semibold text-gray-800 mb-2">${recipe.name}</h2>`; // Title styling

    if (recipe.image) {
        const imagePath = `assets/${recipe.image}`;
        recipeHTML += `<img class="w-full rounded-lg" src="${imagePath}" alt="${recipe.name} image">`; // Image styling
    }

    if (recipe.description) {
        recipeHTML += `<p class="text-gray-700 mb-4">${recipe.description}</p>`; // Description styling
    }

    if (recipe.ingredients) {
        recipeHTML += `<h3 class="text-lg font-semibold text-gray-800 mt-4 mb-2">Ingredients</h3><ul class="list-disc text-gray-700">`;
        recipe.ingredients.forEach(ingredient => {
            recipeHTML += `<li>${ingredient}</li>`;
        });
        recipeHTML += `</ul>`;
    }

    if (recipe.instructions) {
        recipeHTML += `<h3 class="text-lg font-semibold text-gray-800 mt-4 mb-2">Instructions</h3><ol class="list-decimal text-gray-700">`;
        recipe.instructions.forEach((instruction, index) => {
            recipeHTML += `<li>${instruction}</li>`;
        });
        recipeHTML += `</ol>`;
    }

    if (recipe.nutrition) {
        recipeHTML += `<h3 class="text-lg font-semibold text-gray-800 mt-4 mb-2">Nutrition</h3><div class="text-gray-700">`;
        for (const [key, value] of Object.entries(recipe.nutrition)) {
            recipeHTML += `<p>${key}: ${value}</p>`;
        }
        recipeHTML += `</div>`;
    }

    recipeHTML += `</div>`;
    return recipeHTML;
}

function filterRecipes(recipes, searchTerm) {
    hideAllRecipes();
    const recipesContainer = document.getElementById('recipes-container');
    if (!recipesContainer) return;

    if (!recipes || recipes.length === 0) {
        displayError("No recipes found.");
        return;
    }

    recipes.forEach((recipe, index) => {
        if (recipe.name.toLowerCase().includes(searchTerm)) {
            displayRecipe(recipes, index);
        }
    });
}

function displayError(message) {
    const recipesContainer = document.getElementById('recipes-container');
    if (recipesContainer) {
        recipesContainer.innerHTML = `<p class="text-red-500">${message}</p>`; // Tailwind class for error message
    } else {
        console.error("recipes-container element not found in HTML to display error: " + message);
    }
}