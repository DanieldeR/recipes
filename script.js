document.addEventListener('DOMContentLoaded', function() {
    let recipes = []; // Store the recipes in a variable accessible to all functions

    fetch('recipes.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            recipes = data; // Assign the fetched data to the recipes variable
            populateDropdown(recipes);
            displayRecipe(recipes, 0);
        })
        .catch(error => {
            console.error('Error fetching or parsing recipes:', error);
            displayError("Failed to load recipes.");
        });

    const searchInput = document.getElementById('search-input');
    if (searchInput){
        searchInput.addEventListener('input', function() {
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

    select.addEventListener('change', function() {
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

    if (!recipes || recipes.length == 0) {
        displayError("No recipes found.");
        return;
    }

    if (index < 0 || index >= recipes.length) {
        return; //Invalid index
    }

    let recipe = recipes[index];

    let recipeDiv = document.getElementById(`recipe-${index}`);
    if (!recipeDiv){
        recipeDiv = document.createElement('div');
        recipeDiv.id = `recipe-${index}`;
        recipeDiv.classList.add('recipe');
        recipesContainer.appendChild(recipeDiv);
    }
    recipeDiv.innerHTML = createRecipeHTML(recipe);
    recipeDiv.classList.add('active');
}

function hideAllRecipes(){
    const recipes = document.querySelectorAll(".recipe")
    recipes.forEach(recipe => recipe.classList.remove("active"))
}

function createRecipeHTML(recipe){
    let recipeHTML = `<h2>${recipe.name}</h2>`;
    if (recipe.description) {
        recipeHTML += `<p>${recipe.description}</p>`;
    }
    if (recipe.ingredients) {
        recipeHTML += "<h3>Ingredients</h3><ul>";
        recipe.ingredients.forEach(ingredient => {
            recipeHTML += `<li>${ingredient}</li>`;
        });
        recipeHTML += "</ul>";
    }
    if (recipe.instructions) {
        recipeHTML += "<h3>Instructions</h3><ol>";
        recipe.instructions.forEach(instruction => {
            recipeHTML += `<li>${instruction}</li>`;
        });
        recipeHTML += "</ol>";
    }
    return recipeHTML;
}

function filterRecipes(recipes, searchTerm) {
    hideAllRecipes();
    const recipesContainer = document.getElementById('recipes-container');
    if (!recipesContainer) return;

    if (!recipes || recipes.length == 0) {
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
        recipesContainer.innerHTML = `<p class="error">${message}</p>`;
    } else {
        console.error("recipes-container element not found in HTML to display error: " + message);
    }
}