export default class Likes {
    constructor(){
        this.likes = [];
    }

    addLike(id, title, img, author){
        const like = {id, title, img, author};
        this.likes.push(like);
        this.persistData();
        return like;
    }

    deleteLike(id) {
        const idx = this.likes.findIndex(el => el.id === id);
        this.likes.splice(idx, 1);
        this.persistData();
    }

    isLiked(id){
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    getNumLikes(){
        return this.likes.length;
    }

    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    retrieveData() {
        const storage = JSON.parse(localStorage.getItem('likes'));
        if(storage) this.likes = storage;
    }

};