document.addEventListener('DOMContentLoaded', function () {
  const recipeId = new URLSearchParams(window.location.search).get('id'); // Récupère l'ID de la recette depuis l'URL
  const recipeDetailsContainer = document.getElementById('recipe-details-container');
  const ingredientsListContainer = document.getElementById('ingredients-list'); // Conteneur pour les ingrédients
  const shareLinkBtn = document.getElementById('share-link-btn');

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
          <h2>Préparation </h2>
          <p>${recipe.strInstructions}</p>
        `;

        // Affiche la liste des ingrédients avec checkboxes
        let ingredientsList = '<h2>Ingrédients</h2><ul>';
        for (let i = 1; i <= 20; i++) {
          const ingredient = recipe[`strIngredient${i}`];
          const measure = recipe[`strMeasure${i}`]; // Mesure de l'ingrédient

          if (ingredient && ingredient.trim() !== '') {  // Assurez-vous que l'ingrédient n'est pas vide
            ingredientsList += `
              <li>
                <input type="checkbox" id="ingredient${i}" />
                <label for="ingredient${i}">${ingredient} ${measure ? `(${measure})` : ''}</label>
              </li>
            `; // Ajoute la mesure si elle existe
          }
        }
        ingredientsList += '</ul>';

        // Insère la liste d'ingrédients dans le conteneur approprié
        ingredientsListContainer.innerHTML = ingredientsList;

        // Met à jour les liens de partage
        const recipeUrl = window.location.href; // Récupère l'URL actuelle de la page

        // Fonction de partage du lien
        shareLinkBtn.addEventListener('click', function () {
          // Copie l'URL de la recette dans le presse-papiers
          navigator.clipboard.writeText(recipeUrl).then(function () {
            alert("Le lien a été copié dans le presse-papiers !");
          }).catch(function (error) {
            console.error("Erreur lors de la copie du lien : ", error);
          });
        });
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des détails de la recette :', error);
      });
  } else {
    recipeDetailsContainer.innerHTML = `<p>Aucune recette sélectionnée.</p>`;
  }
});
