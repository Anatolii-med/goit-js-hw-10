import './css/styles.css';
import { debounce } from 'debounce';
import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const inputEl = document.getElementById('search-box');
const countryListEl = document.querySelector('.country-list');
const countryCardEl = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput() {
  clear();
  const countryFetchName = inputEl.value;
  if (countryFetchName.trim() === '') {
    makeMessage('failure', 'Empty field, input country name');
    return;
  }

  fetchCountries(countryFetchName)
    .then(countries => {
      if (countries.length === 1) {
        markupSingleCountryCard(countries);
        makeMessage('success', 'We found country');
        return;
      }
      if (countries.length < 11) {
        markupCountryList(countries);
        makeMessage('success', `Founded ${countries.length} countries!!!`);
        return;
      }
      makeMessage('warning', 'Too many matches found. Please enter a more specific name.');
    })
    .catch(error => {
      makeMessage('failure', 'Oops, there is no country with that name');
    });
}

function markupCountryList(countries) {
  const markup = countries
    .map(({ name: { official }, flags: { svg } }) => {
      return `<li class="list-item">
            <p class='list-position'>
            <img src=${svg} width=30px alt=${official} class="list-flag">
            ${official}</p>
        </li>`;
    })
    .join('');
  countryListEl.innerHTML = markup;
}

function markupSingleCountryCard(country) {
  const markup = country
    .map(({ flags: { svg }, name: { official }, capital, population, languages }) => {
      return `<li class="card-item">
            <p class="card-position">
            <img src=${svg} width=30px alt=flag class="card-flag">
            ${official}</p>
            <p class="card-cap">Capital: ${capital}</p>
            <p class="card-other">population: ${population}</p>
            <p class="card-other">languages: ${Object.values(languages)}</p>
        </li>`;
    })
    .join('');
  countryCardEl.innerHTML = markup;
}

function clear() {
  countryListEl.innerHTML = '';
  countryCardEl.innerHTML = '';
}

function makeMessage(type, message) {
  Notiflix.Notify[type](message);
}
