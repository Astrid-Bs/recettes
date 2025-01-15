document.addEventListener('DOMContentLoaded', function () {
  
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');
  const recipesContainer = document.getElementById('recipes-container');

  // URL de l'API TheMealDB
  const BASE_URL = 'https://www.themealdb.com/api/json/v1/1/search.php';  // URL de l'API

  // Fonction pour récupérer toutes les recettes
  function fetchAllRecipes() {
    const url = `${BASE_URL}?s=`;  // Requête pour obtenir toutes les recettes (sans paramètre)

    fetch(url)
    .then(response => response.json())
    .then(data => {
      displayRecipes(data.meals); // Affiche toutes les recettes
      window.allRecipes = data.meals;  // Stocke toutes les recettes pour filtrage ultérieur
    })
    .catch(error => console.error('Erreur lors de la récupération des recettes :', error));
  }

  fetchAllRecipes(); // Appelle la fonction pour afficher toutes les recettes au démarrage

  function displayRecipes(recipes) {
    recipesContainer.innerHTML = '';  // Vide le conteneur avant de réafficher les recettes

    if (recipes) {
      recipes.forEach(recipe => {
        const recipeElement = document.createElement('div');
        recipeElement.classList.add('recette');

        recipeElement.innerHTML = `
          <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
          <h3>${recipe.strMeal}</h3>
          <p>${recipe.strInstructions}</p>
          <button onclick="window.open('https://www.themealdb.com/meal/${recipe.idMeal}', '_blank')">Voir la recette</button>
        `;

        recipesContainer.appendChild(recipeElement);
      });
    } else {
      recipesContainer.innerHTML = '<p>Aucune recette trouvée.</p>';
    }
  }

  // Filtrer les recettes en fonction de la saisie dans le champ de recherche
  searchForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const query = searchInput.value.trim().toLowerCase();

    if (query) {
      const filteredRecipes = window.allRecipes.filter(recipe => 
        recipe.strMeal.toLowerCase().includes(query) || 
        recipe.strInstructions.toLowerCase().includes(query)
      );
      displayRecipes(filteredRecipes);
    } else {
      // Si la recherche est vide, réafficher toutes les recettes
      displayRecipes(window.allRecipes);
    }
  });
});
