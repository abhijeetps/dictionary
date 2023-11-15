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
const addClass = (element, className) =>
  setAttribute(element, 'class', className);
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

const init = () => {
  window.addEventListener('DOMContentLoaded', (event) => {
    const searchForm = document.getElementById('search__form');
    searchForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const searchInput = document.getElementById('search__input');
      const searchKeyword = sanitize(searchInput.value);
      let data = null;
      try {
        data = await fetchResult(searchKeyword);
      } catch (error) {
        console.log('There was some error: ', error);
      }

      if (data && data.results) {
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

          const examplesUL = createElement('ul');
          examples &&
            examples.forEach((example) => {
              const exampleLi = createElement('li');
              addClass(exampleLi, 'example');
              addContent(exampleLi, example);
              examplesUL.appendChild(exampleLi);
            });
          li.appendChild(pPartOfSpeech);
          li.appendChild(pDefinition);
          li.appendChild(examplesUL);
          ul.appendChild(li);
        });
      } else {
        noSearchResultDisplay();
      }
    });
  });
};

init();
