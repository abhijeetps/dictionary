const MAX_FAVOURITES = 10;
const THEME_KEY = 'theme';
const FAVOURITES_KEY = 'favourites';
const LIGHT_THEME_VALUE = 'light';
const DARK_THEME_VALUE = 'dark';

const RAPID_API_KEY = '9a7e41dc9amsh86590bf61d0335dp16d3bdjsn5b091f741367';

const fetchResult = async (searchKeyword) => {
  const url = `https://wordsapiv1.p.rapidapi.com/words/${searchKeyword}`;
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': RAPID_API_KEY,
      'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com',
    },
  };

  let data = null;
  try {
    const response = await fetch(url, options);
    data = await response.json();
  } catch (error) {
    console.error(error);
  }
  return data;
};

const sanitize = (value) => value.trim();

const addContent = (element, text) => (element.innerHTML = text);

const clearContent = (element) => addContent(element, '');

const createElement = (element) => document.createElement(element);

const setAttribute = (element, property, value) =>
  element.setAttribute(property, value);

const addClass = (element, className) => element.classList.add(className);

const removeClass = (element, className) => element.classList.remove(className);

const addId = (element, id) => setAttribute(element, 'id', id);

const getThemeValue = () => localStorage.getItem(THEME_KEY) || DARK_THEME_VALUE;

const setThemeKey = (theme) => localStorage.setItem(THEME_KEY, theme);

const getFavouriteList = () => {
  const favourites = localStorage.getItem(FAVOURITES_KEY) || '[]';
  return JSON.parse(favourites);
};

const setFavouriteList = (favourites) => {
  localStorage.setItem(FAVOURITES_KEY, JSON.stringify(favourites));
};

const addWordToFavouriteList = (word) => {
  const favourites = getFavouriteList();
  favourites.push(word);
  if (favourites.length > MAX_FAVOURITES) {
    favourites.shift();
  }
  setFavouriteList(favourites);
};

const removeWordFromFavouriteList = (word) => {
  const favourites = getFavouriteList();
  const idx = favourites.indexOf(word);
  if (idx > -1) {
    favourites.splice(idx, 1);
  }
  setFavouriteList(favourites);
};

const isFavouriteWord = (word) => {
  const favourites = getFavouriteList();
  return favourites.includes(word);
};

const addBookmark = () => {
  const bookmarkIcon = document.getElementsByClassName('fa-bookmark')[0];
  removeClass(bookmarkIcon, 'fa-regular');
  addClass(bookmarkIcon, 'fa-solid');
};

const removeBookmark = () => {
  const bookmarkIcon = document.getElementsByClassName('fa-bookmark')[0];
  removeClass(bookmarkIcon, 'fa-solid');
  addClass(bookmarkIcon, 'fa-regular');
};

const noSearchResultDisplay = () => {
  const mainContent = document.getElementById('search__result');

  clearContent(mainContent);

  const noSearchResult = 'No results for that word.';
  const noSearchElement = createElement('p');
  addId(noSearchElement, 'informaticMessage');
  addContent(noSearchElement, noSearchResult);
  mainContent.appendChild(noSearchElement);
};

const searchResultDisplay = (data) => {
  const { word, results } = data;

  const mainContent = document.getElementById('search__result');

  clearContent(mainContent);

  const titleSpan = createElement('span');
  addClass(titleSpan, 'titleSpan');

  const wordElement = createElement('h1');
  addId(wordElement, 'word');
  addContent(wordElement, word);
  titleSpan.appendChild(wordElement);

  const favouriteButton = createElement('button');
  addId(favouriteButton, 'addToFavourite');
  const bookmarkIcon = createElement('i');
  addClass(bookmarkIcon, 'fa-bookmark');
  if (isFavouriteWord(word)) {
    addClass(bookmarkIcon, 'fa-solid');
  } else {
    addClass(bookmarkIcon, 'fa-regular');
  }
  favouriteButton.appendChild(bookmarkIcon);
  titleSpan.appendChild(favouriteButton);
  mainContent.appendChild(titleSpan);

  watchFavourite();

  const ul = createElement('ul');
  addClass(ul, 'results');
  mainContent.appendChild(ul);

  results.forEach((result) => {
    const { definition, partOfSpeech, examples } = result;
    const li = createElement('li');
    addClass(li, 'result');

    const pPartOfSpeech = createElement('p');
    addClass(pPartOfSpeech, 'partOfSpeech');
    addContent(pPartOfSpeech, partOfSpeech);

    const pDefinition = createElement('p');
    addClass(pDefinition, 'definition');
    addContent(pDefinition, definition);

    const examplesUl = createElement('ul');
    addClass(examplesUl, 'examples');
    examples &&
      examples.forEach((example) => {
        const exampleLi = createElement('li');
        addContent(exampleLi, example);
        examplesUl.appendChild(exampleLi);
      });
    li.appendChild(pPartOfSpeech);
    li.appendChild(pDefinition);
    li.appendChild(examplesUl);
    ul.appendChild(li);
  });
};

const memoize = (func) => {
  const cache = {};
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache[key]) {
      return cache[key];
    } else {
      const result = func.apply(this, args);
      cache[key] = result;
      return result;
    }
  };
};

const fetchResultMemoize = memoize(fetchResult);

const searchingDisplay = () => {
  const mainContent = document.getElementById('search__result');
  clearContent(mainContent);

  const searchingMessage = 'Searching...';
  const searchingMessageElement = createElement('p');
  addId(searchingMessageElement, 'informaticMessage');
  addContent(searchingMessageElement, searchingMessage);
  mainContent.appendChild(searchingMessageElement);
};

const initTheme = () => {
  const currentTheme = getThemeValue();
  if (currentTheme === LIGHT_THEME_VALUE) {
    setTheme(LIGHT_THEME_VALUE);
  } else if (currentTheme === DARK_THEME_VALUE) {
    setTheme(DARK_THEME_VALUE);
  }
};

const init = () => {
  initTheme();
  window.addEventListener('DOMContentLoaded', (event) => {
    const searchForm = document.getElementById('search__form');
    searchForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const searchInput = document.getElementById('search__input');
      const searchKeyword = sanitize(searchInput.value);
      let data = null;
      if (searchKeyword) {
        searchingDisplay();
        try {
          data = await fetchResultMemoize(searchKeyword);
        } catch (error) {
          console.log('There was some error: ', error);
        }

        if (data && data.results) {
          searchResultDisplay(data);
          setTheme(getThemeValue());
        } else {
          noSearchResultDisplay();
          setTheme(getThemeValue());
        }
      }
    });
  });
};

const addLightTheme = () => {
  const body = document.getElementsByTagName('body')[0];
  addClass(body, LIGHT_THEME_VALUE);
  const brandIcon = document.getElementsByClassName('fa-book-bookmark')[0];
  addClass(brandIcon, LIGHT_THEME_VALUE);
  const brand = document.getElementById('brand');
  addClass(brand, LIGHT_THEME_VALUE);
  const circleHalfStroke = document.getElementsByClassName(
    'fa-circle-half-stroke'
  )[0];
  addClass(circleHalfStroke, LIGHT_THEME_VALUE);
  const main = document.getElementsByTagName('main')[0];
  addClass(main, LIGHT_THEME_VALUE);
  const searchForm = document.getElementById('search__form');
  addClass(searchForm, LIGHT_THEME_VALUE);
  const searchInput = document.getElementById('search__input');
  addClass(searchInput, LIGHT_THEME_VALUE);
  const searchButton = document.getElementById('search__button');
  addClass(searchButton, LIGHT_THEME_VALUE);
  const searchResult = document.getElementById('search__result');
  addClass(searchResult, LIGHT_THEME_VALUE);
  const bookmarkButton = document.getElementById('addToFavourite');
  bookmarkButton && addClass(bookmarkButton, LIGHT_THEME_VALUE);
  const informaticMessage = document.getElementById('informaticMessage');
  informaticMessage && addClass(informaticMessage, LIGHT_THEME_VALUE);
  const word = document.getElementById('word');
  word && addClass(word, LIGHT_THEME_VALUE);
  const examples = document.getElementsByClassName('examples');
  for (const example of examples) {
    addClass(example, LIGHT_THEME_VALUE);
  }
  const footer = document.getElementById('footer');
  addClass(footer, LIGHT_THEME_VALUE);
  const author = document.getElementById('author');
  addClass(author, LIGHT_THEME_VALUE);
};

const removeLightTheme = () => {
  const body = document.getElementsByTagName('body')[0];
  removeClass(body, LIGHT_THEME_VALUE);
  const brandIcon = document.getElementsByClassName('fa-book-bookmark')[0];
  removeClass(brandIcon, LIGHT_THEME_VALUE);
  const brand = document.getElementById('brand');
  removeClass(brand, LIGHT_THEME_VALUE);
  const circleHalfStroke = document.getElementsByClassName(
    'fa-circle-half-stroke'
  )[0];
  removeClass(circleHalfStroke, LIGHT_THEME_VALUE);
  const main = document.getElementsByTagName('main')[0];
  removeClass(main, LIGHT_THEME_VALUE);
  const searchForm = document.getElementById('search__form');
  removeClass(searchForm, LIGHT_THEME_VALUE);
  const searchInput = document.getElementById('search__input');
  removeClass(searchInput, LIGHT_THEME_VALUE);
  const searchButton = document.getElementById('search__button');
  removeClass(searchButton, LIGHT_THEME_VALUE);
  const searchResult = document.getElementById('search__result');
  removeClass(searchResult, LIGHT_THEME_VALUE);
  const bookmarkButton = document.getElementById('addToFavourite');
  bookmarkButton && addClass(bookmarkButton, LIGHT_THEME_VALUE);
  const informaticMessage = document.getElementById('informaticMessage');
  informaticMessage && removeClass(informaticMessage, LIGHT_THEME_VALUE);
  const word = document.getElementById('word');
  word && removeClass(word, LIGHT_THEME_VALUE);
  const examples = document.getElementsByClassName('examples');
  for (const example of examples) {
    removeClass(example, LIGHT_THEME_VALUE);
  }
  const footer = document.getElementById('footer');
  removeClass(footer, LIGHT_THEME_VALUE);
  const author = document.getElementById('author');
  removeClass(author, LIGHT_THEME_VALUE);
};

const setTheme = (requiredTheme) => {
  setThemeKey(requiredTheme);
  if (requiredTheme === LIGHT_THEME_VALUE) {
    addLightTheme();
  } else if (requiredTheme === DARK_THEME_VALUE) {
    removeLightTheme();
  }
};

const toggleTheme = (currentTheme) => {
  if (currentTheme === LIGHT_THEME_VALUE) {
    setTheme(DARK_THEME_VALUE);
  } else if (currentTheme === DARK_THEME_VALUE) {
    setTheme(LIGHT_THEME_VALUE);
  }
};

const watchTheme = () => {
  const toggleThemeButton = document.getElementById('toggleTheme');
  toggleThemeButton.addEventListener('click', () => {
    const currentTheme = getThemeValue();
    toggleTheme(currentTheme);
  });
};

const watchFavourite = () => {
  const favouriteButton = document.getElementById('addToFavourite');
  favouriteButton.addEventListener('click', () => {
    const word = document.getElementById('word').innerHTML;
    if (isFavouriteWord(word)) {
      removeWordFromFavouriteList(word);
      removeBookmark();
    } else if (!isFavouriteWord(word)) {
      addWordToFavouriteList(word);
      addBookmark();
    }
  });
};

init();
watchTheme();
