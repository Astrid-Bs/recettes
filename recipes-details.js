document.addEventListener('DOMContentLoaded', function () {
    const recipeId = new URLSearchParams(window.location.search).get('id'); // Récupère l'ID de la recette depuis l'URL
    const recipeDetailsContainer = document.getElementById('recipe-details-container');
    const ingredientsListContainer = document.getElementById('ingredients-list'); // Conteneur pour les ingrédients

    if (recipeId) {
      // Requête pour récupérer les détails de la recette
      fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`)
        .then(response => response.json())
        .then(data => {
          const recipe = data.meals[0]; // On récupère les informations de la recette
  
          // Affiche les détails de la recette
          recipeDetailsContainer.innerHTML = `
            <h1>${recipe.strMeal}</h1>
            <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" />
            <ul id="ingredients-list"></ul> <!-- Liste des ingrédients -->
            <br>
            <h2>Préparation :</h2>
            <p>${recipe.strInstructions}</p>
          `;
  
          // Affiche la liste des ingrédients
          let ingredientsList = '<h3>Ingrédients</h3>';
          for (let i = 1; i <= 20; i++) {
            const ingredient = recipe[`strIngredient${i}`];
            const measure = recipe[`strMeasure${i}`]; // Mesure de l'ingrédient
            
            if (ingredient && ingredient.trim() !== '') {  // Assurez-vous que l'ingrédient n'est pas vide
              ingredientsList += `<li>${ingredient} ${measure ? `(${measure})` : ''}</li>`; // Ajoute la mesure si elle existe
            }
          }
  
          // Insère la liste d'ingrédients dans le conteneur approprié
          ingredientsListContainer.innerHTML = ingredientsList;
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des détails de la recette :', error);
        });
    } else {
      recipeDetailsContainer.innerHTML = `<p>Aucune recette sélectionnée.</p>`;
    }
});
