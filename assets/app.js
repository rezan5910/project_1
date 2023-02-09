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

function renderRecipes() {


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
    // looping through all the recipes array and render each recipe as card
    for (let i = 0; i < allRecipes.length; i++) {
        const recipe = allRecipes[i];
        console.log(recipe)
        const title = recipe.label;
        const link = recipe.url;
        const image = recipe.image;

        const recipeDiv = document.createElement("div");
        recipeDiv.setAttribute('class', 'card mb-3')
        recipeDiv.innerHTML = `
        <div class="row g-0">
            <div class="col-md-4">
                 <img src="${image}" class="img-fluid rounded-start" alt="${title}">
            </div>
             <div class="col-md-8">
                    <div class="card-body">
                         <h2 class="card-title">${title}</h2>
                         <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#Modal${i}">View Recipe</button>
                         <button class="favorite-btn" data-index="${i}">Save as Favorite</button>

                     </div>
             </div>
         </div>
    `;
        let modalDiv = document.createElement("div");
        modalDiv.setAttribute("class", "modal fade");
        modalDiv.id = `Modal${i}`;
        modalDiv.tabIndex = -1;
        modalDiv.innerHTML = `
<div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" >${title}</h5>
        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        ... i need to put the recipe here/instruction
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
`
        recipeDiv.appendChild(modalDiv)



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

// Random recipe code

const randurl= 'http://www.themealdb.com/api/json/v1/1/random.php'

const getMealBtn = document.getElementById('get_meal');
const mealContainer = document.getElementById('meal');

getMealBtn.addEventListener('click', () => {
    fetch('https://www.themealdb.com/api/json/v1/1/random.php')
    .then(res => res.json())
    .then(res => {
        createMeal(res.meals[0])
    })
});

function createMeal(meal){
    const ingredients = [];
    for(i=1; i<=20; i++) {
        if(meal[`strIngredient${i}`]){
            ingredients.push(
                `${meal[`strIngredient${i}`]} - 
                ${meal[`strMeasure${i}`]}`
                )
        } else {
            break;
        }
    }


    mealContainer.innerHTML = `
    <div class="row">
        <div class="col-5">
            <img src="${meal.strMealThumb}" alt="Meal Image" />
            <p><strong>Category: </strong>${meal.strCategory}</p>
            <p><strong>Area: </strong>${meal.strArea}</p>
            <p><strong>Tags: </strong>${meal.strTags}</p>
            <h5>Ingredients</h5>
            <ul>
                ${ingredients.map(ingredient => `
                    <li>${ingredient}</li>
                `).join('')}
            </ul>
        </div>
        <div class="col-7">
        <h4>${meal.strMeal}</h4>
        <p>${meal.strInstructions}</p>
    </div>
    <div class="row">
        <h5>Video Recipe</h5>
        <div class="videoWrapper">
            <iframe src="https://www.youtube.com/embed/${meal.strYoutube.slice(-11)}"/>
        </div>
    </div>
    `;
}
