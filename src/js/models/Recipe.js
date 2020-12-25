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
        } catch(error) {
            alert("Something went wrong :(");
        }
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];

        const newIngredients = this.ingredients.map(el => {
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => unitsShort.includes(el2));
            
            let finalIng; 

            if(unitIndex > -1){
                const unitIng = arrIng.slice(0,unitIndex);
                let count;
                if(unitIng.length == 1){
                    count = eval(unitIng[0].replace('-','+'));
                }else{
                    count = eval(unitIng.join('+'));
                }

                finalIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex+1).join(' ')
                };

            }else if(parseInt(arrIng[0], 10)){
                finalIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: "",
                    ingredient: arrIng.slice(1).join(' ')
                };
            }else if(unitIndex == -1){
                finalIng = {
                    count: 1,
                    unit: "",
                    ingredient
                };
            }

            return finalIng;
        });

        this.ingredients = newIngredients;
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
