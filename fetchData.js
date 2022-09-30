/**
 * 
 * @param {string} key 
 */
export default function fetchData(key, fallback) {
  const data = localStorage.getItem(key);
  if (data === null) {
    return fallback;
  }

  return JSON.parse(data);
}
