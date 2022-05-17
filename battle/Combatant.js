class Combatant {
  constructor(config, battle) {
    this.battle = battle
    this.id = null

    Object.keys(config).forEach((key) => {
      this[key] = config[key]
    });
  }

  get hpPercent() {
    const percent = this.hp / this.maxHp * 100
    return percent > 0 ? percent : 0
  }

  get xpPercent() {
    return this.xp / this.maxXp * 100
  }

  get isActive() {
    return this.battle.activeCombatants[this.team] === this.id
  }


  createElement() {
    this.hudElement = document.createElement('div')
    this.hudElement.classList.add('combatant')
    this.hudElement.setAttribute('data-combatant', this.id)
    this.hudElement.setAttribute('data-team', this.team)
    this.hudElement.setAttribute('data-active', 'false')
    this.hudElement.innerHTML = `
    <p class="combatant_name">${this.name}</p>
    <p class="combatant_level"></p>
    <div class="combatant_character_crop">
      <img class="combatant_character" src="${this.src}" alt="${this.name}" />
    </div>
      <img class="combatant_type" src="${this.icon}" alt="${this.type}" />
    <svg viewBow="0 0 26 3" class="combatant_life-container">
      <rect x=0 y=0 width=0% height=100% fill='#82ff71' />
      <rect x=0 y=0 width=0% height=100% fill='#3ef126' />
    </svg>
    <svg viewBow="0 0 26 3" class="combatant_xp-container">
      <rect x=0 y=0 width=0% height=100% fill='#ffd76a' />
      <rect x=0 y=0 width=0% height=100% fill='#ffc934' />
    </svg>
    <p class="combatant_status"></p>`

    this.pizzaElement = document.createElement('img')
    this.pizzaElement.classList.add('pizza')
    this.pizzaElement.setAttribute('src', this.src)
    this.pizzaElement.setAttribute('alt', this.name)
    this.pizzaElement.setAttribute('data-team', this.team)
    // this.pizzaElement.innerHTML = ``

    this.hpFills = this.hudElement.querySelectorAll('.combatant_life-container > rect')
    this.xpFills = this.hudElement.querySelectorAll('.combatant_xp-container > rect')
  }

  update(changes={}) {
    Object.keys(changes).forEach((key, i) => {
      this[key] = changes[key]
    });

    this.hudElement.setAttribute('data-active', this.isActive)
    this.pizzaElement.setAttribute('data-active', this.isActive)

    this.hpFills.forEach((rect, i) => {
      rect.style.width = `${this.hpPercent}%`
    });

    this.xpFills.forEach((rect, i) => {
      rect.style.width = `${this.xpPercent}%`
    });
    this.hudElement.querySelector('.combatant_level').innerHTML = this.level

    const statusElement = this.hudElement.querySelector('.combatant_status')
    if (this.status) {
      // console.log(this.status.type);
      statusElement.innerHTML = this.status.type
      statusElement.setAttribute('data-status', this.status.type)
      statusElement.style.display = 'block'
    } else {
      statusElement.innerHTML = ''
      statusElement.setAttribute('data-status', '')
      statusElement.style.display = 'none '
    }
  }

  getReplacedEvents(originalEvents) {
    // console.log(this.status?.type);
    if (this.status?.type === 'clumsy' && utils.randomFromArray([true, false, false])) {
      console.log('getReplacedEvents');
      return [
        {type: 'textMessage', text: `${this.name} flops over.`}
      ];
    } else {
      // console.log('originalEvents');
      return originalEvents;
    }

  }

  getPostEvents() {
    if (this.status?.type === 'saucy') {
      return [
        {type: 'textMessage', text: `${this.name} is nice and sausy.`},
        {type: 'stateChange', recover: 5, onCaster: true},
      ]
    }

    if (this.status?.type === 'clumsy') {
      return [
        {type: 'textMessage', text: `${this.name} is feeling clumsy.`},
        // {type: 'stateChange', damage: 2, onCaster: false},
      ]
    }
    return []
  }

  decrementStatus() {
    if (this.status?.expiresIn > 0) {
      console.log(this.status);
      this.status.expiresIn -= 1
      if ( this.status.expiresIn === 0) {
        this.update({
          status: null
        })
        return {
          type: 'textMessage',
          text: 'Status expired!'
        }
      }
    }
    return null
  }

  init(container){
    this.createElement()
    container.appendChild(this.hudElement)
    container.appendChild(this.pizzaElement)
    this.update()
  }
}
