const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const table = document.querySelector('table');
const typeDiv = document.querySelector('#typeDiv');
const slotDiv = document.querySelector('#slotDiv');

let _type;

const types = JSON.parse(localStorage.getItem('types') ?? '[]');

if (localStorage.getItem('typeIndex') !== null) {
  _type = types[localStorage.getItem('typeIndex')];
}

function renderTypes() {
  typeDiv.replaceChildren();

  for (const type of types) {
    const label = document.createElement('label');
    label.style.color = type.color;

    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'type';
    input.checked = type === _type;

    // Note that `click` is used over `change` so it fires when already checked
    input.addEventListener('click', () => {
      if (_type === type) {
        const name = prompt('Name', type.name);
        if (!name) {
          return;
        }

        type.name = name;
        localStorage.setItem('types', JSON.stringify(types));
        renderTypes();

        const input = document.createElement('input');
        input.type = 'color';
        input.value = type.color;

        // Note that `input` is used over `change` to not default to black on Esc
        input.addEventListener('input', () => {
          type.color = input.value;
          localStorage.setItem('types', JSON.stringify(types));
          renderTypes();

          input.remove();
        });

        input.click();
      }
      else {
        _type = type;
        localStorage.setItem('typeIndex', types.indexOf(type));

        // Note that this fixes a Firefox bug where `:has(:checked)` gets stuck
        // TODO: Remove when Firefox fixes this once `:has` is in GA
        renderTypes();
      }
    });

    const span = document.createElement('span');
    span.textContent = type.name;

    const button = document.createElement('button');
    button.textContent = '-';
    button.addEventListener('click', () => {
      if (!confirm(`Delete type '${type.name}'?`)) {
        return;
      }

      if (_type === type) {
        _type = null;
      }

      types.splice(types.indexOf(type), 1);
      localStorage.setItem('types', JSON.stringify(types));
      renderTypes();
    });


    label.append(input, span, button);
    typeDiv.append(label);
  }

  const button = document.createElement('button');
  button.textContent = '+';
  button.addEventListener('click', () => {
    const name = prompt('Name');
    if (!name) {
      return;
    }

    const type = { name };
    _type = type;
    types.push(type);
    localStorage.setItem('typeIndex', types.length - 1);
    localStorage.setItem('types', JSON.stringify(types));
    renderTypes();

    const input = document.createElement('input');
    input.type = 'color';

    // Note that `input` is used over `change` to not default to black on Esc
    input.addEventListener('input', () => {
      type.color = input.value;
      localStorage.setItem('types', JSON.stringify(types));
      renderTypes();

      input.remove();
    });

    input.click();
  });

  typeDiv.append(button);
}

renderTypes();

for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
  const tr = document.createElement('tr');

  const th = document.createElement('th');
  th.textContent = days[dayIndex];
  tr.draggable = false;
  tr.append(th);

  for (let slotIndex = 0; slotIndex < 24 * 60 / 10; slotIndex++) {
    const td = document.createElement('td');
    const data = localStorage.getItem(dayIndex + '/' + slotIndex);
    if (data) {
      const type = JSON.parse(data);
      td.style.background = type.color;
    }

    td.addEventListener('mousedown', event => {
      if (!_type || event.buttons !== 1) {
        return;
      }

      td.style.background = _type.color ?? 'none';
      localStorage.setItem(dayIndex + '/' + slotIndex, JSON.stringify(_type));
    });

    td.addEventListener('mousemove', event => {
      if (!_type || event.buttons !== 1) {
        return;
      }

      td.style.background = _type.color ?? 'none';
      localStorage.setItem(dayIndex + '/' + slotIndex, JSON.stringify(_type));
    });

    td.addEventListener('mouseover', () => {
      const hours = ~~(slotIndex * 10 / 60);
      const minutes = slotIndex * 10 - hours * 60;
      const from = hours.toString().padStart(2, 0) + ':' + minutes.toString().padStart(2, 0);
      const to = hours.toString().padStart(2, 0) + ':' + (minutes + 10).toString().padStart(2, 0);
      slotDiv.textContent = `${days[dayIndex]} ${from}-${to}`;
      const data = localStorage.getItem(dayIndex + '/' + slotIndex);
      if (data) {
        const type = JSON.parse(data);
        const span = document.createElement('span');
        span.textContent = type.name;
        span.style.color = type.color;
        slotDiv.append(' ', span);
      }
    });

    td.addEventListener('mouseout', () => slotDiv.textContent = '');

    tr.append(td);
  }

  table.append(tr);
}
