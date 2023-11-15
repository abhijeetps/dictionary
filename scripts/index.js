const sanitize = (value) => value.trim();

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

const clearContent = (element) => (element.innerHTML = '');

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

        const wordElement = document.createElement('h1');
        wordElement.setAttribute('id', 'word');
        wordElement.innerText = word;
        mainContent.appendChild(wordElement);

        const ul = document.createElement('ul');
        ul.setAttribute('class', 'results');
        mainContent.appendChild(ul);

        results.forEach((result) => {
          const { definition, partOfSpeech, examples } = result;
          const li = document.createElement('li');
          li.setAttribute('class', 'result');

          const pPartOfSpeech = document.createElement('p');
          pPartOfSpeech.setAttribute('class', 'partOfSpeech');
          pPartOfSpeech.innerText = partOfSpeech;

          const pDefinition = document.createElement('p');
          pDefinition.setAttribute('class', 'definition');
          pDefinition.innerText = definition;

          const examplesUL = document.createElement('ul');
          examples &&
            examples.forEach((example) => {
              const exampleLi = document.createElement('li');
              exampleLi.setAttribute('class', 'example');
              exampleLi.innerText = example;
              examplesUL.appendChild(exampleLi);
            });
          li.appendChild(pPartOfSpeech);
          li.appendChild(pDefinition);
          li.appendChild(examplesUL);
          ul.appendChild(li);
        });
      } else {
        const mainContent = document.getElementById('search__result');

        clearContent(mainContent);

        const noSearchResult = 'No results for that word.';
        const noSearchElement = document.createElement('p');
        noSearchElement.setAttribute('id', 'informaticMessage');
        noSearchElement.innerText = noSearchResult;
        mainContent.appendChild(noSearchElement);
      }
    });
  });
};

init();
