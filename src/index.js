import Notiflix from 'notiflix';
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
refs.input.addEventListener('input', ()=>{
  refs.button.disabled = false
})




refs.button.addEventListener('click', e => {
  e.preventDefault();

  newImages(refs.input.value);
 
});
let page = 1;
async function newImages(value) {
  const desktop = await getImages(value, page)
    .then(resp => {
      if (resp.status !== 200) {
        throw new Error('error');
      }  
      page += 1;
      refs.loader.hidden = false;
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
async function addImages(value) {
  refs.loader.hidden = true;
  const desktop = await getImages(value, page)
    .then(resp => {
      page += 1;
      console.log(page);
      if (resp.status !== 200) {
        throw new Error('error');
      }
      refs.loader.hidden = false;
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