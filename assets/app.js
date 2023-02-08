// Edamam data.

let edappi = "https//:api.edamam.com/api/food-database/v2/parser"
let edappId = "0476dd24"
let edappiKey = "8c218a390102fe4aaef56c233b1a1c53"

// Mealdb data.
var Meal1 = "www.themealdb.com/api/json/v1/1/random.php"


fetch('{Meal1}q=meals')
.then(response => response.json())
.then(meals => {
    
    console.log(meals[3])
})
