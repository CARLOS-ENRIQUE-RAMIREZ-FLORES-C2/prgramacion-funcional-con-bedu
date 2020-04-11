const compose = (...functions) => data =>
  functions.reduceRight((value, func) => func(value), data)

  /*

const attrsToString = (obj = {}) => {
  const keys = Object.keys(obj)
  const attrs = []

  for (let i = 0; i < keys.length; i++) {
    let attr = keys[i]
    attrs.push(`${attr}=“${obj[attr]}"`)
  }

  const string = attrs.join(' ')

  return string
}
*/
// esta funcion y la de arriba comentada hacen lo mismo
const attrsToString = (obj = {}) => Object.keys(obj)
        .map( attr => `${attr}="${obj[attr]}"`)
        .join('')


const tagAttrs = obj => (content = '') =>
  `<${obj.tag}${obj.attrs ? ' ' : ''}${attrsToString(obj.attrs)}>${content}</${obj.tag}>`

  /*
const tag = t => {
  if (typeof t === 'string') {
    tagAttrs({ tag: t })
  }
  return tagAttrs(t)
}
*/
// esta funcion y la de arriba comentada hacen lo mismo
const tag = t => typeof t === 'string' ? tagAttrs({ tag: t }) : tagAttrs(t);

const tableRowTag = tag('tr')
const tableRow = items => compose(tableRowTag, tableCells)(items)

const tableCell = tag('td')
const tableCells = items => items.map(tableCell).join('')

const trashIcon = tag({tag: 'i', attrs: {class: 'fas fa-trash-alt'}})('')

let description = document.getElementById('description');
let calories = document.getElementById('calories');
let carbs = document.getElementById('carbs');
let protein = document.getElementById('protein'),
  list = [];

description.onkeypress = () => {
  description.classList.remove('is-invalid');
};

calories.onkeypress = () => {
  calories.classList.remove('is-invalid');
}

carbs.onkeypress = () => {
  carbs.classList.remove('is-invalid');
}

protein.onkeypress = () => {
  protein.classList.remove('is-invalid');
}

const validateInputs = () => {
  description.value ? '' : description.classList.add('is-invalid');
  calories.value ? '' : calories.classList.add('is-invalid');
  carbs.value ? '' : carbs.classList.add('is-invalid');
  protein.value ? '' : protein.classList.add('is-invalid');

  if (description.value && calories.value && carbs.value && protein.value) {
    add();
  }
}

// adiciona los valores del formulario al array vacio list y despues limpia el formulario
const add = () => {
  const newItem = {
    description: description.value,
    calories: calories.value,
    carbs: carbs.value,
    protein: protein.value,
  }
  list.push(newItem)
  cleanInputs()
  renderItems();
  updateTotals();
  console.log(list)
}
const removeItem = (index) => {
  list.splice(index, 1)

  updateTotals()
  renderItems()
}

const updateTotals = () => {
  let cal = 0, carb = 0, prot = 0;
  list.map(item => {
    cal += parseFloat(item.calories),
    carb += parseFloat(item.carbs),
    prot += parseFloat(item.protein)
  })
  document.getElementById('totalCalories').textContent= cal;
  document.getElementById('totalCarbs').textContent= carb;
  document.getElementById('totalProtein').textContent= prot;
}
// Limpia el formulario
const cleanInputs = () => {
  description.value = ''
  calories.value = ''
  carbs.value = ''
  protein.value = ''
}

const renderItems = () => {
  // otra manera de poder obtener un elemento por el name TAG
  // solo que este metodo consigue un arreglo de elementos
  const $CONTAINER = document.querySelector("tbody");
  $CONTAINER.innerHTML = "";
  const ROWS = list.map((item, index) => {
      const {
          calories, description,
          carbs, protein,
      } = item;
      const removeButton = tag({
        tag: 'button',
        attrs: {
          class: 'btn btn-outline-danger',
          onclick: `removeItem(${index})`
        }
      })(trashIcon)
      return tableRow([description, calories, carbs, protein, removeButton]);
  });
  $CONTAINER.innerHTML = ROWS.join("");
} 
    