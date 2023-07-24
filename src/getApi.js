import axios, { AxiosHeaders } from 'axios';

export async function getImages(value, page) {
  const images = await axios.get(`https://pixabay.com/api/`, {
    params: {
      key: '38354710-a3d6b3af700cce2a78ac34292',
      q: `${value}`,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
      page,
    },
  });
  
return images
}
