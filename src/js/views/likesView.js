import { elements } from "./base";

export const addLike = () => {
    document.querySelector('.header_likes-img').setAttribute('href', "img/icons.svg#icon-heart");
};

export const removeLike = () => {
    document.querySelector('.header_likes-img').setAttribute('href', "img/icons.svg#icon-heart-outlined");
};

export const addToUI = (like) =>  {
    const markup = `
        <li class= "likes_list" data-id="${like.id}">
            <a class="likes__link" href="#${like.id}">
                <figure class="likes__fig">
                    <img src="${like.img}" alt="${like.title}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${like.title}</h4>
                    <p class="likes__author">${like.author}</p>
                </div>
            </a>
        </li>
    `;
    elements.likes.insertAdjacentHTML('beforeend', markup);
};

export const removeFromUI = (id) => {
    const likes = Array.from(document.querySelectorAll(".likes_list"));
    likes.forEach(curr => {
        if(curr.dataset.id === id){
            const el = curr;
            if(el)
                el.parentElement.removeChild(el);
        }
    });
};

export const toggleLikeMenu = numLikes => {
    elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
};  