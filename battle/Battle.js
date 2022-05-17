class Battle {
  constructor() {
    this.element = null

    this.combatants = {
      'player1': new Combatant({
        ...Pizzas["s001"],
        team: 'player',
        hp: 1,
        maxHp: 50,
        xp: 1,
        maxXp: 100,
        level: 1,
        status: null,
        isPlayerControlled: true
      }, this),
      'player2': new Combatant({
        ...Pizzas["s002"],
        team: 'player',
        hp: 50,
        maxHp: 50,
        xp: 1,
        maxXp: 100,
        level: 1,
        status: null,
        isPlayerControlled: true
      }, this),

      'enemy1': new Combatant({
          ...Pizzas["f001"],
          team: 'enemy',
          hp: 50,
          maxHp: 50,
          xp: 10,
          maxXp: 100,
          level: 2,
          status: null

        }, this),
      'enemy2': new Combatant({
          ...Pizzas["v001"],
          team: 'enemy',
          hp: 5,
          maxHp: 50,
          xp: 10,
          maxXp: 100,
          level: 3,
          status: null,
        }, this),
    }

    this.activeCombatants = {
      player: 'player1',
      enemy: 'enemy2'
    }

    this.items = [
      { actionId: 'item_recoverStatus', instanceId: 'p1', team: 'player'},
      { actionId: 'item_recoverHp', instanceId: 'p4', team: 'player'},
      { actionId: 'item_recoverStatus', instanceId: 'p2', team: 'player'},
      { actionId: 'item_recoverStatus', instanceId: 'p3', team: 'enemy'},
    ]


  }

  createElement() {
    this.element = document.createElement('div')
    this.element.classList.add('battle')
    this.element.innerHTML = `
    <div class="battle_hero">
      <img src="${'./images/characters/people/hero.png'}" alt="hero">
    </div>
    <div class="battle_enemy">
      <img src="${'./images/characters/people/npc1.png'}" alt="enemy">
    </div>`
  }

  init(container) {
    this.createElement()
    container.appendChild(this.element)
    Object.keys(this.combatants).forEach((key, i) => {
      this.combatants[key].id = key
      this.combatants[key].init(this.element)
    });

    this.turnCycle = new TurnCycle({
      battle: this,
      onNewEvent: e => {
        return new Promise(resolve => {
          const battleEvent = new BattleEvent(e, this)
          battleEvent.init(resolve)
        });
      }
    });
    this.turnCycle.init()
  }

}
