import { renderImagesMarkup } from './helpers/markup';
import { PixabayApi } from './helpers/api-service';
import { LoadMoreBtn } from './helpers/load-more-btn';
import './css/styles.css'
import { Notify } from 'notiflix';
import { throttle } from "lodash";
import SimpleLightbox from 'simplelightbox';
// Дополнительный импорт стилей
import 'simplelightbox/dist/simple-lightbox.min.css';
const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');

const pixabay = new PixabayApi();
let simpleLightbox = new SimpleLightbox('.gallery a');
const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});
form.addEventListener('submit', throttle(searchImages, 300));
loadMoreBtn.refs.button.addEventListener('click', throttle(loadMoreImages, 300));
function searchImages(ev) {
    ev.preventDefault();
    clearGallery();
    const searchCategory = ev.currentTarget.elements.searchQuery.value.trim();
    console.log(searchCategory)
    pixabay.search = searchCategory;
    if (pixabay.search === '') {
        loadMoreBtn.hide();
        return Notify.info('Enter a search category!');
    }
    pixabay.resetPage();
    const downloadImg = pixabay.downloadImages();
    downloadImg.then(data => {
        if (data.hits.length === 0) {
            loadMoreBtn.hide();
            return Notify.failure('Sorry, there are no images matching your search query. Please try again.')
        }
        const markupCards = renderImagesMarkup(data.hits);
        addImagesInMarkup(markupCards);
        if (data.totalHits > pixabay.perPage) {
            loadMoreBtn.show();
        }
        if (data.totalHits > 0) {
            return Notify.info(`Hooray! We found ${data.totalHits} images.`);
        }
    });
};

function loadMoreImages() {
    const moreImg = pixabay.downloadImages();
    moreImg.then(data => {
    const imagesCards = renderImagesMarkup(data.hits);
    addImagesInMarkup(imagesCards);
        addGalleryScroll();
        if (data.totalHits === gallery.children.length) {
            Notify.failure("We're sorry, but you've reached the end of search results.");
            loadMoreBtn.hide();
     }
  })
};

function addImagesInMarkup(cards) {
  gallery.insertAdjacentHTML('beforeend', cards)
  simpleLightbox.refresh();  
};
function clearGallery() {
    gallery.innerHTML = '';
};
function addGalleryScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

     window.scrollBy({
     top: cardHeight * 2,
     behavior: 'smooth',
    });
};