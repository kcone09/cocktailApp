class UI {

    text_truncate = function(str, length, ending) {
        if (length == null) {
            length = 100;
        }
        if (ending == null) {
            ending = '...';
        }
        if (str.length > length) {
            return str.substring(0, length - ending.length) + ending;
        } else {
            return str;
        }
    };

    displayCategories() {
        const categoriesList = cocktail.getCategories()
            .then(categories => {
                const catList = categories.categories.drinks;

                const firstOpion = document.createElement('option');
                firstOpion.textContent = '- Select -';
                firstOpion.value = '';
                document.querySelector('#search').appendChild(firstOpion);

                catList.forEach(category => {
                    const option = document.createElement('option');
                    option.textContent = category.strCategory;
                    option.value = category.strCategory.split(' ').join('_');

                    document.querySelector('#search').appendChild(option);
                });
            });
    }

    displayDrinks(drinks) {
        const resultsWrapper = document.querySelector('.results-wrapper');
        resultsWrapper.style.display = 'block';
        const resultsDiv = document.querySelector('#results');
        drinks.forEach(drink => {
            resultsDiv.innerHTML += `
            <div class="col-md-4 d-flex">
                 <div class="card my-3">
                      <button type="button" data-id="${drink.idDrink}" class="favorite-btn btn btn-outline-info">
                      +
                      </button>
                      <img class="card-img-top" src="${drink.strDrinkThumb}" alt="${drink.strDrink}" onerror="this.onerror=null;this.src='cocktail-flat-icon.png';">
                      <div class="card-body flex-fill">
                           <h2 class="card-title text-center">${drink.strDrink}</h2>
                           <a data-target="#recipe" class="btn btn-success get-recipe" href="#" data-toggle="modal" data-id="${drink.idDrink}">Get Recipe</a>
                      </div>
                 </div>
            </div>
       `;
        });
        this.isFavorite()
    }

    // displayDrinksWithIngredients(drinks) {
    //     const resultsWrapper = document.querySelector('.results-wrapper');
    //     resultsWrapper.style.display = 'block';
    //     const resultsDiv = document.querySelector('#results');
    //     drinks.forEach(drink => {
    //         resultsDiv.innerHTML += `
    //         <div class="col-md-6">
    //              <div class="card my-3">
    //                   <button type="button" data-id="${drink.idDrink}" class="favorite-btn btn btn-outline-info">
    //                   +
    //                   </button>
    //                   <img class="card-img-top" src="${drink.strDrinkThumb}" alt="${drink.strDrink}" onerror="this.onerror=null;this.src='wine-svg-clipart.png';">

    //                   <div class="card-body">
    //                        <h2 class="card-title text-center">${drink.strDrink}</h2>
    //                        <p class="card-text font-weight-bold">Instructions: </p>
    //                        <p class="card-text">
    //                              ${drink.strInstructions}
    //                        </p>
    //                        <p class="card-text">
    //                             <ul class="list-group">
    //                                  <li class="list-group-item alert alert-danger">Ingredients</li>
    //                                  ${this.displayIngredientMeasurement(drink)}
    //                             </ul>
    //                        </p>
    //                        <p class="card-text font-weight-bold">Extra Information:</p>
    //                        <p class="card-text">
    //                             <span class="badge badge-pill badge-success">
    //                                  ${drink.strAlcoholic}
    //                             </span>
    //                             <span class="badge badge-pill badge-warning">
    //                                  Category: ${drink.strCategory}
    //                             </span>
    //                        </p>
    //                   </div>
    //              </div>
    //         </div>
    //    `;
    //     });
    //     this.isFavorite()
    // }

    displayIngredientMeasurement(drink) {
        // console.log(drink)
        let ingredients = [];

        for (let i = 1; i < 16; i++) {
            const IngredientMeasure = {};
            if (drink[`strIngredient${i}`] !== null) {
                IngredientMeasure.ingredient = drink[`strIngredient${i}`];
                if (drink[`strMeasure${i}`] !== null) {
                    IngredientMeasure.measure = drink[`strMeasure${i}`];
                } else {
                    IngredientMeasure.measure = '';
                }


                ingredients.push(IngredientMeasure);
            }
        }
        // console.log(ingredients)

        // display ingredients template
        let ingredientsTemplate = '';
        ingredients.forEach(ingredient => {
            ingredientsTemplate += `
            <li class="list-group-item">${ingredient.ingredient} - ${ingredient.measure}</li>
            `;
        });
        return ingredientsTemplate;
    }

    diplayRecipe(recipe) {
        const modalTitle = document.querySelector('.modal-title'),
            descriptionText = document.querySelector('.description-text'),
            ingredientList = document.querySelector('.ingredient-list .list-group'),
            alc = document.querySelector('.alc'),
            cate = document.querySelector('.cate');

        modalTitle.textContent = recipe.strDrink;
        descriptionText.textContent = recipe.strInstructions;
        ingredientList.innerHTML = `${this.displayIngredientMeasurement(recipe)}`
        alc.innerHTML = recipe.strAlcoholic
        cate.innerHTML = `Category: ${recipe.strCategory}`
    }

    printMsg(msg, className) {
        const div = document.createElement('div');

        div.innerHTML = `
            <div class="alert alert-dismissible alert-${className}">
                <button type="button" class="close" data-dismiss="alert">x</button>
                ${msg}
            </div>
        `

        const reference = document.querySelector('.jumbotron h1');
        const parentNode = reference.parentElement;
        parentNode.insertBefore(div, reference);

        //remove msg after 5 sec
        setTimeout(() => {
            document.querySelector('.alert').remove();
        }, 5000)
    }

    clearResults() {
        const resultsDiv = document.querySelector('#results');
        resultsDiv.innerHTML = '';
    }

    displayFavorites(fav) {
        const favoritesTable = document.querySelector('#favorites tbody');

        fav.forEach(drink => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
            <td>
                    <img src="${drink.image}" alt="${drink.name}" width=100>
            </td>
            <td>${drink.name}</td>
            <td>
                    <a href="#" data-toggle="modal" data-target="#recipe" data-id="${drink.id}" class="btn btn-success get-recipe" >
                        View
                    </a>
            </td>
            <td>
                    <a href="#" data-id="${drink.id}" class="btn btn-danger remove-recipe" >
                        Remove
                    </a>
            </td>
            `;
            favoritesTable.appendChild(tr);
        });

    }

    removeFav(element) {
        element.remove();
    }

    // Add a Class when cocktail is favorite
    isFavorite() {
        const drinks = cocktailDB.getFromDB();

        drinks.forEach(drink => {
            // destructuring the id
            let { id } = drink;

            // Select the favorites
            let favoriteDrink = document.querySelector(`[data-id="${id}"]`);
            if (favoriteDrink) {
                favoriteDrink.classList.add('is-favorite');
                favoriteDrink.textContent = '-';
            }
        })
    }


}