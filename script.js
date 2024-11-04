'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// We are going to implement smmoth scrolling to a particular section

// going to add event listner for the scroll to button
btnScrollTo.addEventListener('click', function (e) {
 
  const s1coords = section1.getBoundingClientRect();
  
  // Modern way implementation
  section1.scrollIntoView({ behavior: 'smooth' });
});


// EVENT DELEGATION
// In this we can assign a event listner to the parent element and use bubbling concept to execute scrolling for each of the links

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // Checking strategy as we want to execute only when we click on the link
  if (e.target.classList.contains('nav__link')) {
    document
      .querySelector(e.target.getAttribute('href'))
      .scrollIntoView({ behavior: 'smooth' });
  }
});

////////////////////////////////////

// TABBED COMPONENT

// Applying event delegation
tabsContainer.addEventListener('click', function (e) {

  // matching strategy
  const clicked = e.target.closest('.operations__tab');

  // Gaurde Clause
  if (!clicked) return;

  // Removing active tab from all tabs when before adding active class to clicked
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  // Removing active content
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // Active tab
  clicked.classList.add('operations__tab--active');
  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});


// MENU FADE OUT ANIMATION

const nav = document.querySelector('.nav'); // event delegation

const opacityControl = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    // loop over the siblings and add the opacity effect
    siblings.forEach(s => {
      if (s != link) s.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
// *** The handler function can only take one argument. If have to send multiple arguments, we can send it through arrays
// adding event listner to the event delegation
nav.addEventListener('mouseover', opacityControl.bind(0.5));

nav.addEventListener('mouseout', opacityControl.bind(1));

// STICKY NAVIGATION
const initialCoord = section1.getBoundingClientRect();
// console.log(initialCoord);
// adding event listner to the window
window.addEventListener('scroll', function (e) {
  // console.log(window.scrollY);
  if (this.window.scrollY > initialCoord.top) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
});

const header = document.querySelector('.header'); // we are going to observe the header
const navHeight = nav.getBoundingClientRect().height;

const callbacFn = function (entries) {
  // We will use the isInterecting property which is a boolean value to determine whether the line has been crossed
  // console.log(entries);
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
// Observer
const headerObs = new IntersectionObserver(callbacFn, {
  root: null, // becasue we want to have the entire view port
  threshold: 0, // becasue we want ot activate the sticky note once it has crossed the header end line
  rootMargin: `-${navHeight}px`,
});

headerObs.observe(header);

//REVEAL SECTION

const allSection = document.querySelectorAll('.section');

// the callback fn
const revealSection = function (entries, observer) {
  const [entry] = entries; // this gives the particular section which is srolled
  // console.log(entry);
  if (!entry.isIntersecting) return; // Gaurd clause

  entry.target.classList.remove('section--hidden'); // removing the class
  observer.unobserve(entry.target); // for removing the observation while scrolling up
};

// Intersection observer
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15, // to happen after scrolling for a dist
});

// To observe the required sections
allSection.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden'); // to add section hidden feature to all the section at the initial.
});

// LAZY LOADING

// lazy loading is used in a site to make it more efficient and performance oriented. This will at first have a very low resolution img in the site 
// which is added a blur filter, while scroll up the site, with the help of intersectionObserver we will replace the lazy-img with the actual img

const targetImg = document.querySelectorAll('img[data-src]'); // This means we want only the imgs that has data-src attribute because we dont want to select all the imgs

const loadImg = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;

  // Now we have to replace the src with data set src
  entry.target.src = entry.target.dataset.src;

  // We should also remove the lazy img class to remove the blur effect
  // Lin number 252 will emit the load event with which we can add eventListner
  // We should remove the blur once it have finished loading the image not before that, so we are using the below and not directly removing the blur effect.
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  // observer.unobserve(entry.taget);
};
// adding the intersection observer
const imageObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

targetImg.forEach(img => imageObserver.observe(img));

// SLIDER
const slider = function () {
  // Slider works by changing the transform's translateX property. 0% mentions it is in the current view and 100% means it is next to current img.

  const slides = document.querySelectorAll('.slide');
  const btnRight = document.querySelector('.slider__btn--right');
  const btnLeft = document.querySelector('.slider__btn--left');
  const dotContainer = document.querySelector('.dots');
  let currSlide = 0;
  const maxSlide = slides.length;

  // to place it side by side /

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class= "dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    // Removing active dots from all the dots from activating a particular one
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  // It changes the translateX value
  const gotoSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`) // currSlide 1: -100%, 0%, 100%, 200%
    );
  };

  // Next slide
  const nextSlide = function () {
    if (currSlide === maxSlide - 1) {
      // If the currSlide exceeds the maximum number of slides, it should return to the first slide
      currSlide = 0;
    } else {
      currSlide++;
    }

    gotoSlide(currSlide);
    activateDot(currSlide);
  };

  // Prev slide
  const prevSlide = function () {
    // If the currSlide exceeds the minimum number of slides, it should return to the last slide
    if (currSlide === 0) {
      currSlide = maxSlide - 1;
    } else {
      currSlide--;
    }

    gotoSlide(currSlide);
    activateDot(currSlide);
  };

  const init = function () {
    gotoSlide(0); // In the beginning we manually assigning the viewport
    createDots();
    activateDot(0);
  };
  init();

  // Implementing right btn event listner
  btnRight.addEventListener('click', nextSlide);
  // Implementing left btn event listner
  btnLeft.addEventListener('click', prevSlide);

  // Handling keyboard event left and right to change the slides
  document.addEventListener('keydown', function (e) {
    // console.log(e);
    if (e.key === 'ArrowLeft') prevSlide();
    else if (e.key === 'ArrowRight') nextSlide();
  });

  // Event listner for dot contaier
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      // console.log(slide);
      gotoSlide(slide);
      activateDot(slide);
    }
  });
};

slider();

document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree loaded!', e);
});

// load event is a event that gets executed when the HTML content and all the images [after entire website] is loaded.

window.addEventListener('load', function (e) {
  console.log('Page fully loaded', e);
});

// beforeunload is another event
window.addEventListener('beforeunload', function (e) {
  e.preventDefault();
  console.log(e);
  e.returnValue = '';
});
