import Notiflix, { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { getImages } from './getApi';
import simpleLightbox from 'simplelightbox';
console.log(SimpleLightbox);

const refs = {
  form: document.querySelector('.search-form'),
  button: document.querySelector('button'),
  input: document.querySelector('input'),
  gallery: document.querySelector('.gallery'),
  loader: document.querySelector('.load-more'),
};
refs.loader.hidden = true;
refs.button.disabled = true;
refs.input.addEventListener('input', e => {
  refs.button.disabled = false;
  if (e.target.value === '') {
    refs.button.disabled = true;
  }
});
let gallery = new SimpleLightbox('.gallery a');
gallery.on('show.simplelightbox', function () {
  // do something…
});

gallery.on('error.simplelightbox', function (e) {
  console.log(e); // some usefull information
});

const firstPage = 1;
let nextPage = 2;

refs.loader.addEventListener('click', () => {
  addImages(refs.input.value);
});

refs.button.addEventListener('click', e => {
  e.preventDefault();
  newImages(refs.input.value);
});

async function newImages(value) {
  const desktop = await getImages(value, firstPage)
    .then(resp => {
      if (resp.status !== 200) {
        throw new Error('error');
      }
      if (resp.data.hits.length === 0) {
        refs.gallery.innerHTML = '';
        refs.loader.hidden = true;

        Notiflix.Report.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      if (resp.data.hits.length > 0) {
        Notify.success(`Hooray! We found ${resp.data.totalHits} images.`);
      }

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
    )
    .finally(console.log('efef'));

  return await desktop.map(image => {
    console.log(image);
    refs.gallery.insertAdjacentHTML(
      'beforeend',
      `<a href="${image.largeImageURL}"><div class="photo-card">
  <img src="${image.previewURL}" alt="${image.tags}" width="250" loading="lazy " />
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
</div></a>`
    );
    gallery.refresh();
  });
}

async function addImages(value) {
  refs.loader.hidden = true;
  const desktop = await getImages(value, nextPage)
    .then(resp => {
      nextPage += 1;
      if (resp.status !== 200) {
        throw new Error('error');
      }
      if (resp.data.totalHits > resp.config.params.per_page) {
        refs.loader.hidden = false;
      }
      if (resp.data.hits.length < resp.config.params.per_page) {
        refs.loader.hidden = true;
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
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
      `<a href="${image.largeImageURL}"><div class="photo-card">
      <img src="${image.previewURL}" alt="${image.tags}" width="250" loading="lazy " />
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
    </div></a>`
    );
    gallery.refresh();
  });
}
