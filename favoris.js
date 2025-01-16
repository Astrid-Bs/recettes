document.addEventListener('DOMContentLoaded', function () {
    const favoritesContainer = document.getElementById('favorites-container');
    
    // Récupérer les favoris du localStorage
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  
    // Vérifier s'il y a des favoris
    if (favorites.length === 0) {
      favoritesContainer.innerHTML = '<p>Aucune recette dans vos favoris.</p>';
      return;
    }
  
    // URL de l'API TheMealDB pour récupérer les recettes par ID
    const BASE_URL = 'https://www.themealdb.com/api/json/v1/1/lookup.php';
  
    // Fonction pour récupérer une recette par son ID
    function fetchRecipeById(id) {
      const url = `${BASE_URL}?i=${id}`;
      
      fetch(url)
        .then(response => response.json())
        .then(data => {
          if (data.meals) {
            const recipe = data.meals[0];
            displayRecipe(recipe);
          }
        })
        .catch(error => console.error('Erreur lors de la récupération de la recette :', error));
    }
  
    // Fonction pour afficher une recette dans le conteneur avec étoiles et avis
    function displayRecipe(recipe) {
      const recipeElement = document.createElement('div');
      recipeElement.classList.add('recette');
      
      // Récupérer la note et le nombre d'avis de la recette dans le localStorage
      const recetteId = recipe.idMeal;
      const noteEnregistree = localStorage.getItem(`avis-recette-${recetteId}`); // Note de l'utilisateur
      const numberOfReviews = localStorage.getItem(`avis-recette-count-${recetteId}`) || 0; // Nombre d'avis
      
      // Calcul de la note moyenne (si disponible)
      const noteMoyenne = noteEnregistree || 0; // Utilisation de la note de l'utilisateur comme note moyenne pour simplification
  
      // Création du HTML pour afficher la recette avec les étoiles
      recipeElement.innerHTML = `
        <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
        <h3>${recipe.strMeal}</h3>
        <p>${recipe.strInstructions}</p>
  
        <!-- Section des étoiles -->
        <div class="etoiles">
          ${createStarRating(noteMoyenne)}
        </div>
  
        <!-- Nombre d'avis -->
        <div class="avis-container">
          <span class="number-of-reviews">(${numberOfReviews} avis)</span>
        </div>
  
        <button onclick="window.location.href = 'recipes-details.html?id=${recipe.idMeal}'">Découvrir la recette</button>
      `;
      
      favoritesContainer.appendChild(recipeElement);
    }
  
    // Fonction pour créer les étoiles en fonction de la note
    function createStarRating(note) {
      let starsHTML = '';
      for (let i = 1; i <= 5; i++) {
        const starClass = i <= note ? 'active' : '';
        starsHTML += `<span class="etoile ${starClass}" data-note="${i}">☆</span>`;
      }
      return starsHTML;
    }
  
    // Récupérer chaque recette favorite par son ID
    favorites.forEach(id => {
      fetchRecipeById(id); // On appelle la fonction pour chaque ID dans les favoris
    });
  });
  