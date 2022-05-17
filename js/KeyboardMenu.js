class KeyboardMenu {
  constructor() {
    this.options = []
    this.up = null
    this.down = null
    this.prevFocus = null
  }

  setOptions(options) {
    this.options = options
    this.element.innerHTML = this.options.map((option, index) => {
      const disableAttr = option.disabled ? 'disabled' : ""
      return `
        <div class="option">
          <button ${disableAttr} data-button="${index}" data-description="${option.description}">
            ${option.label}
          </button>
          <span class="right">${option.right ? option.right() : ""}</span>
        </div>
      `
    }).join("")

    this.element.querySelectorAll('button').forEach((button, i) => {
      button.addEventListener('click', () => {
        const chosenOption = this.options[Number(button.dataset.button)]
        chosenOption.handler()
      })
      button.addEventListener('mouseenter', () => {
        button.focus();
      })
      button.addEventListener('focus', () => {
        this.prevFocus = button
        this.descriptionElementText.innerText = button.dataset.description
      })
    });


    setTimeout(() => {
      this.element.querySelector('button[data-button]:not([disabled])').focus()
    }, 10);

  }

  createElement() {
    this.element = document.createElement('div')
    this.element.classList.add('KeyboardMenu')

    this.descriptionElement = document.createElement('div')
    this.descriptionElement.classList.add('DescriptionBox')
    this.descriptionElement.innerHTML = `<p>DescriptionBox</p>`
    this.descriptionElementText = this.descriptionElement.querySelector('p')
  }

  end() {
    // console.log('end');

    this.up.unbind()
    this.down.unbind()
    this.upArrow.unbind()
    this.downArrow.unbind()
    this.descriptionElement.remove()
    this.element.remove()
    // this.remove()
  }

  init(container) {
    this.createElement()
    container.appendChild(this.descriptionElement)
    container.appendChild(this.element)

    this.up = new KeyPressListener('KeyW', () => {
      console.log(this.prevFocus);
      const current = Number(this.prevFocus.getAttribute('data-button'))
      const prevButton = Array.from(this.element.querySelectorAll('button[data-button]')).reverse().find(el => {
        return el.dataset.button < current && !el.disabled
      })
      prevButton?.focus()
    })

    this.down = new KeyPressListener('KeyS', () => {
      const current = Number(this.prevFocus.getAttribute('data-button'))
      const nextButton = Array.from(this.element.querySelectorAll('button[data-button]')).find(el => {
        return el.dataset.button > current && !el.disabled
      })
      nextButton?.focus()
    })

    this.upArrow = new KeyPressListener('ArrowUp', () => {
      const current = Number(this.prevFocus.getAttribute('data-button'))
      const prevButton = Array.from(this.element.querySelectorAll('button[data-button]')).reverse().find(el => {
        return el.dataset.button < current && !el.disabled
      })
      prevButton?.focus()
    })

    this.downArrow = new KeyPressListener('ArrowDown', () => {
      const current = Number(this.prevFocus.getAttribute('data-button'))
      const nextButton = Array.from(this.element.querySelectorAll('button[data-button]')).find(el => {
        return el.dataset.button > current && !el.disabled
      })
      nextButton?.focus()
    })
  }
}
