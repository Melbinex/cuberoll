const DEFAULT_IMAGE = 'img/1.png'
const PICTURES = [
  'img/1.png', 'img/2.png', 'img/3.png',
  'img/4.png', 'img/5.png', 'img/6.png'
]

function toObject(from = {}, to = {}) {
  for (let key in from) {
    let value = from[key]

    if (typeof value === 'object' && value && !Array.isArray(value)) {
      toObject(value, to[key] || (to[key] = {}))
      continue
    }

    to[key] = value
  }

  return to
}

/**
 * @param {string} tagName
 * @param {Partial<HTMLElement> & { parent: HTMLElement, ref(v: HTMLDivElement) => void}} options
 * @param {HTMLElement[]} childs
 */
function createElement(tagName = '', options = {}, childs = []) {
  const element = document.createElement(tagName)

  if (options.parent) {
    if (options.parent instanceof HTMLElement)
      options.parent.appendChild(element)

    delete options.parent
  }

  if (options.ref) {
    if (typeof options.ref == 'function')
      options.ref(element)

    delete options.ref
  }

  toObject(options, element)

  for (let child of childs)
    element.appendChild(child)

  return element
}

function rand(min = 0, max = 2 ** 16 - 1) {
  const { floor, random } = Math
  return floor(random() * (max - min + 1)) + min
}

function randArray(array = []) {
  return array[rand(0, array.length - 1)]
}

function init(length = 4, defaultImage = DEFAULT_IMAGE) {
  /** @type {HTMLImageElement[]} */
  const elementsArray = []

  for (let i = 0; i < length; i++) {
    elementsArray.push(
      createElement('img', {
        style: { width: '100px' },
        src: defaultImage
      })
    )
  }

  return elementsArray
}

/** @param {HTMLImageElement[]} elementsArray */
function resetState(elementsArray = [], defaultImage = DEFAULT_IMAGE) {
  for (let element of elementsArray)
    element.src = defaultImage
}

const elements = init(4)

createElement('div', {
  id: 'elements',
  parent: document.body
}, elements)

createElement('div', {
  id: 'buttons',
  parent: document.body
}, [
  createElement('button', {
    innerText: 'Reset state',
    onclick: () => {
      resetState(elements)
      log('You reset state to default')
    }
  }),

  createElement('button', {
    innerText: 'Random state',
    onclick: () => {
      const state = []
      for (i = 0; i < 4; i++) {
        state[i] = PICTURES[rand(0, PICTURES.length - 1)]
      }
      // const state = [...PICTURES].sort(
      //   () => Math.random() > 0.5 ? 1 : -1)

      state.forEach((e, i) =>
      elements[i] && (elements[i].src = e))

      log(`Your set state to random`)
      console.log(state)
      const pairs = state.filter((e, i, a) => a.indexOf(e) !== i)
      console.log(pairs)
      
      log(`Yor got ${new Set(pairs).size} saim pars `)
      // const pairs = {}

      // state.sort((a,b)=>{
      //     (a+b in pairs)?pairs[a+b]++:pairs[a+b] = 1;
      // })
      // console.log(Object.values(pairs))
    },
  }),

  createElement('button', {
    innerText: 'Start random',
    onclick: () => {
      const elementIndex = rand(0, elements.length - 1)
      const element = elements[elementIndex]

      const imageIndex = rand(0, PICTURES.length - 1)
      const image = PICTURES[imageIndex]

      element.src = image

      log(`You set in ${elementIndex + 1} cube value ${imageIndex + 1}`)
    }
  })
])

const logs = createElement('pre', {
  style: {
    width: '400px',
    height: '300px',
    overflowY: 'scroll',
    display: 'block'
  },
  parent: document.body
})

function log(...text) {
  let outText = text.join(' ').trim()

  if (logs.innerText)
    logs.innerText += '\n'

  logs.innerText += outText
  logs.scrollTop = logs.scrollHeight
}
var arr = ["Apple", "Pear", "Mango", "Strawberry", "Apple", "Pear", "Orange"];

