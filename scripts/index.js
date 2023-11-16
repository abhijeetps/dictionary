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

  const wordElement = createElement('h1');
  addId(wordElement, 'word');
  addContent(wordElement, word);

  mainContent.appendChild(wordElement);

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
  const currentTheme = localStorage.getItem('theme') || 'dark';
  if (currentTheme === 'light') {
    changeTheme('dark');
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
        } else {
          noSearchResultDisplay();
        }
      }
    });
  });
};

const changeTheme = (currentTheme) => {
  const lightTheme = 'light';
  if (currentTheme === 'dark') {
    const body = document.getElementsByTagName('body')[0];
    addClass(body, lightTheme);
    const brandIcon = document.getElementsByClassName('fa-book-bookmark')[0];
    addClass(brandIcon, lightTheme);
    const brand = document.getElementById('brand');
    addClass(brand, lightTheme);
    const circleHalfStroke = document.getElementsByClassName(
      'fa-circle-half-stroke'
    )[0];
    addClass(circleHalfStroke, lightTheme);
    const main = document.getElementsByTagName('main')[0];
    addClass(main, lightTheme);
    const searchForm = document.getElementById('search__form');
    addClass(searchForm, lightTheme);
    const searchInput = document.getElementById('search__input');
    addClass(searchInput, lightTheme);
    const searchButton = document.getElementById('search__button');
    addClass(searchButton, lightTheme);
    const searchResult = document.getElementById('search__result');
    addClass(searchResult, lightTheme);
    const informaticMessage = document.getElementById('informaticMessage');
    informaticMessage && addClass(informaticMessage, lightTheme);
    const word = document.getElementById('word');
    word && addClass(word, lightTheme);
    const examples = document.getElementsByClassName('examples');
    for (const example of examples) {
      addClass(example, lightTheme);
    }
    const footer = document.getElementById('footer');
    addClass(footer, lightTheme);
    const author = document.getElementById('author');
    addClass(author, lightTheme);
  } else if (currentTheme === 'light') {
    const body = document.getElementsByTagName('body')[0];
    removeClass(body, lightTheme);
    const brandIcon = document.getElementsByClassName('fa-book-bookmark')[0];
    removeClass(brandIcon, lightTheme);
    const brand = document.getElementById('brand');
    removeClass(brand, lightTheme);
    const circleHalfStroke = document.getElementsByClassName(
      'fa-circle-half-stroke'
    )[0];
    removeClass(circleHalfStroke, lightTheme);
    const main = document.getElementsByTagName('main')[0];
    removeClass(main, lightTheme);
    const searchForm = document.getElementById('search__form');
    removeClass(searchForm, lightTheme);
    const searchInput = document.getElementById('search__input');
    removeClass(searchInput, lightTheme);
    const searchButton = document.getElementById('search__button');
    removeClass(searchButton, lightTheme);
    const searchResult = document.getElementById('search__result');
    removeClass(searchResult, lightTheme);
    const informaticMessage = document.getElementById('informaticMessage');
    informaticMessage && removeClass(informaticMessage, lightTheme);
    const word = document.getElementById('word');
    word && removeClass(word, lightTheme);
    const examples = document.getElementsByClassName('examples');
    for (const example of examples) {
      removeClass(example, lightTheme);
    }
    const footer = document.getElementById('footer');
    removeClass(footer, lightTheme);
    const author = document.getElementById('author');
    removeClass(author, lightTheme);
  }
};

const watchTheme = () => {
  const toggleThemeButton = document.getElementById('toggleTheme');
  toggleThemeButton.addEventListener('click', () => {
    const currentTheme = localStorage.getItem('theme') || 'light';
    changeTheme(currentTheme);
    localStorage.setItem('theme', currentTheme === 'light' ? 'dark' : 'light');
  });
};

init();
watchTheme();
