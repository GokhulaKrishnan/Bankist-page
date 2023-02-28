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

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

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
  // getBoundingClientRect() method returns a DOMRect object providing information about the size of an element and its position relative to the viewport. If we scroll the screen then size differs.
  // https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
  const s1coords = section1.getBoundingClientRect();
  /*
  console.log(s1coords);
  console.log(e.target.getBoundingClientRect());

  // returns the number of pixels that the document is currently scrolled horizontally.
  console.log('Current Scroll(X/Y:', window.pageXOffset, window.pageYOffset);

  // ClientHeight and ClientWidth returns the height and width of the viewport
  console.log(
    'height/width viewport:',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );
  */

  // IMplementing scrolling in the old way
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  // Implementing smooth scrolling feature. This is an old way implementation
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  // Modern way implementation
  section1.scrollIntoView({ behavior: 'smooth' });
});

////////////////////////////////////////////////

// PAGE NAVIGATION

// One of the way of doing it

// Selecting all the nav__link btns
// However this is a correct way of doing it, it is not the most efficient technique because suppose if we have 1000 links then 1000 copies will be created. So the alternate way is to use event delegation
/*
document.querySelectorAll('.nav__link').forEach(ele => {
  ele.addEventListener('click', function (e) {
    e.preventDefault();
    const secId = this.getAttribute('href');
    // console.log(secId);
    // Now we can use scrollIntoView
    document.querySelector(secId).scrollIntoView({ behavior: 'smooth' });
  });
});
*/

// EVENT DELEGATION
// In this we can assign a event listner to the parent element and use bubbling concept to execute scrolling for each of the links

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // console.log(e.target);
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
  // console.log(e.target);
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

////////////////////////////////////

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
// However using this scroll event is not very efficient
// We can use INTERSECTIONOBSERVER to make it more efficient

// IntersectionObserver
/*
const callbackFn = function (entries, observer) {
  entries.forEach(E => console.log(E));
};

const options = {
  root: null,
  threshold: 0.3,
};

const observer = new IntersectionObserver(callbackFn, options);
observer.observe(section1);
*/

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

// lazy loading is used in a site to make it more efficient and performance oriented. This will at first have a very low resolution img in the site which is added a blur filter, while scroll up the site, with the help of intersectionObserver we will replace the lazy-img with the actual img

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

  // To make it view slide side by side
  // const slider = document.querySelector('.slider');
  // slider.style.transform = 'scale(0.4) translateX(-800px)';
  // slider.style.overflow = 'visible';

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
///////////////////////////////////////////////////
///////////////////////////////////////////////////
//LECTURES

// SELECTING ELEMENTS
/*

console.log(document.documentElement); // for selecting all the elements
console.log(document.head); // for selecting the header
console.log(document.body); // for selecting the body

// As we know
const header = document.querySelector('.header');
const allSection = document.querySelectorAll('.section'); // all elements
console.log(allSection);

document.getElementById('section--1'); // selects the first element with this name
const allBtns = document.getElementsByTagName('button'); // will return a HTMLCOLLECTION which will get automatically updated whereas NODELIST will not get updated.
console.log(allBtns);

console.log(document.getElementsByClassName('btn'));

// CREATING AND INSERTING ELEMENTS
const message = document.createElement('div'); // it now acts as an obj like any other ele chosen by querySelector
message.classList.add('cookie-message');
// message.textContent = 'We use cookie for improved functionality and analytics';
message.innerHTML = `We use cookie for improved functionality and analytics <button class="btn btn--close-cookie">Got it!<button?`;
// header.prepend(message); // this will add that ele as the first ele inside the header
header.append(message); //this will add that ele as the last ele inside the header

// what if we want to have it at both at first and last. For that we have to copy it
// header.append(message.cloneNode('true'));

// Theres also two more methods which will add the element before/after the header element as a sibling
header.after(message); // after the header ele
// header.before(message); // before the header ele

// DELETE ELEMENT

// we want to delete the cookie msg once we click the got it button
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove(); // this will delete the ele
  });

// STYLE

message.style.backgroundColor = '#37383d';
message.style.width = '120%';

console.log(message.style.height); // this will simply return nothing because this will show op only if we set it manually like lin 83
console.log(message.style.backgroundColor);

// If you really want to know the style given to that element, you can use this
console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

// suppose we want to add another 40px to the height of the cookie-msg
message.style.height =
  Number.parseFloat(getComputedStyle(message).height) + 40 + 'px'; // We are parse floating because

// changing a property that is in root
document.documentElement.style.setProperty('--color-primary', 'orangered');

// ATTRIBUTES
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.src); // This will return the absolute address

// We can also change the values of attributes
logo.alt = 'Beautiful minimalist logo';

// Non-standard
console.log(logo.designer); // undefined because this not a regular property of img tag

// Theres also a way to extract thst value
console.log(logo.getAttribute('designer'));
// Setting a non standard property in a tag
logo.setAttribute('company', 'Bankist');

console.log(logo.src); // returns absolute value
console.log(logo.getAttribute('src')); // returns relative value

const link = document.querySelector('.twitter-link');
console.log(link.href); // returns relative
console.log(link.getAttribute('href')); // returns relative

// Data Attribute
console.log(logo.dataset.versionNumber); // We use this quite a lot, we use it to store data in UI basically in HTML code

// Classes

logo.classList.add('c', 'j');
logo.classList.remove('c', 'j');
logo.classList.toggle('c');
logo.classList.contains('c');

// We can also use this to add a class name. But this is erase all the exisiting class name and assign only this class name whereas in the above methods, it is used to add multiple class name.
// logo.className = 'c';
*/
/*

const h1 = document.querySelector('h1');

const alertH1 = function (e) {
  alert('mouseEnter: Great you are reading the heading!');

  // Removing the event listner after one mouseenter event
  // h1.removeEventListener('mouseenter', alertH1);
};

// Adding event listner to the h1 tag, whenever we hover it display alert msg
// h1.addEventListener('mouseenter', function (e) {
//   alert('mouseEnter: Great you are reading the heading!');
// });
// Check MDN for more event listners
h1.addEventListener('mouseenter', alertH1);

// Thers another way of adding event listner which is addding event to it directly
// h1.onmouseenter = function (e) {
//   alert('mouseEnter: Great you are reading the heading!');
// };

// We can remove event listner wherever we want

setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);

// And you can even call event as an inline ele as an attribute but they are old school way and they are not used largely.

// NOW WE ARE GOING TO SEE ABOUT EVENT PROPAGATION

// PHASE 1 CAPTURING
// PHASE 2 TARGETING
// PHASE 3 BUBBLING

// creating a function that gives random color

const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () =>
  `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)})`;

// Explaining the concept of event propagation
document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor(); // Here 'this' will point out to the class in which eventListner is added on
  console.log('LINK', e.target, e.currentTarget);
  console.log(this === e.currentTarget);
});

// adding event listner on parent ele of nav__link
document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('CONTAINER', e.target, e.currentTarget);
});

// adding event listner on parent ele of nav__links
document.querySelector('.nav').addEventListener(
  'click',
  function (e) {
    this.style.backgroundColor = randomColor();
    console.log('NAV', e.target, e.currentTarget);
  },
  true
);

// The reason why all the the three bg color changes is because of the concept bubbling, it executes the captured events in the bubbling phase
// We can execute event listner in the capturing phase by adding the third parameter to the addEventListner fn and setting t as true
*/

// DOM TRAVERSING
/*

// DOM traversing is nothing but traversing through the DOM elements
const h1 = document.querySelector('h1');

//==========
// GOING DOWNWARDS: child
console.log(h1.querySelectorAll('.highlight')); // These are the elements with highlight classname that are under the h1 tag. It wont select the elements that has the same class name but outside the h1 tag

console.log(h1.childNodes); // this will return all nodes that contains all the elements that are childrens of h1 which includes text, comment etc.

console.log(h1.children); // this will return the direct children tag of h1 tag

h1.firstElementChild.style.color = 'white'; // this will select the first element of h1 tag

h1.lastElementChild.style.color = 'orangered'; // this will select the last element of h1 tag

//==========

// GOING UPWARDS: parent
console.log(h1.parentNode); // Direct parent nodes

console.log(h1.parentElement); // returns parent element

h1.closest('.header').style.background = 'var(--gradient-secondary)'; // closest will find the closest mentioned parent element which is present at any level of the DOM tree.

h1.closest('h1').style.background = 'var(--gradient-primary)'; // since there is no h1 parent tag above the h1 tag, it will return the same tag.

// ===============

// GOING SIDEWAYS: siblings
console.log(h1.previousElementSibling); // previous sibling
console.log(h1.nextElementSibling); // next sibling

console.log(h1.previousSibling); // node
console.log(h1.nextSibling); // node

console.log(h1.parentElement.children); // selecting the children of h1 parent tag

[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) el.style.transform = 'scale(0.5)';
});
*/

// LIFECYCLE DOM EVENTS

// These events occur automatically in a web page

// DOMContentLoaded is a event that gets executed when the HTML content and DOM tree is created

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
