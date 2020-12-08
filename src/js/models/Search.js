import axios from 'axios';

export default class Search {
    constructor(query){
        this.query = query;
    }

    async getRecipes(){
        const url = `https://forkify-api.herokuapp.com/api/search?&q=${this.query}`;
        try {
            const res = await axios(url);
            this.result = res.data.recipes;
            // console.log(this.result);
        } catch (error) {
            console.log(error);
        }
    }
};