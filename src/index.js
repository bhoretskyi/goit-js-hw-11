import axios from 'axios';
import Notiflix from 'notiflix';

Notiflix.Notify.info('Cogito ergo sum');
axios
  .get('https://pixabay.com/api/?key=38354710-a3d6b3af700cce2a78ac34292')
  .then(response => response.data)
  .then(data => console.log(data))
  .catch(err => console.log(err));
