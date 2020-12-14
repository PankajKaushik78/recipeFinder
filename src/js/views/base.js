export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchRes: document.querySelector('.results'),
    searchResList: document.querySelector('.results__list'),
    searchResPages: document.querySelector('.results__pages')
}

export const elementsStrings = {
    loader: 'loader',
};

export const renderLoader = parent => {
    const markup = `
        <div class="${elementsStrings.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;
    parent.insertAdjacentHTML('afterbegin', markup);
};

export const removeLoader = () => {
    const loader = document.querySelector(`.${elementsStrings.loader}`);
    if(loader) loader.parentElement.removeChild(loader);
};