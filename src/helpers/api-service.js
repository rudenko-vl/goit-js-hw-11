import axios from "axios";
axios.defaults.baseURL = 'https://pixabay.com/api';
const KEY = '24356529-6185a224b0d5bc228eaca8b03';

export class PixabayApi {
    constructor() {
        this.searchImages = '';
        this.page = 1;
        this.perPage = 40;
    }
    get search() {
        return this.searchImages;
    };
    set search(newImages) {
        this.searchImages = newImages;
    }
    nextDownloadPage() {
        this.page += 1;
    }
    resetPage() {
       this.page = 1; 
    }
    async downloadImages() {
        try {
            const response = await axios.get(`/?key=${KEY}&q=${this.searchImages}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=${this.perPage}`);
            const data = await response.data;
            this.nextDownloadPage()
            return data;
        } catch (error) {
            console.log(error);
        }
    }
};


