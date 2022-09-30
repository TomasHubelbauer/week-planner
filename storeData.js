import fetchData from './fetchData.js';

/**
 * 
 * @param {string} key 
 * @param {any} value 
 */
export default function storeData(key, value, fallback) {
  if (typeof value === 'function') {
    const data = fetchData(key, fallback);
    value(data);
    localStorage.setItem(key, JSON.stringify(data));
  }
  else {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
