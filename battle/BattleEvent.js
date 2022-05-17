class BattleEvent {
  constructor(event, battle) {
    this.event = event
    this.battle = battle
    // console.log(event, battle);

  }


  textMessage(resolve) {

    const text = this.event.text
    .replace('{CASTER}',this.event.caster?.name)
    .replace('{TARGET}',this.event.target?.name)
    .replace('{ACTION}',this.event.action?.name)

    const message = new TextMessage({
      text,
      onComplete: () => {
        resolve()
      }
    });
    message.init(this.battle.element)
  }

  submissionMenu(resolve) {
    const {caster} = this.event
    const menu = new SubmissionMenu({
      caster: this.event.caster,
      enemy: this.event.enemy,
      items: this.battle.items,
      replacements: Object.values(this.battle.combatants).filter(c => {
        return c.id !== caster.id && c.team === caster.team && c.hp > 0
      }),
      onComplete: submission => {
        resolve(submission)
      }
    });
    menu.init(this.battle.element)
    // menu.init()
  }

  replacementMenu(resolve) {
    const menu = new ReplacementMenu({
      replacements: Object.values(this.battle.combatants).filter(c => {
        return c.team === this.event.team && c.hp > 0
      }),
      onComplete: replacement => {
        resolve(replacement)
        console.log('battlevent replacementMenu', replacement);
      }
    })
    menu.init(this.battle.element)
  }

  async replace(resolve) {
    const { replacement } = this.event
    console.log(replacement);

    //Clear out the old Combatant
    const prevCombatant = this.battle.combatants[this.battle.activeCombatants[replacement.team]]
    this.battle.activeCombatants[replacement.team] = null
    console.log(this.battle.combatants, this.battle.activeCombatants, replacement.team)
    prevCombatant.update()
    await utils.wait(400)

    //in the new
    this.battle.activeCombatants[replacement.team] = replacement.id
    replacement.update()
    await utils.wait(400)

    resolve()
  }

  async stateChange(resolve) {
    const {caster, target, damage, recover, status, action} = this.event
    let who = this.event.onCaster ? caster : target


    if (damage) {
      // target = who

      target.update({
        hp: target.hp - damage
      })

      target.pizzaElement.classList.add('battle-damage-blink')
    }

    if (recover) {
      let newHp = who.hp + recover
      if (newHp > who.maxHp) {
        newHp = who.maxHp
      }
      who.update({
        hp: newHp
      })
    }

    if (status) {
      // console.log(status);
      who.update({
        status: {...status}
      })
    }
    if (status === null) {
      who.update({
        status: null
      })
    }

    await utils.wait(500)
    target.pizzaElement.classList.remove('battle-damage-blink')

    resolve()
  }

  animation(resolve) {
    console.log(this.event.animation);
    const fn = window.BattleAnimations[this.event.animation]
    fn(this.event, resolve)
  }

  init(resolve) {
    this[this.event.type](resolve)
  }
}
