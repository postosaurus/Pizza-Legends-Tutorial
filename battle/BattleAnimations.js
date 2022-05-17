window.BattleAnimations = {

  async spin(event, onComplete) {
    const element = event.caster.pizzaElement
    const animationClassName = event.caster.team == 'player' ? 'battle-spin-right' : 'battle-spin-left'
    element.classList.add(animationClassName)

    element.addEventListener('animationend', () => {
      element.classList.remove(animationClassName)
    }, {once: true});

    await utils.wait(100)
    onComplete()
  },

  async grow(event, onComplete) {
    const element = event.caster.pizzaElement
    element.classList.add('battle-grow')

    element.addEventListener('animationend', () => {
      element.classList.remove('battle-grow')
    }, {once: true});

    await utils.wait(1200)
    onComplete()
  },

  async turn(event, onComplete) {
    const element = event.caster.pizzaElement
    const animationClassName = event.caster.team == 'player' ? 'battle-turn-right' : 'battle-turn-left'
    element.classList.add(animationClassName)

    element.addEventListener('animationend', () => {
      element.classList.remove(animationClassName)
    }, {once: true});

    await utils.wait(600)
    onComplete()
  },

  async glob(event, onComplete) {
    const {caster} = event
    let div = document.createElement('div')
    div.classList.add('glob-orb')
    div.classList.add(caster.team == 'player' ? 'battle-glob-right' : 'battle-glob-left')

    div.innerHTML = `
    <svg viewBox="0 0 32 32" width="32" height="32">
      <circle cx="16" cy="16" r='16' fill="${event.color}" />
    </svg>`

    div.addEventListener('animationend', () => {
      div.remove()
    });

    document.querySelector('.battle').appendChild(div)

    await utils.wait(820)
    onComplete()
  },

  async recover(event, onComplete) {

    let div = document.createElement('div')
    div.classList.add('battle-recover')
    div.innerHTML = `
    <svg viewBox="0 0 50 50" width="50" height="50">
       <circle class="circle" cx="25" cy="25" r='25' fill="white" />
     </svg>`

    div.addEventListener('animationend', () => {
    })

    document.querySelector('.battle').appendChild(div)

    await utils.wait(1300)
    div.classList.remove('battle-recover')
    div.remove()
    onComplete()
  },

  async ingredients(event, onComplete) {
    const img = document.querySelector('.battle').querySelector(`.pizza[data-team="player"]`)
    img.classList.add('battle-ingredients')
    console.log(img);
    img.addEventListener('animationend', () => {
    })

    await utils.wait(1500)
    img.classList.remove('battle-ingredients')
    onComplete()
  },

  async blink(event, onComplete) {
    const img = document.querySelector('.battle').querySelector(`.pizza[data-team="player"]`)
    img.classList.add('blink')

    await utils.wait(2000)
    img.classList.remove('blink')
    onComplete()
  }

}
