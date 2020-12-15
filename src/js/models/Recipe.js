import axios from 'axios';

export default class Recipe {
    constructor(id){
        this.id = id;
    }

    async getRecipe(){
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.ingredients = res.data.recipe.ingredients;
            this.url = res.data.recipe.source_url;
            this.img = res.data.recipe.image_url;
            this.calcTime();
            this.calcServings();
        } catch(error) {
            alert("Something went wrong :(");
        }
    }

    calcTime() {
        //for every three ingredients we add 15 minutes
        const total = this.ingredients.length;
        const period = Math.ceil(total/3);
        this.time = period*15;
    }

    calcServings() {
        this.servings = 4;
    }
};
