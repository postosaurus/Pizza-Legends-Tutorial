class SceneTransition {
  constructor() {
    this.element = null
  }

  createElement() {
    this.element = document.createElement('div')
    this.element.classList.add('SceneTransition')
    console.log('createElement');
  }

  fadeOut() {
    this.element.classList.add('fadeOut')
    this.element.addEventListener('animationend', () => {
      this.element.remove()
    }, {once: true})
  }

  init(container, callback) {
    console.log('init');
    this.createElement()
    container.appendChild(this.element)

    this.element.addEventListener('animationend', () => {
      callback()
    }, {once: true})
  }
}
