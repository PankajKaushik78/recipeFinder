import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => elements.searchInput.value = '';

export const clearResult = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};

const limitTitle = (title, limit=17) => {
    const res = [];
    if(title.length > 17){
        title.split(' ').reduce((acc, curr) => {
            if(acc + curr.length <= limit){
                res.push(curr);
            }
            return acc + curr.length; 
        }, 0);
        return `${res.join(' ')}...`;
    }
    return title;
}

const renderRecipe = recipe => {
    const markup = `
    <li>
        <a class="results__link" href="${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `;
    elements.searchResList.insertAdjacentHTML("beforeend", markup);
}

const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type == 'prev' ? page-1 : page+1}>
    <span>Page ${type == 'prev' ? page-1 : page+1}</span>
    <svg class="search__icon">
        <use href="img/icons.svg#icon-triangle-${type == 'prev' ? 'left' : 'right'}"></use>
    </svg>
    </button>
`;

const renderButtons = (page, totalElements, resPerPage) => {
    const pages = Math.ceil(totalElements/resPerPage);
    let button;
    if(page == 1 && pages > 1){
        button = createButton(page, 'next');
    }else if(page < pages){
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `;
    }else if(page == pages && pages > 1){
        button = createButton(page, 'prev')
    }
    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

export const renderRecipes = (recipes, page=2, resPerPage=5) => {
    const start = (page-1)*resPerPage;
    const end = page*resPerPage;

    recipes.slice(start,end).forEach(renderRecipe);
    renderButtons(page, recipes.length, resPerPage)
};