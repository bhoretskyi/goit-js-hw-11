import Notiflix, { Notify } from 'notiflix';
import { getImages } from './getApi';
import axios, { AxiosHeaders } from 'axios';

const refs = {
  form: document.querySelector('.search-form'),
  button: document.querySelector('button'),
  input: document.querySelector('input'),
  gallery: document.querySelector('.gallery'),
  loader: document.querySelector('.load-more'),
};
refs.loader.hidden = true;
refs.button.disabled = true;
refs.input.addEventListener('input', () => {
  refs.button.disabled = false;
});
const firstPage = 1;
let nextPage = 2;

refs.button.addEventListener('click', e => {
  e.preventDefault();

  newImages(refs.input.value);
});
let hits = 0;

async function newImages(value) {
  const desktop = await getImages(value, firstPage)
    .then(resp => {
      if (resp.status !== 200) {
        throw new Error('error');
      }
      if (resp.data.hits.length === 0) {
        resp.loader.hidden = true;
        Notiflix.Report.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      if (resp.data.hits.length > 0) {
        Notify.success(`Hooray! We found ${resp.data.totalHits} images.`);
      }
      hits += resp.data.hits.length;
      if (resp.data.totalHits > resp.config.params.per_page) {
        refs.loader.hidden = false;
      }
      refs.gallery.innerHTML = '';
      return resp.data.hits;
    })
    .catch(err =>
      Notiflix.Report.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      )
    );
  return await desktop.map(image => {
    refs.gallery.insertAdjacentHTML(
      'beforeend',
      `<div class="photo-card">
  <img src="${image.previewURL}" alt="" loading="lazy" />
  <div class="info">
    <p class="info-item">
    <b>Likes: ${image.likes}</b>
    </p>
    <p class="info-item">
      <b>Views:${image.views}</b>
    </p>
    <p class="info-item">
      <b>Comments:${image.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads:${image.downloads}</b>
    </p>
  </div>
</div>`
    );
  });
}
refs.loader.addEventListener('click', () => {
  addImages(refs.input.value);
});

async function addImages(value) {
  refs.loader.hidden = true;

  const desktop = await getImages(value, nextPage)
    .then(resp => {
      hits += resp.data.hits.length;
      nextPage += 1;
      if (resp.status !== 200) {
        throw new Error('error');
      }
      if (resp.data.totalHits > resp.config.params.per_page) {
        refs.loader.hidden = false;
      }
      if (resp.data.hits.length === 0) {
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
        refs.loader.hidden = true;
      }

      return resp.data.hits;
    })
    .catch(err => {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    });

  return await desktop.map(image => {
    refs.gallery.insertAdjacentHTML(
      'beforeend',
      `<div class="photo-card">
  <img src="${image.previewURL}" alt="" loading="lazy" />
  <div class="info">
    <p class="info-item">
    <b>Likes: ${image.likes}</b>
    </p>
    <p class="info-item">
      <b>Views:${image.views}</b>
    </p>
    <p class="info-item">
      <b>Comments:${image.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads:${image.downloads}</b>
    </p>
  </div>
</div>`
    );
  });
}
