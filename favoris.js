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

  // Récupérer les éléments du DOM
  const publishBtn = document.getElementById('publishBtn');
  const formContainer = document.getElementById('form-container');
  const recipeForm = document.getElementById('recipeForm');
  const recipesList = document.getElementById('recipes-list');
  const addStepBtn = document.getElementById('addStepBtn');
  const stepsContainer = document.getElementById('steps-container');
  const addIngredientBtn = document.getElementById('addIngredientBtn');
  const ingredientsList = document.getElementById('ingredients-list');

  let stepCount = 1;
  let ingredientCount = 1;

  // Lorsque le bouton "Publier une Recette" est cliqué
  publishBtn.addEventListener('click', function () {
    alert("Veuillez remplir votre recette !");
    formContainer.style.display = 'block';
  });

  // Ajouter un ingrédient supplémentaire
  addIngredientBtn.addEventListener('click', function () {
    ingredientCount++;

    // Créer un nouvel ingrédient à ajouter
    const ingredientItem = document.createElement('li');
    ingredientItem.classList.add('ingredient-item');
    ingredientItem.innerHTML = `
        <input type="text" id="ingredient${ingredientCount}" name="ingredient${ingredientCount}" placeholder="Nom de l'ingrédient" required>
        <input type="number" id="quantity${ingredientCount}" name="quantity${ingredientCount}" placeholder="Quantité" required>
        <select id="unit${ingredientCount}" name="unit${ingredientCount}">
            <option value="g">g</option>
            <option value="kg">kg</option>
            <option value="ml">ml</option>
            <option value="L">L</option>
            <option value="tasse">tasse</option>
            <option value="cuillère à soupe">cuillère à soupe</option>
            <option value="cuillère à café">cuillère à café</option>
        </select>
        <button type="button" class="remove-ingredient-btn">Supprimer</button>
    `;
    ingredientsList.appendChild(ingredientItem);

    // Ajouter un événement pour supprimer cet ingrédient
    ingredientItem.querySelector('.remove-ingredient-btn').addEventListener('click', function () {
      ingredientsList.removeChild(ingredientItem);
    });
  });

  // Lorsque l'on clique sur le bouton "Ajouter une étape"
  addStepBtn.addEventListener('click', function () {
    stepCount++;

    // Créer une nouvelle étape
    const newStepDiv = document.createElement('div');
    newStepDiv.classList.add('step');
    newStepDiv.innerHTML = `
        <label for="step${stepCount}">Étape  ${stepCount}:</label><br>
        <textarea id="step${stepCount}" name="step${stepCount}" rows="4" required></textarea><br><br>
    `;
    stepsContainer.appendChild(newStepDiv);
  });

  // Lors de la soumission du formulaire
  recipeForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Empêcher la soumission normale du formulaire
    console.log("Formulaire soumis");

    // Récupérer les valeurs du formulaire
    const recipeName = document.getElementById('recipeName').value;
    console.log("Nom de la recette:", recipeName);

    // Récupérer l'image
    const imageFile = document.getElementById('recipeImage').files[0];
    const imageUrl = imageFile ? URL.createObjectURL(imageFile) : ''; // Si une image est sélectionnée, créer une URL temporaire
    console.log("URL de l'image:", imageUrl);


    // Récupérer les ingrédients
    const ingredients = [];
    for (let i = 1; i <= ingredientCount; i++) {
      const ingredientNameElem = document.getElementById(`ingredient${i}`);
      const quantityElem = document.getElementById(`quantity${i}`);
      const unitElem = document.getElementById(`unit${i}`);
      // Vérifier que les éléments existent avant de récupérer leur valeur
      if (ingredientNameElem && quantityElem && unitElem) {
        const ingredientName = ingredientNameElem.value;
        const quantity = quantityElem.value;
        const unit = unitElem.value;

        if (ingredientName && quantity && unit) {
          ingredients.push(`${ingredientName} - ${quantity} ${unit}`);
        }
      } else {
        console.warn(`Ingrédient ${i} manquant dans le DOM.`);
      }
    }

    console.log("Ingrédients récupérés :", ingredients);

    // Récupérer les étapes
    const steps = [];
    for (let i = 1; i <= stepCount; i++) {
      const stepText = document.getElementById(`step${i}`).value;
      if (stepText) {
        steps.push({ num: i, text: stepText });
      }
    }
    console.log("Étapes:", steps);

    // Créer une nouvelle recette à afficher
    const recipeHtml = `
        <div class="recipe">
          <h3>${recipeName}</h3>
         ${imageUrl ? `<img src="${imageUrl}" alt="${recipeName}" class="recipe-image">` : ''}
          <ul>
            ${ingredients.map(ingredient => `
              <li class="ingredient-item">
                <!-- Ajouter la checkbox pour chaque ingrédient -->
                <input type="checkbox" id="checkbox-${ingredient}" class="ingredient-checkbox">
                <label for="checkbox-${ingredient}">${ingredient}</label>
              </li>
            `).join('')}
          </ul>
          <h4>Étapes</h4>
          <ol>
            ${steps.map(step => `
              <li>
                <span class="step-number">${step.num}</span>
                <span class="step-content">${step.text}</span>
              </li>
            `).join('')}
          </ol>
        </div>
    `;

    // Ajouter la recette à la liste
    recipesList.innerHTML += recipeHtml;
    console.log("Recette ajoutée à la liste");

    // Réinitialiser le formulaire et cacher le formulaire
    recipeForm.reset();
    stepsContainer.innerHTML = '<h3>Instructions</h3><div class="step"><label for="step1">Étape 1 </label><br><textarea id="step1" name="step1" rows="4" required></textarea><br><br></div>';
    formContainer.style.display = 'none';
    stepCount = 1; // Réinitialiser le compteur d'étapes
    ingredientCount = 1; // Réinitialiser le compteur d'ingrédients
    ingredientsList.innerHTML = ''; // Réinitialiser la liste des ingrédients
  });


});
