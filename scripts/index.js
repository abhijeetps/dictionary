const sanitize = (value) => value.trim();

const RAPID_API_KEY = 'c0pyY0urRap1dAPIK3yH3r3';

const fetchResult = async (searchKeyword) => {
  const url = `https://wordsapiv1.p.rapidapi.com/words/${searchKeyword}/definitions`;
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': RAPID_API_KEY,
      'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com',
    },
  };

  let results = null;
  try {
    const response = await fetch(url, options);
    results = await response.json();
  } catch (error) {
    console.error(error);
  }
  return results;
};

const init = () => {
  window.addEventListener('DOMContentLoaded', (event) => {
    const searchForm = document.getElementById('search__form');
    searchForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const searchInput = document.getElementById('search__input');
      const searchKeyword = sanitize(searchInput.value);
      let results = null;
      try {
        results = await fetchResult(searchKeyword);
      } catch (error) {
        console.log('There was some error: ', error);
      }
      if (results && results.definitions) {
        const { word, definitions } = results;

        const mainContent = document.getElementById('search__result');
        mainContent.innerHTML = '';

        const wordElement = document.createElement('h1');
        wordElement.innerText = word;
        mainContent.appendChild(wordElement);

        const ul = document.createElement('ul');
        mainContent.appendChild(ul);

        definitions.forEach((definition) => {
          const li = document.createElement('li');
          li.innerText = definition.definition;
          ul.appendChild(li);
        });
      } else {
        const mainContent = document.getElementById('search__result');
        mainContent.innerHTML = '';
        const noSearchResult = 'No results for that word.';
        const noSearchElement = document.createElement('p');
        noSearchElement.innerText = noSearchResult;
        mainContent.appendChild(noSearchElement);
      }
    });
  });
};

init();
