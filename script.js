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
        // Vérifier si les étoiles sont déjà présentes
        const etoilesExistantes = recipeElement.querySelector('.etoiles');
        if (etoilesExistantes) {
          etoilesExistantes.remove(); // Supprimer les étoiles existantes (pour éviter les doublons)
        }
        // Création du HTML pour chaque recette, avec les étoiles avant le bouton
        recipeElement.innerHTML = `
          <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
          <h3>${recipe.strMeal}</h3>
          <p>${recipe.strInstructions}</p>
          
          <div class="etoiles">
            <span class="etoile" data-recipe-id="${recipe.idMeal}" data-note="1">☆</span>
            <span class="etoile" data-recipe-id="${recipe.idMeal}" data-note="2">☆</span>
            <span class="etoile" data-recipe-id="${recipe.idMeal}" data-note="3">☆</span>
            <span class="etoile" data-recipe-id="${recipe.idMeal}" data-note="4">☆</span>
            <span class="etoile" data-recipe-id="${recipe.idMeal}" data-note="5">☆</span>
          </div>

          <button onclick="window.open('https://www.themealdb.com/meal/${recipe.idMeal}', '_blank')">Voir la recette</button>
        `;

        recipesContainer.appendChild(recipeElement);

        // Ajouter un gestionnaire d'événement pour chaque étoile
        const etoiles = recipeElement.querySelectorAll('.etoile');
        etoiles.forEach(etoile => {
          etoile.addEventListener('mouseover', (event) => {
            const note = event.target.dataset.note;
            for (let i = 0; i < note; i++) {
              etoiles[i].classList.add('active');
            }
          });

          etoile.addEventListener('mouseout', (event) => {
            // Supprimer la classe active lorsque l'utilisateur ne survole plus
            etoiles.forEach(etoile => {
              etoile.classList.remove('active');
            });
          });

          etoile.addEventListener('click', (event) => {
            const recetteId = event.target.dataset.recipeId;
            const note = event.target.dataset.note;

            // Sauvegarde la note dans le localStorage (ou une autre base de données si nécessaire)
            let avisRecette = JSON.parse(localStorage.getItem(`avis-recette-${recetteId}`)) || [];
            avisRecette.push({ note });
            localStorage.setItem(`avis-recette-${recetteId}`, JSON.stringify(avisRecette));

            // Afficher un message de confirmation
            alert(`Merci pour votre avis ! Vous avez donné une note de ${note} étoiles.`);
            // Après avoir cliqué, laisser les étoiles colorées selon la note donnée
            for (let i = 0; i < note; i++) {
              etoiles[i].classList.add('active');
            }
          });
       });
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

  // Code pour le bouton de remontée en haut
  const scrollToTopBtn = document.getElementById('scrollToTopBtn');

  // S'assurer que le bouton est caché au début
  scrollToTopBtn.style.display = "none"; // Le cacher par défaut

  // Afficher ou masquer le bouton en fonction du défilement
  window.onscroll = function () {
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
      scrollToTopBtn.style.display = "block"; // Afficher après 200px de défilement
    } else {
      scrollToTopBtn.style.display = "none"; // Masquer si en haut
    }
  };

  // Action de remontée au clic
  scrollToTopBtn.addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Défilement fluide vers le haut
    });
  });

});
