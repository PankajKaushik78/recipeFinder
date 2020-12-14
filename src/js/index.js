import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements, renderLoader, removeLoader } from './views/base';

/*
Maintaining the global state of our app
1. Current search object
2. Current Recipe Object
3. Current list object
4. Current liked recipes
*/

const state = {};

const controlSearch = async () => {
    //1. Get the query
    const query = searchView.getInput();    
    if(query) {
        //2. Create the search object
        state.search = new Search(query);

        //3. Prepare Ui for results
        searchView.clearInput();
        searchView.clearResult();
        renderLoader(elements.searchRes);

        //4. Make the api call 
        await state.search.getRecipes();

        //5 Render the result on UI
        removeLoader();
        searchView.renderRecipes(state.search.result);
    }
};

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