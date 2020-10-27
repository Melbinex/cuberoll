const DEFAULT_IMAGE = 'img/0.jpg'
const PICTURES = [
  {
    url: 'img/0.jpg',
    name: 'Ryder',
  },
  {
    url: 'img/1.jpg',
    name: 'Zuma',
  },
  {
    url: 'img/2.jpg',
    name: 'Everest',
  },
  {
    url: 'img/3.jpg',
    name: 'Marshal',
  },
  {
    url: 'img/4.jpg',
    name: 'Rubble',
  },
  {
    url: 'img/5.jpg',
    name: 'Skye',
  },
  {
    url: 'img/6.jpg',
    name: 'Tracker',
  },
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

/** @param {HTMLImageElement[]} elementsArray */
function getStateOfElements(elementsArray = []) {
  return elementsArray.map((e) => {
    return PICTURES.find(
      (el) => e.src.indexOf(el.url) != -1)
  })
}

/** @return {HTMLImageElement[]} */
function init(length = 6, defaultImage = DEFAULT_IMAGE) {
  return [...new Uint8Array(length)].map(() => {
    return createElement('img', {
      style: { width: '100px' },
      src: defaultImage,
    })
  })
}

/** @param {HTMLImageElement[]} elementsArray */
function resetState(elementsArray = [], defaultImage = DEFAULT_IMAGE) {
  for (let element of elementsArray)
    element.src = defaultImage
}

const elements = init(6)

createElement(
  'div', {
    id: 'elements',
    parent: document.body
  },
  elements
)

createElement(
  'div', {
    id: 'buttons',  
    parent: document.body
  }, [
    createElement('button', {
      innerText: 'Reset state',
      onclick: () => {
        resetState(elements)

        log(`Your set state to default`)
      },
    }),
    
    createElement('button', {
      innerText: 'Random state',
      onclick: () => {
        const state = [...PICTURES].sort(
          () => Math.random() > 0.5 ? 1 : -1)

        state.forEach((e, i) =>
          elements[i] && (elements[i].src = e.url))
        
        log(`Your set state to random`)
      },
    }),

    createElement('button', {
      innerText: 'Start random',
      onclick: () => {
        const elementIndex = rand(0, elements.length - 1)
        const element = elements[elementIndex]

        const imageIndex = rand(0, PICTURES.length - 1)
        const image = PICTURES[imageIndex]

        element.src = image.url

        log(`Your ${elementIndex + 1} dog is ${image.name}`)
      },
    }),

    createElement('button', {
      innerText: 'Sort of name',
      onclick: () => {
        let state = getStateOfElements(elements)
        let stateSrc = state.map((e) => e.name).join('')
        let type = 'ASK'

        state.sort((a, b) => {
          if (a.name < b.name)
            return -1

          if (a.name > b.name)
            return 1

          return 0
        })

        let stateDesk = state.map((e) => e.name).join('')

        if (stateSrc == stateDesk) {
          type = 'DESK'
          state.reverse()
        }

        state.forEach((e, i) => 
          elements[i] && (elements[i].src = e.url))

        log(`Your sort elements by name of ${type}`)
      },
    }),

    createElement('button', {
      innerText: 'Sort of index',
      onclick: () => {
        let state = getStateOfElements(elements)
        let stateSrc = state.map((e) => e.name).join('')
        let type = 'ASK'

        state.sort((a, b) => {
          let aI = PICTURES.indexOf(a)
          let bI = PICTURES.indexOf(b)

          if (aI < bI)
            return -1

          if (aI > bI)
            return 1

          return 0
        })

        let stateDesk = state.map((e) => e.name).join('')

        if (stateSrc == stateDesk) {
          type = 'DESK'
          state.reverse()
        }

        state.forEach((e, i) => 
          elements[i] && (elements[i].src = e.url))

        log(`Your sort elements by index of ${type}`)
      },
    }),
  ]
)

const logs = createElement('pre', {
  style: {
    width: '700px',
    height: '300px',
    overflowY: 'scroll',
    display: 'block',
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