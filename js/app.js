// Initiate classes

const ui = new UI(),
    cocktail = new CocktailAPI(),
    cocktailDB = new CocktailDB();




// Create event listeners
function eventListeners() {

    document.addEventListener('DOMContentLoaded', documentReady);

    //form submission
    const searchForm = document.querySelector('#search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', getCocktails)
    }

    const resultsDiv = document.querySelector('#results');
    if (resultsDiv) {
        resultsDiv.addEventListener('click', resultsDelegation)
    }
}

eventListeners();

function getCocktails(e) {
    e.preventDefault();

    const search = document.getElementById('search').value;

    if (search === '') {
        ui.printMsg('Please add something into the form', 'danger');
    } else {
        // server response from promise
        let serverResponse;

        // type of search i.e. ingrediente, cocktails or name
        let type = document.querySelector('#type').value;

        // evaluate type of method

        switch (type) {
            case 'name':
                serverResponse = cocktail.getDrinksByName(search);
                break;
            case 'ingredient':
                serverResponse = cocktail.getDrinksByIngredient(search);
                break;
            case 'category':
                serverResponse = cocktail.getDrinksByCategory(search);
                break;
            case 'alcohol':
                serverResponse = cocktail.getDrinkIfAlcohol(search)
        }

        ui.clearResults();

        serverResponse.then(cocktails => {
            if (cocktails.cocktails.drinks === null) {
                ui.printMsg('Search not found', 'danger');
            } else {
                if (type === 'name') {
                    ui.displayDrinksWithIngredients(cocktails.cocktails.drinks);
                } else {
                    ui.displayDrinks(cocktails.cocktails.drinks);
                }

                // console.log(cocktails.cocktails.drinks)
            }
        });
        serverResponse.catch(error => {
            ui.printMsg('Search not found', 'danger');
        })
    }

}

function resultsDelegation(e) {
    e.preventDefault();

    if (e.target.classList.contains('get-recipe')) {
        cocktail.getSingleRecipe(e.target.dataset.id)
            .then(recipe => {
                ui.diplayRecipe(recipe.recipe.drinks[0]);
                //console.log(recipe.recipe.drinks[0])
            });
    }

    if (e.target.classList.contains('favorite-btn')) {
        if (e.target.classList.contains('is-favorite')) {

            // remove class
            e.target.classList.remove('is-favorite');
            e.target.textContent = '+';
            cocktailDB.removeFromDB(e.target.dataset.id); //remove from storage
        } else {
            e.target.classList.add('is-favorite');
            e.target.textContent = '-';

            const cardBody = e.target.parentElement;

            const drinkInfo = {
                id: e.target.dataset.id,
                name: cardBody.querySelector('.card-title').textContent,
                image: cardBody.querySelector('.card-img-top').src
            }

            // console.log(drinkInfo)

            // add to storage
            cocktailDB.saveIntoDB(drinkInfo);
        }
    }
}

function documentReady() {

    // display fav drinks onload from local storage

    ui.isFavorite();

    const searchCategory = document.querySelector('.search-category');

    if (searchCategory) {
        ui.displayCategories();
    }

    const favoritesTable = document.querySelector('#favorites');

    if (favoritesTable) {
        const drinks = cocktailDB.getFromDB();
        ui.displayFavorites(drinks);

        favoritesTable.addEventListener('click', (e) => {
            e.preventDefault();

            //delegation
            if (e.target.classList.contains('get-recipe')) {
                cocktail.getSingleRecipe(e.target.dataset.id)
                    .then(recipe => {
                        ui.diplayRecipe(recipe.recipe.drinks[0]);
                        //console.log(recipe.recipe.drinks[0])
                    });
            }

            if (e.target.classList.contains('remove-recipe')) {
                ui.removeFav(e.target.parentElement.parentElement);
                // console.log(e.target.parentElement.parentElement)
                cocktailDB.removeFromDB(e.target.dataset.id);
            }


        });
    }
}