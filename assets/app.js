/**
 * definding a global object to access the returned results
 * from the searchRecipe function in order to access the results
 * in other areas of the app
 */
let allRecipes = [];
let resultsDiv;

// captureing the data fromt he search input
const form = document.getElementById("search-form");
// event listener, listening to the form elemenet input
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = event.target.elements.q.value;
  searchRecipes(query);
  // clearing the value of the search input 
  event.target.elements.q.value = "";
});

// fetch url id and key  and set up for the inital responses
// function to capture value from search input to use as query data in the end point
function searchRecipes(query) {
   
  const app_id = "ae5725d8";
  const app_key = "97b9c2c54f27b0932854e93d245cf97e";
  const url = `https://api.edamam.com/api/recipes/v2?type=public&beta=true&q=${query}&app_id=${app_id}&app_key=${app_key}`;
  // fetch call on the url return the results of the query
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const results = data.hits;
      // console.log(results);
    //   push all results on to a 
      for (let i = 0; i < results.length; i++) {
        const recipe = results[i].recipe;
        allRecipes.push(recipe);
      }
      if(!resultsDiv){
        // if it doesnt exist create the element
        resultsDiv= document.createElement('div');
        resultsDiv.id='results';
        document.body.appendChild(resultsDiv);
      }
      // once results passed on to the array renderResults
      renderRecipes();
    
    });
}
function renderRecipes() {
  
  resultsDiv.innerHTML='';

  for (let i = 0; i < allRecipes.length; i++) {
    const recipe = allRecipes[i];
    const title = recipe.label;
    const link = recipe.url;
    const image = recipe.image;
    const nutrients = recipe.totatlNutrients;

    const recipeDiv = document.createElement("div");
    recipeDiv.innerHTML = ` <h2>${title}</h2>
        <img src="${image}" alt="${title}">
        <a href="${link}" target="_blank">View Recipe</a>
        <ul>
            <li>hi</li>
            <li>i am a</li>
            <li>lis of items</li>
        </ul>`;

    resultsDiv.appendChild(recipeDiv);
  }
}
