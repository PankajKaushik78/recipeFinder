import Search from './models/Search';
import Recipe from './models/Recipe'
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, removeLoader } from './views/base';

/*
Maintaining the global state of our app
1. Current search object
2. Current Recipe Object
3. Current list object
4. Current liked recipes
*/

const state = {};

// ----SEARCH CONTROLLER-----


const controlSearch = async () => {
    //1. Get the query
    // const query = searchView.getInput();    
    const query = "pizza";    
    if(query) {
        //2. Create the search object
        state.search = new Search(query);
        
        //3. Prepare Ui for results
        searchView.clearInput();
        searchView.clearResult();
        renderLoader(elements.searchRes);
        
        try {
            //4. Make the api call 
            await state.search.getRecipes();
            
            //5 Render the result on UI
            removeLoader();
            searchView.renderRecipes(state.search.result);
        } catch (err) {
            alert("Something wrong happened in rendering the results. Please try another keyword");
            removeLoader();
        }
    }
};


window.addEventListener('load', controlSearch);

elements.searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    controlSearch();
});


elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if(btn){
        const goToPage = parseInt(btn.dataset.goto,10);
        searchView.clearResult();
        searchView.renderRecipes(state.search.result, goToPage);
    }
});

// ---RECIPE CONTROLLER---

const controlRecipe = async () => {
    const id = window.location.hash.replace('#','');
    
    if(id){
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
        if(state.search != null) searchView.highlightSelected(id);

        state.recipe = new Recipe(id);

        try {
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            
            state.recipe.calcTime();
            state.recipe.calcServings();
            
            removeLoader();
            recipeView.renderRecipe(state.recipe);  
        } catch(err) {
            alert("Error while loading recipe");
        }
    }
}

['hashchange', 'load'].forEach(e => window.addEventListener(e, controlRecipe));

//update servings and ingredients count
elements.recipe.addEventListener('click', e => {
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        if(state.recipe.servings > 1){
            state.recipe.updateIngredients('dec');
            recipeView.updateServingsAndIngredients(state.recipe);
        }
    }else if(e.target.matches('.btn-increase, .btn-increase *')){
        state.recipe.updateIngredients('inc');
        recipeView.updateServingsAndIngredients(state.recipe);
    }
});