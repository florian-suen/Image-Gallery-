import images from './image.index';
import './css/index.scss';

const QUERY = {
  lightbox: document.querySelector('.lightbox'),
  gallery: document.querySelector('.gallery'),
  lightboxImg: {
    cur: document.querySelector('.lightbox__image1'),
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
  let imageSourcePrev = null;
  let imageSourceNext = null;
  if (!event.target.previousElementSibling) {
    imageSourcePrev = event.target.parentNode.lastElementChild.firstChild.src;
    imageSourceNext = event.target.nextElementSibling.firstChild.src;
  } else if (!event.target.nextElementSibling) {
    imageSourcePrev = event.target.previousElementSibling.firstChild.src;
    imageSourceNext = event.target.parentNode.firstElementChild.firstChild.src;
  } else {
    imageSourcePrev = event.target.previousElementSibling.firstChild.src;
    imageSourceNext = event.target.nextElementSibling.firstChild.src;
  }


  QUERY.lightboxImg.cur.src = IMAGE_SOURCE;
  QUERY.lightboxImg.prev.src = imageSourcePrev;
  QUERY.lightboxImg.next.src = imageSourceNext;
}

QUERY.gallery.addEventListener('click', (event) => {
  if (event.target.classList.contains('gallery__item')) {
    setImageSrc(event);
    QUERY.lightbox.classList.add('lightbox--open');
  }
});

function setlightboxImgPosition() {
  INITIAL_LIGHTBOX_IMAGE_OFFSET.top = QUERY.lightboxImg.cur.offsetTop;
  INITIAL_LIGHTBOX_IMAGE_OFFSET.left = QUERY.lightboxImg.cur.offsetLeft;
  QUERY.lightboxImg.cur.style.top = `${INITIAL_LIGHTBOX_IMAGE_OFFSET.top}px`;
  QUERY.lightboxImg.cur.style.left = `${INITIAL_LIGHTBOX_IMAGE_OFFSET.left}px`;
  QUERY.lightboxImg.cur.style.position = 'absolute';
}

function resetlightboxImgPosition() {
  QUERY.lightboxImg.cur.style.position = 'static';
}

const mouseMoveHandler = (event) => {
  const MOVEMENTX = event.movementX;
  // const OFFSETLEFT_WIDTH = QUERY.lightboxImg.cur.offsetLeft + QUERY.lightboxImg.cur.offsetWidth;
  // const OFFSETRIGHT = QUERY.lightbox.offsetWidth - OFFSETLEFT_WIDTH;
  const CURRENT_LIGHTBOX_IMAGE_OFFSET_LEFT = QUERY.lightboxImg.cur.offsetLeft;
  const LIGHTBOX_CENTER_MAX_WIDTH = QUERY.lightbox.clientWidth / 2;
  const CENTER_SQRT = Math.sqrt(LIGHTBOX_CENTER_MAX_WIDTH) - 10;
  const mousePos = Math.sqrt((event.clientX - LIGHTBOX_CENTER_MAX_WIDTH) ** 2);
  QUERY.lightboxImg.cur.style.left = `${MOVEMENTX + CURRENT_LIGHTBOX_IMAGE_OFFSET_LEFT}px`;
  if (MOVEMENTX < 0 && event.clientX < LIGHTBOX_CENTER_MAX_WIDTH) {
    QUERY.lightboxImg.cur.style.opacity = CENTER_SQRT / mousePos;
  } else if (MOVEMENTX > 0 && event.clientX > LIGHTBOX_CENTER_MAX_WIDTH) {
    QUERY.lightboxImg.cur.style.opacity = CENTER_SQRT / mousePos;
  }
};

function addMouseMoveListener() {
  QUERY.lightbox.addEventListener('mousemove', mouseMoveHandler);
}

function mouseDownCleanUp(event) {
  event.currentTarget.children[1].classList.remove('lightbox__image1--scale-animation');
  STATE.imageMouseDown = false;
  QUERY.lightbox.removeEventListener('mousemove', mouseMoveHandler);
  QUERY.lightboxImg.cur.style.opacity = 1;
  resetlightboxImgPosition();
}

QUERY.lightbox.addEventListener('click', (event) => {
  if (STATE.imageMouseDown) {
    mouseDownCleanUp(event);
  } else if (event.target.classList.contains('lightbox')) {
    event.target.classList.remove('lightbox--open');
  }
});

QUERY.lightboxImg.cur.addEventListener('mousedown', (event) => {
  event.currentTarget.classList.add('lightbox__image1--scale-animation');
  STATE.imageMouseDown = true;
  if (QUERY.lightboxImg.cur.style.position !== 'absolute') {
    setlightboxImgPosition();
  }
  addMouseMoveListener();
});

QUERY.lightboxImg.cur.addEventListener('dragstart', (event) => {
  event.preventDefault();
});
