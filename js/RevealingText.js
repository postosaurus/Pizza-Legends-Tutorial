class ReavealingText {
  constructor(config) {
    this.element = config.element
    this.text = config.text
    this.speed = config.speed || 30;

    this.timout = null
    this.isDone = false
  }

  init() {
    let chars = []
    this.text.split('').forEach((char, i) => {
      let span = document.createElement('span')
      // span.classList.add('TextMessage_span')
      span.textContent = char
      this.element.appendChild(span)

      chars.push({
        span,
        delayAfter: char === ' ' ? 0 : this.speed
      })
    });

    this.revealOneCharacter(chars)
  }

  revealOneCharacter(list) {
    const next = list.splice(0,1)[0]
    next.span.classList.add('revealed')

    if (list.length > 0) {
      this.timeout = setTimeout( () => {
        this.revealOneCharacter(list)
      }, next.delayAfter);
    } else {
      this.isDone = true
    }
  }

  warpToDone() {
    clearTimeout(this.timeout)
    this.isDone = true
    this.element.querySelectorAll('span').forEach((s, i) => {
      s.classList.add('revealed')
    });

  }
}
