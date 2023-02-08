// variable storing the form , resultsdiv and all the returned recipes
const form = document.getElementById("search-form");
const resultsDiv = document.getElementById("results");
const allRecipes = [];
//api credentials and url
/**
 * still to learn how to store this in an .env and not on github
 */
const app_id = "ae5725d8";
const app_key = "97b9c2c54f27b0932854e93d245cf97e";
const url = `https://api.edamam.com/api/recipes/v2?type=public&beta=true&app_id=${app_id}&app_key=${app_key}`;

// evListener for form submit 
form.addEventListener("submit", (event) => {
    // prevent the default behaviour 
  event.preventDefault();
  //query based on form value
  const query = event.target.elements.q.value;
//   emptiying the allrecipe array
  allRecipes.length = 0;
//   calling the render function with the relevant query passed as argument
  searchRecipes(query);
});
// function to search the recipes using the query data fromt he form 
function searchRecipes(query) {
    // building a search url based on the api url pramaters
  const searchUrl = `${url}&q=${query}`;
  fetch(searchUrl)
    .then((response) => response.json())
    .then((data) => {
      const results = data.hits;
    //   pushing the results into the all recipe array
      for (let i = 0; i < results.length; i++) {
        const recipe = results[i].recipe;
        allRecipes.push(recipe);
      }
    //   calling the renderrecipe function
      renderRecipes();
    //   clearing the form input after the search is made
    //   event.target.elements.q.value = '';
    });
}
// render function rendering the information to the cards
function renderRecipes() {
    // if the rsult div isnt available creating one
  if (!resultsDiv) {
    resultsDiv = document.createElement('div');
    resultsDiv.id = 'results';
    document.body.appendChild(resultsDiv);
  }
//   clearing the results div before rending the new search 
  resultsDiv.innerHTML = '';
// looping through all the recipes array and render each recipe as card
  for (let i = 0; i < allRecipes.length; i++) {
    const recipe = allRecipes[i];
    const title = recipe.label;
    const link = recipe.url;
    const image = recipe.image;

    const recipeDiv = document.createElement("div");
    recipeDiv.innerHTML = `
        <h2>${title}</h2>
        <img src="${image}" alt="${title}">
        <a href="${link}" target="_blank">View Recipe</a>
        <button class="favorite-btn" data-index="${i}">Save as Favorite</button>
    `;

    resultsDiv.appendChild(recipeDiv);
  }
//adding event listener to the fave button to save the rcipe 
  const favoriteBtns = document.querySelectorAll(".favorite-btn");
  favoriteBtns.forEach(btn => {
    btn.addEventListener("click", event => {
      const index = event.target.dataset.index;
      saveAsFavorite(index);
    });
  });
}

function saveAsFavorite(index) {
  const recipe = allRecipes[index];
  if (!localStorage.getItem("favorites")) {
    localStorage.setItem("favorites", JSON.stringify([recipe]));
  } else {
    const favorites = JSON.parse(localStorage.getItem("favorites"));
    favorites.push(recipe);
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }
}

