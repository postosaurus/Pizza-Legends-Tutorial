class TextMessage {
  constructor(config) {
    this.text = config.text
    this.onComplete = config.onComplete
    this.element = null
    // console.log(config.text);
  }

  init(container) {
    this.createElement()
    container.appendChild(this.element)
    this.revealingText.init()
  }

  createElement() {
    this.element = document.createElement('div')
    this.element.classList.add('TextMessage')

    this.element.innerHTML = `
    <p class="TextMessage_p"></p>
    <button class="TextMessage_button">Next</button>`

    // Typewriter
    this.revealingText =  new ReavealingText({
      element: this.element.querySelector('.TextMessage_p'),
      text: this.text,
      // speed:
    })

    this.element.querySelector('button').addEventListener('click', () => {
      this.done()
    });

    this.actionListener = new KeyPressListener("Space", () => {
      this.done()
    })

  }

  done() {
    if (this.revealingText.isDone){
      this.element.remove()
      this.actionListener.unbind()
      this.onComplete()
    } else {
      this.revealingText.warpToDone()
    }
  }
}
