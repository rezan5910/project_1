// variable storing the form , resultsdiv and all the returned recipes
const form = document.getElementById("search-form");
const resultsDiv = document.getElementById("results");
const allRecipes = [];
// favorites array declared globally
let favorites = [];
// //favorites button which gets the values stored in local storage
// // declared globally
const getMyFaves = document.createElement('button');
getMyFaves.innerHTML = 'My Faves';
getMyFaves.classList.add('get-fave-btn');
document.body.appendChild(getMyFaves);

//api credentials and url
/**
 * still to learn how to store this in an .env and not on github
 */
const app_id = "ae5725d8";
const app_key = "012bf6f9faddd0a7847767f3d2801c2e";
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
    //   event.target.elements.q.value = "";
    });
}
// render function rendering the information to the cards
function renderRecipes() {
  // if the rsult div isnt available creating one
  if (!resultsDiv) {
    resultsDiv = document.createElement("div");
    resultsDiv.id = "results";
    document.body.appendChild(resultsDiv);
  }
  //   clearing the results div before rending the new search
  resultsDiv.innerHTML = "";
  // looping through all the recipes array and render each recipe as card
  for (let i = 0; i < allRecipes.length; i++) {
    const recipe = allRecipes[i];
    const title = recipe.label;
    const link = recipe.url;
    const image = recipe.image;
    const ingr = recipe.ingredients.keys();
    // const calorie = recipe.calories

    const recipeDiv = document.createElement("div");
    recipeDiv.innerHTML = `
        <h2>${title}</h2>
        <img src="${image}" alt="${title}">
        <a href="${link}" target="_blank">View Recipe</a>
        <p>${ingr}</p>
        <button class="save-btn" data-index="${i}">Save </button>
    `;

    resultsDiv.appendChild(recipeDiv);
  }
  //adding event listener to the fave button to save the rcipe
  const saveBtns = document.querySelectorAll(".save-btn");
  saveBtns.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const index = event.target.dataset.index;
      saveAsFavorite(index);
    });
  });
}

// event listner to listen on getmyfaves btn
getMyFaves.addEventListener('click',()=>{
    allRecipes.length =0;
    if (localStorage.getItem('favorites')){
        allRecipes.push(...JSON.parse(localStorage.getItem('favorites')));
    }
    renderRecipes();
});


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
