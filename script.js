// Lorsque le DOM est complètement chargé et prêt à être manipulé, nous exécutons la fonction
document.addEventListener('DOMContentLoaded', function () {
  
    // Sélectionne les éléments HTML nécessaires dans la page
    const searchForm = document.getElementById('search-form');           // Le formulaire de recherche
    const searchInput = document.getElementById('search-input');         // Le champ de saisie pour la recherche
    const recipesContainer = document.getElementById('recipes-container'); // Le conteneur où les recettes seront affichées
    
    // Définit la clé API et l'URL de l'API Tasty. 
    const API_KEY = '48cbaeadffmshee38bc6123d9047p178f48jsnd77d53f4fc5c';  
    const BASE_URL = 'https://tasty.p.rapidapi.com/recipes/list';         // URL de l'API pour récupérer les recettes
  
    // Ajoute un événement au formulaire de recherche qui s'exécute lors de la soumission
    searchForm.addEventListener('submit', function (e) {
      e.preventDefault(); // Empêche le comportement par défaut du formulaire (qui serait de recharger la page)
      
      const query = searchInput.value.trim(); // Récupère la valeur du champ de recherche, et retire les espaces inutiles
  
      // Si l'utilisateur a saisi quelque chose dans la barre de recherche
      if (query) {
        fetchRecipes(query); // Appelle la fonction fetchRecipes() pour récupérer les recettes correspondantes
      }
    });
  
    // Fonction pour récupérer les recettes via l'API Tasty
    function fetchRecipes(query) {
      const url = `${BASE_URL}?q=${query}`;  // Crée l'URL de la requête en ajoutant le terme de recherche
  
      // Utilise la méthode fetch() pour faire une requête GET à l'API
      fetch(url, {
        method: 'GET', // La méthode de la requête HTTP est GET (pour récupérer des données)
        headers: {     // Les en-têtes nécessaires pour l'API
          'X-RapidAPI-Host': 'tasty.p.rapidapi.com',   // Le nom d'hôte de l'API
          'X-RapidAPI-Key': API_KEY                    // La clé API obtenue de RapidAPI
        }
      })
      .then(response => response.json())            // Lorsque la réponse est reçue, la convertit en JSON
      .then(data => {
        // Si la requête est réussie, la fonction displayRecipes() est appelée pour afficher les recettes
        displayRecipes(data.results); // `data.results` contient les recettes renvoyées par l'API
      })
      .catch(error => console.error('Erreur lors de la récupération des recettes :', error)); // Gère les erreurs en cas d'échec de la requête
    }
  
    // Fonction pour afficher les recettes dans le DOM (page web)
    function displayRecipes(recipes) {
      recipesContainer.innerHTML = '';  // Vide le conteneur avant d'ajouter les nouvelles recettes
  
      // Si des recettes ont été trouvées
      if (recipes.length > 0) {
        // Pour chaque recette dans le tableau de recettes
        recipes.forEach(recipe => {
          // Crée un nouvel élément div pour chaque recette
          const recipeElement = document.createElement('div');
          recipeElement.classList.add('recette'); // Ajoute la classe 'recette' pour le style CSS
  
          // Remplit le HTML de l'élément avec les informations de la recette
          recipeElement.innerHTML = `
            <img src="${recipe.thumbnail_url}" alt="${recipe.name}">   <!-- Image de la recette -->
            <h3>${recipe.name}</h3>                                    <!-- Nom de la recette -->
            <p>${recipe.description}</p>                                <!-- Description courte de la recette -->
            <button onclick="window.open('${recipe.url}', '_blank')">Voir la recette</button>  <!-- Bouton pour ouvrir la recette dans un nouvel onglet -->
          `;
  
          // Ajoute l'élément de recette au conteneur des recettes dans le DOM
          recipesContainer.appendChild(recipeElement);
        });
      } else {
        // Si aucune recette n'est trouvée, affiche un message d'erreur
        recipesContainer.innerHTML = '<p>Aucune recette trouvée.</p>';
      }
    }
  });
  