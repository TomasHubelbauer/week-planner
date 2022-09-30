import getSelection from './getSelection.js';
import storeData from './storeData.js';

export default function clearSelection() {
  for (const slot of getSelection()) {
    storeData(slot, data => data.isSelected = false);
  }

  const slotsSpan = document.querySelector('#slotsSpan');
  slotsSpan.textContent = '';
}
