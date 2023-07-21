import Notiflix from 'notiflix';
import { getImages } from './getApi';
import axios, { AxiosHeaders } from 'axios';

const refs = {
  form: document.querySelector('.search-form'),
  button: document.querySelector('button'),
  input: document.querySelector('input'),
  gallery: document.querySelector('.gallery'),
};

refs.button.addEventListener('click', e => {
  e.preventDefault();

  postImages(refs.input.value);
});

async function postImages(value) {
  const desktop = await getImages(value)
    .then(response => {
      
      if (response === undefined) {
        throw new Error('error');
      }

      return response;
    })
    .catch(err => console.log(err));

    
  return  await desktop.map(image => {
    console.log(image);
    refs.gallery.insertAdjacentHTML(
      'beforeend',
      `<div class="photo-card">
  <img src="${image.previewURL
  }" alt="" loading="lazy" />
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
