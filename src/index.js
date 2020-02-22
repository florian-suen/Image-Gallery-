import images from './image.index';
import './css/index.scss';

const QUERY = {
  lightbox: document.querySelector('.lightbox'),
  gallery: document.querySelector('.gallery'),
  lightboxImage: {
    current: document.querySelector('.lightbox__image1'),
    prev: document.querySelector('.lightbox__image0'),
    next: document.querySelector('.lightbox__image2')
  }
};

const STATE = {
  imageMouseDown: false
};

const NUMBER_GENERATOR = function numberGenerator(maxNumber) {
  return Math.floor(Math.random() * maxNumber) + 1;
};

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
  const DOCUMENT_FRAGMENT = document.createDocumentFragment();

  IMAGE_ARRAY.forEach((element) => {
    const NEW_DIV = document.createElement('div');
    NEW_DIV.classList.add('gallery__item', `gallery__item--span${NUMBER_GENERATOR(5)}`);
    NEW_DIV.appendChild(element);
    DOCUMENT_FRAGMENT.appendChild(NEW_DIV);
  });
  QUERY.gallery.appendChild(DOCUMENT_FRAGMENT);
}

loadImages();

const INITIAL_LIGHTBOX_IMAGE_OFFSET = {
  top: null,
  left: null
};

function setImageSrc(event) {
  const IMAGE_SOURCE = event.target.firstChild.src;
  const IMAGE_SOURCE_PREV = event.target.previousElementSibling.firstChild.src;
  const IMAGE_SOURCE_NEXT = event.target.nextElementSibling.firstChild.src;
  QUERY.lightboxImage.current.src = IMAGE_SOURCE;
  QUERY.lightboxImage.prev.src = IMAGE_SOURCE_PREV;
  QUERY.lightboxImage.next.src = IMAGE_SOURCE_NEXT;
}

QUERY.gallery.addEventListener('click', (event) => {
  if (event.target.classList.contains('gallery__item')) {
    setImageSrc(event);
    QUERY.lightbox.classList.add('lightbox--open');
  }
});

function setLightboxImagePosition() {
  INITIAL_LIGHTBOX_IMAGE_OFFSET.top = QUERY.lightboxImage.current.offsetTop;
  INITIAL_LIGHTBOX_IMAGE_OFFSET.left = QUERY.lightboxImage.current.offsetLeft;
  QUERY.lightboxImage.current.style.top = `${INITIAL_LIGHTBOX_IMAGE_OFFSET.top}px`;
  QUERY.lightboxImage.current.style.left = `${INITIAL_LIGHTBOX_IMAGE_OFFSET.left}px`;
  QUERY.lightboxImage.current.style.position = 'absolute';
}

function resetLightboxImagePosition() {
  QUERY.lightboxImage.current.style.position = 'static';
}

const mouseMoveHandler = (event) => {
  const MOVEMENTX = event.movementX;
  const CURRENT_LIGHTBOX_IMAGE_OFFSET_LEFT = QUERY.lightboxImage.current.offsetLeft;
  QUERY.lightboxImage.current.style.left = `${MOVEMENTX + CURRENT_LIGHTBOX_IMAGE_OFFSET_LEFT}px`;
  if (CURRENT_LIGHTBOX_IMAGE_OFFSET_LEFT < 100) {
    console.log(CURRENT_LIGHTBOX_IMAGE_OFFSET_LEFT);
  }
};

function addMouseMoveListener() {
  QUERY.lightbox.addEventListener('mousemove', mouseMoveHandler);
}

function mouseDownCleanUp(event) {
  event.currentTarget.children[1].classList.remove('lightbox__image1--scale-animation');
  STATE.imageMouseDown = false;
  QUERY.lightbox.removeEventListener('mousemove', mouseMoveHandler);
  resetLightboxImagePosition();
}

QUERY.lightbox.addEventListener('click', (event) => {
  if (STATE.imageMouseDown) {
    mouseDownCleanUp(event);
  } else if (event.target.classList.contains('lightbox')) {
    event.target.classList.remove('lightbox--open');
  }
});

QUERY.lightboxImage.current.addEventListener('mousedown', (event) => {
  event.currentTarget.classList.add('lightbox__image1--scale-animation');
  STATE.imageMouseDown = true;
  if (QUERY.lightboxImage.current.style.position !== 'absolute') {
    setLightboxImagePosition();
  }
  addMouseMoveListener();
});

QUERY.lightboxImage.current.addEventListener('dragstart', (event) => {
  event.preventDefault();
});
