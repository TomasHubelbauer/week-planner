
import calculateColor from './calculateColor.js';
import clearSelection from './clearSelection.js';
import fetchData from './fetchData.js';
import getSelection from './getSelection.js';
import iterateDates from './iterateDates.js';
import iterateSlots from './iterateSlots.js';
import render from './render.js';
import storeData from './storeData.js';

clearSelection();
render();

const typeDialog = document.querySelector('#typeDialog');
const typeForm = document.querySelector('#typeForm');
const nameInput = document.querySelector('#nameInput');

const types = fetchData('types', []);
for (const type of types) {
  const button = document.createElement('button');
  button.textContent = type;
  button.addEventListener('click', () => {
    const slots = [...getSelection()];

    // Mark slots this type if there is a selection, otherwise skip to edit mode
    if (slots.length > 0) {
      for (const slot of slots) {
        storeData(slot, data => data.type = type);
      }

      clearSelection();
      render();
      return;
    }

    typeDialog.className = 'update';
    typeDialog.showModal();
    nameInput.value = type;
    nameInput.dataset['name'] = type;
  });

  const span = document.createElement('span');
  span.style.background = calculateColor(type);

  button.prepend(span);

  document.body.append(button);
}

const button = document.createElement('button');
button.textContent = '+';
button.addEventListener('click', () => {
  typeDialog.className = 'create';
  typeDialog.showModal();
  nameInput.value = '';
});

document.body.append(button);

typeForm.addEventListener('submit', () => {
  switch (typeDialog.className) {
    case 'create': {
      storeData('types', types => types.push(nameInput.value), []);
      location.reload();
      break;
    }
    case 'update': {
      const type = nameInput.dataset['name'];
      for (const date of iterateDates()) {
        for (const slot of iterateSlots(date)) {
          const data = fetchData(slot, {});
          if (data.type === type) {
            storeData(slot, data => data.type = nameInput.value);
          }
        }
      }

      storeData('types', types => {
        types.splice(types.indexOf(type), 1);
        types.push(nameInput.value);
      }, []);

      location.reload();
      break;
    }
    default: {
      throw new Error('Expected create or update class name!');
    }
  }
});

const deleteButton = document.querySelector('#deleteButton');
deleteButton.addEventListener('click', event => {
  const type = nameInput.dataset['name'];
  for (const date of iterateDates()) {
    for (const slot of iterateSlots(date)) {
      const data = fetchData(slot, {});
      if (data.type === type) {
        storeData(slot, data => data.type = null);
      }
    }
  }

  storeData('types', types => {
    types.splice(types.indexOf(type), 1);
  }, []);

  event.preventDefault();
  location.reload();
});
