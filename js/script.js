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

  if(options.parent) {
    if(options.parent instanceof HTMLElement)
      options.parent.appendChild(element)
    
    delete options.parent
  }

  if(options.ref) {
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
    onclick: () => resetState(elements)
  }),
  createElement('button', {
    innerText: 'Start random',
    onclick: () => {
      const elementIndex = rand(0, elements.length - 1)
      const element = elements[elementIndex]

      const imageIndex = rand(0, PICTURES.length - 1)
      const image = PICTURES[imageIndex]

      element.src = image

      if(logs.innerText)
        logs.innerText += '\n'

      logs.innerText += `
        You set in ${elementIndex + 1} cube value ${imageIndex + 1}
      `.trim()
      logs.scrollTop = logs.scrollHeight
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