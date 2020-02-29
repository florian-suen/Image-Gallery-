import images from './image.index';
import './css/index.scss';

(function globalwrapper() {
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
    imageMouseDown: false,
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

  function loadImages(limit = 10) {
    const IMAGE_ARRAY = createImages(limit);
    const DOCUMENT_FRAGMENT = document.createDocumentFragment();

    IMAGE_ARRAY.forEach((element) => {
      const NEW_DIV = document.createElement('div');
      NEW_DIV.classList.add('gallery__item', `gallery__item--span${NUMBER_GENERATOR(3)}`);
      NEW_DIV.appendChild(element);
      DOCUMENT_FRAGMENT.appendChild(NEW_DIV);
    });
    QUERY.gallery.appendChild(DOCUMENT_FRAGMENT);
  }

  const INITIAL_LIGHTBOX_IMAGE_OFFSET = {
    top: null,
    left: null
  };

  const SET_IMAGE_SRC = (function setImage() {
    let GALLERY_IMG = null;
    return function setImgSrc(event) {
      GALLERY_IMG = event.target.classList.contains('gallery__item') ? event.target : GALLERY_IMG;
      let imageSourcePrev = null;
      let imageSourceNext = null;

      if (event.target === QUERY.lightboxImg.cur) {
        const prevNextIMG = (event.clientX < 40 ? GALLERY_IMG.nextElementSibling
          : GALLERY_IMG.previousElementSibling);
        console.log(prevNextIMG);
        if (prevNextIMG) {
          GALLERY_IMG = prevNextIMG;
        } else {
          GALLERY_IMG = (event.clientX < 40 ? GALLERY_IMG.parentNode.firstElementChild
            : GALLERY_IMG.parentNode.lastElementChild);
        }
      }

      if (!GALLERY_IMG.previousElementSibling) {
        imageSourcePrev = GALLERY_IMG.parentNode.lastElementChild.firstChild.src;
        imageSourceNext = GALLERY_IMG.nextElementSibling.firstChild.src;
      } else if (!GALLERY_IMG.nextElementSibling) {
        imageSourcePrev = GALLERY_IMG.previousElementSibling.firstChild.src;
        imageSourceNext = GALLERY_IMG.parentNode.firstElementChild.firstChild.src;
      } else {
        imageSourcePrev = GALLERY_IMG.previousElementSibling.firstChild.src;
        imageSourceNext = GALLERY_IMG.nextElementSibling.firstChild.src;
      }
      const IMAGE_SOURCE_CUR = GALLERY_IMG.firstChild.src;
      QUERY.lightboxImg.cur.src = IMAGE_SOURCE_CUR;
      QUERY.lightboxImg.prev.src = imageSourcePrev;
      QUERY.lightboxImg.next.src = imageSourceNext;
    };
  }());

  QUERY.gallery.addEventListener('click', (event) => {
    if (event.target.classList.contains('gallery__item')) {
      SET_IMAGE_SRC(event);
      QUERY.lightbox.classList.add('lightbox--open');
    }
  });

  const mouseMoveHandler = (event) => {
    const MOVEMENTX = event.movementX;
    let xPosition = event.clientX;
    const CURRENT_LIGHTBOX_IMAGE_OFFSET_LEFT = QUERY.lightboxImg.cur.offsetLeft;
    const LIGHTBOX_WIDTH = QUERY.lightbox.clientWidth;
    const LIGHTBOX_CENTER_WIDTH = LIGHTBOX_WIDTH / 2;
    QUERY.lightboxImg.cur.style.left = `${MOVEMENTX + CURRENT_LIGHTBOX_IMAGE_OFFSET_LEFT}px`;
    if (event.clientX > LIGHTBOX_CENTER_WIDTH) {
      xPosition = (LIGHTBOX_WIDTH - event.clientX);
      const prevImgOpacity = (LIGHTBOX_CENTER_WIDTH / xPosition) / (xPosition * 0.5);
      QUERY.lightboxImg.next.style.display = 'none';
      QUERY.lightboxImg.prev.style.display = 'block';
      QUERY.lightboxImg.prev.style.opacity = prevImgOpacity;
      QUERY.lightboxImg.cur.classList.add('lightbox__image1--translate-animation-2');
    }
    QUERY.lightboxImg.cur.style.opacity = xPosition / LIGHTBOX_CENTER_WIDTH;
    if (event.clientX < LIGHTBOX_CENTER_WIDTH) {
      const nextImgOpacity = (LIGHTBOX_CENTER_WIDTH / event.clientX) / (event.clientX * 0.5);
      QUERY.lightboxImg.prev.style.display = 'none';
      QUERY.lightboxImg.next.style.display = 'block';
      QUERY.lightboxImg.next.style.opacity = nextImgOpacity;
      QUERY.lightboxImg.cur.classList.add('lightbox__image1--translate-animation');
    }
  };

  function addMouseMoveListener() {
    QUERY.lightbox.addEventListener('mousemove', mouseMoveHandler);
  }

  function resetlightboxImgPosition() {
    QUERY.lightboxImg.cur.style.position = 'static';
  }

  function mouseDownCleanUp() {
    QUERY.lightboxImg.prev.style.display = 'none';
    QUERY.lightboxImg.next.style.display = 'none';
    QUERY.lightboxImg.cur.style.opacity = 1;
    QUERY.lightboxImg.cur.classList.remove('lightbox__image1--scale-animation');
    QUERY.lightboxImg.cur.classList.remove('lightbox__image1--opacity-animation');
    setTimeout(() => {
      QUERY.lightboxImg.cur.classList.remove('lightbox__image1--translate-animation');
      QUERY.lightboxImg.cur.classList.remove('lightbox__image1--translate-animation-2');
    }, 500);
    STATE.imageMouseDown = false;
    QUERY.lightbox.removeEventListener('mousemove', mouseMoveHandler);
    resetlightboxImgPosition();
  }

  QUERY.lightbox.addEventListener('click', (event) => {
    if (STATE.imageMouseDown) {
      mouseDownCleanUp();
      if (event.clientX < 50 || event.clientX > QUERY.lightbox.clientWidth - 50) {
        QUERY.lightboxImg.cur.classList.add('lightbox__image1--opacity-animation');
        SET_IMAGE_SRC(event);
      }
    } else if (event.target === QUERY.lightbox) {
      event.target.classList.remove('lightbox--open');
    }
  });

  function setlightboxImgPosition() {
    INITIAL_LIGHTBOX_IMAGE_OFFSET.top = QUERY.lightboxImg.cur.offsetTop;
    INITIAL_LIGHTBOX_IMAGE_OFFSET.left = QUERY.lightboxImg.cur.offsetLeft;
    QUERY.lightboxImg.cur.style.top = `${INITIAL_LIGHTBOX_IMAGE_OFFSET.top}px`;
    QUERY.lightboxImg.cur.style.left = `${INITIAL_LIGHTBOX_IMAGE_OFFSET.left}px`;
    QUERY.lightboxImg.cur.style.position = 'absolute';
  }

  QUERY.lightboxImg.cur.addEventListener('mousedown', (event) => {
    event.currentTarget.classList.add('lightbox__image1--scale-animation');
    STATE.imageMouseDown = true;
    if (QUERY.lightboxImg.cur.style.position !== 'absolute') {
      setlightboxImgPosition();
    }
    addMouseMoveListener();
  });

  QUERY.lightbox.addEventListener('dragstart', (event) => {
    event.preventDefault();
  });

  loadImages();
}());
