import './css/styles.css'
import debounce from 'lodash.debounce'
import Notiflix from 'notiflix'
import { fetchCountries } from './JS/fetchCountries'

const DEBOUNCE_DELAY = 300;

const inputRef = document.querySelector('#search-box');
const countryListRef = document.querySelector('.country-list');
const countryInfoRef = document.querySelector('.country-info');

inputRef.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY))

function onInput() {
  const name = inputRef.value.trim()
  if (name === '') {
    return (countryListRef.innerHTML = ''), (countryInfoRef.innerHTML = '')
  }

  fetchCountries(name)
    .then(countries => {
      countryListRef.innerHTML = ''
      countryInfoRef.innerHTML = ''
      if (countries.length === 1) {
        countryListRef.insertAdjacentHTML('beforeend', createListMarkup(countries))
        countryInfoRef.insertAdjacentHTML('beforeend', createInfoMarkup(countries))
      } else if (countries.length >= 10) {
        alertInfo()
      } else {
        countryListRef.insertAdjacentHTML('beforeend', createListMarkup(countries))
      }
    })
    .catch(alertFailure)
}

function createListMarkup(countries) {
  const markup = countries
    .map(({ name, flags }) => {
      return `
          <li class="country-list__item">
              <img class="country-list__flag" src="${flags.svg}" alt="Flag of ${name.official}" width = 100px height = 100px>
              <h2 class="country-list__name">${name.official}</h2>
          </li>
          `
    })
    .join('')
  return markup
}

function createInfoMarkup(countries) {
  const markup = countries
    .map(({ capital, population, languages }) => {
      return `
        <ul class="country-info__list">
            <li class="country-info__item"><span class = "country-info__item-title">Capital:</span> ${capital}</li>
            <li class="country-info__item"><span class = "country-info__item-title">Population:</span> ${population}</li>
            <li class="country-info__item"><span class = "country-info__item-title">Languages:</span> ${Object.values(languages).join(', ')}</li>
        </ul>
        `
    })
    .join('')
  return markup
}

function alertFailure() {
  Notiflix.Notify.failure('Oops, there is no country with that name')
}

function alertInfo() {
  Notiflix.Notify.info('Too many matches found. Please enter a more specific name.')
}
