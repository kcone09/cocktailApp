class CocktailAPI {

    async getDrinksByName(name) {
        const apiResponse = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${name}`);
        const cocktails = await apiResponse.json();
        return {
            cocktails
        }
    }

    async getDrinksByIngredient(ingredient) {
        const apiResponse = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingredient}`);
        const cocktails = await apiResponse.json();
        //console.log(cocktails)
        return {
            cocktails
        }
    }

    async getSingleRecipe(id) {
        const apiResponse = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);
        const recipe = await apiResponse.json();
        return {
            recipe
        }
    }

    async getCategories() {
        const apiResponse = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list`);
        const categories = await apiResponse.json();
        return {
            categories
        }
    }

    async getDrinksByCategory(cat) {
        const apiResponse = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${cat}`);
        const cocktails = await apiResponse.json();
        return {
            cocktails
        }
    }

    async getDrinkIfAlcohol(alcohol) {
        const apiResponse = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=${alcohol}`);
        const cocktails = await apiResponse.json();
        console.log(cocktails)
        return {
            cocktails
        }
    }
}