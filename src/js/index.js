import Search from './models/Search';

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
    const query = 'pizza';

    if(query) {
        //2. Create the search object
        state.search = new Search(query);

        //3. spinner or loader

        //4. Make the api call 
        await state.search.getRecipes();

        //5 Render the result on UI
        console.log(state.search.result);

    }
};

document.querySelector('.search').addEventListener('submit', (e) => {
    e.preventDefault();
    controlSearch();
});


const search = new Search("pasta");
