import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, removeLoader } from './views/base';

/*
Maintaining the global state of our app
1. Current search object
2. Current Recipe Object
3. Current list object
4. Current liked recipes
*/

const state = {};
window.state = state;

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
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));  
        } catch(err) {
            alert("Error while loading recipe");
        }
    }
}

['hashchange', 'load'].forEach(e => window.addEventListener(e, controlRecipe));

/*----LIST controller---*/ 
const controlList = () => {
    if(!state.list) state.list = new List();

    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.addItem(item);
    });
}

elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.id;

    if(e.target.matches('.shopping__delete, .shopping__delete *')){
        state.list.deleteItem(id);
        listView.removeItem(id);
    }else if(e.target.matches('.shopping_item-data')){
        const newCount = e.target.value;
        state.list.updateCount(id, parseFloat(newCount));
    }
});


/*----LIKES controller---*/ 
const controlLike = () => {
    if(!state.likes) state.likes = new Likes();
    const currId = state.recipe.id;

    //if the recipe is NOT LIKED
    if(!state.likes.isLiked(currId)){
        //add recipe to the likes state/ds
        state.likes.addLike(
            currId,
            state.recipe.title,
            state.recipe.img,
            state.recipe.author
        );

        //toggle the ui
        likesView.addLike();
        
        //add recipe to the likes ui
        likesView.addToUI(state.recipe);

    // if the recipe is already LIKED
    }else{
        //add recipe to the likes state/ds
        state.likes.deleteLike(currId);

        //toggle the ui
        likesView.removeLike();
        
        //add recipe to the likes ui
        likesView.removeFromUI(currId);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
}

//persist liked recipes
window.addEventListener('load', () => {
    state.likes = new Likes();
    state.likes.retrieveData();

    likesView.toggleLikeMenu(state.likes.getNumLikes());

    state.likes.likes.forEach(el => likesView.addToUI(el));
})


//Handling event listeners on recipe
elements.recipe.addEventListener('click', e => {
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        if(state.recipe.servings > 1){
            state.recipe.updateIngredients('dec');
            recipeView.updateServingsAndIngredients(state.recipe);
        }
    }else if(e.target.matches('.btn-increase, .btn-increase *')){
        state.recipe.updateIngredients('inc');
        recipeView.updateServingsAndIngredients(state.recipe);
    //Add items to the shopping list
    }else if(e.target.matches('.recipe__btn-add, .recipe__btn-add *')){
        controlList();
    //Like or unlike the recipe
    }else if(e.target.matches('.recipe__love, .recipe__love *')){
        controlLike();
    }
});

