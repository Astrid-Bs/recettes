document.addEventListener('DOMContentLoaded', function () {
  
  // Variables pour la recherche et affichage des recettes
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');
  const recipesContainer = document.getElementById('recipes-container');
  const scrollToTopBtn = document.getElementById('scrollToTopBtn');

  // Variables pour le menu mobile
  const menuToggle = document.getElementById('menu-toggle');
  const menuDrawer = document.getElementById('menu-drawer');
  const body = document.body;

  // Ajouter un événement pour ouvrir/fermer le menu
  menuToggle.addEventListener('click', function () {
    menuDrawer.classList.toggle('active');
    menuToggle.classList.toggle('open'); // Ajoute ou enlève la classe 'open' pour l'animation de l'icône
    body.classList.toggle('menu-open'); // Empêche le défilement du body lorsque le menu est ouvert
  });


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

   // Fonction pour gérer le clic sur le bouton "like"
   function handleLikeClick(event) {
    const recipeId = event.target.closest('button').dataset.recipeId; // Récupère l'ID de la recette
    let favorites = JSON.parse(localStorage.getItem('favorites')) || []; // Récupère les favoris du localStorage, ou crée un tableau vide
    // Ajouter l'ID de la recette aux favoris si ce n'est pas déjà fait
    if (!favorites.includes(recipeId)) {
      favorites.push(recipeId); // Ajoute l'ID aux favoris
      localStorage.setItem('favorites', JSON.stringify(favorites)); // Sauvegarde dans le localStorage

      // Afficher le message de confirmation
      alert("La recette a été ajoutée en favoris. Retrouvez-la en cliquant sur 'Favoris' en haut de la page.");
    } else {
      // Si la recette est déjà dans les favoris
      alert("Cette recette est déjà dans vos favoris.");
    }
  }


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

        // Nombre d'avis (ici on prend un nombre fictif, tu peux le récupérer de la base de données ou de localStorage)
        const numberOfReviews = localStorage.getItem(`avis-recette-count-${recipe.idMeal}`) || 0;

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

          <div class="avis-container">
            <span class="number-of-reviews">(${numberOfReviews} avis)</span>
            
            <!-- Icône "like" avec un bouton à droite -->
            <button class="like-btn" data-recipe-id="${recipe.idMeal}">
              <ion-icon name="heart-outline"></ion-icon>
            </button>
          </div>

          <!-- Modification de l'événement du bouton pour rediriger vers la page des détails -->
        <button onclick="window.location.href = 'recipes-details.html?id=${recipe.idMeal}'">Découvrir la recette</button>
        `;

        recipesContainer.appendChild(recipeElement);

          // Ajouter un gestionnaire d'événement pour le bouton like
          const likeBtn = recipeElement.querySelector('.like-btn');
          likeBtn.addEventListener('click', handleLikeClick); // Gère le clic sur le bouton "like"  

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

           // Sauvegarde la note dans le localStorage
           localStorage.setItem(`avis-recette-${recetteId}`, note); // Enregistre la note de l'utilisateur pour cette recette

           // Met à jour le nombre d'avis (on peut l'augmenter ici)
           let currentReviewCount = localStorage.getItem(`avis-recette-count-${recetteId}`) || 0;
           currentReviewCount = parseInt(currentReviewCount) + 1;
           localStorage.setItem(`avis-recette-count-${recetteId}`, currentReviewCount);

            // Afficher un message de confirmation
            alert(`Merci pour votre avis ! Vous avez donné une note de ${note} étoiles.`);
            // Après avoir cliqué, laisser les étoiles colorées selon la note donnée
             // Réafficher les recettes pour mettre à jour la note moyenne et le nombre d'avis
             displayRecipes(window.allRecipes);

            for (let i = 0; i < note; i++) {
              etoiles[i].classList.add('active');
            }
          });
        });

          // Récupérer et afficher la note si elle est déjà enregistrée
        const recetteId = recipe.idMeal;
        const noteEnregistree = localStorage.getItem(`avis-recette-${recetteId}`);

        if (noteEnregistree) {
            for (let i = 0; i < noteEnregistree; i++) {
                etoiles[i].classList.add('active');
            }
        }
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