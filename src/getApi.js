import axios, { AxiosHeaders } from 'axios';
AxiosHeaders.page = 1
// axios.defaults.baseURL =
//   'https://pixabay.com/api/?key=38354710-a3d6b3af700cce2a78ac34292';
export async function getImages(value,page = 1) {
  
  const images = await axios.get(`https://pixabay.com/api/`, {
    params: {
      key: '38354710-a3d6b3af700cce2a78ac34292',
      q:`${value}`,
      image_type: "photo",
      orientation: "horizontal",
      safesearch: true,
      per_page: 3,
      page: page
    },
   
  });
  console.log(images);

 

  return images
}