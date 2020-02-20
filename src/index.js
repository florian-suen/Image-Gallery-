import images from './image.index';
import './css/index.scss';

const LIGHTBOX = document.querySelector('.lightbox');

const NUMBER_GENERATOR = function numberGenerator(maxNumber) {
  return Math.floor(Math.random() * maxNumber) + 1;
};

document.querySelector('.gallery').addEventListener('click', (event) => {
  if (event.target.classList.contains('gallery__item')) {
    const IMAGE_SOURCE = event.target.firstChild.src;
    const LIGHTBOX_IMAGE = document.querySelector('.lightbox__image');
    LIGHTBOX_IMAGE.src = IMAGE_SOURCE;
    LIGHTBOX.classList.add('lightbox--open');
  }
});

LIGHTBOX.addEventListener('click', (event) => {
  event.currentTarget.classList.remove('lightbox--open');
});

function createImages(limit) {
  const IMAGE_ARRAY = [];
  const NUMBER_CACHE = new Set();

  for (let i = 0; i < limit; i += 1) {
    const IMAGE = document.createElement('img');
    let randomNumber = NUMBER_GENERATOR(images.length - 1);

    while (NUMBER_CACHE.has(randomNumber)) {
      randomNumber = NUMBER_GENERATOR(images.length - 1);
    }

    IMAGE.src = images[randomNumber].default;
    IMAGE_ARRAY.push(IMAGE);
    NUMBER_CACHE.add(randomNumber);
  }
  return IMAGE_ARRAY;
}

function loadImages(limit = 20) {
  const IMAGE_ARRAY = createImages(limit);
  const GALLERY_ELEMENT = document.querySelector('.gallery');
  const DOCUMENT_FRAGMENT = document.createDocumentFragment();

  IMAGE_ARRAY.forEach((element) => {
    const NEW_DIV = document.createElement('div');
    NEW_DIV.classList.add('gallery__item', `gallery__item--span${NUMBER_GENERATOR(5)}`);
    NEW_DIV.appendChild(element);
    DOCUMENT_FRAGMENT.appendChild(NEW_DIV);
  });
  GALLERY_ELEMENT.appendChild(DOCUMENT_FRAGMENT);
}

loadImages();
