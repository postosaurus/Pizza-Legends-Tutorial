class TurnCycle {
  constructor({ battle, onNewEvent}) {
    this.battle = battle
    this.onNewEvent = onNewEvent
    this.currentTeam = 'player' // or 'enemy'
  }

  async turn() {
    // console.log('turn');
    const casterId = this.battle.activeCombatants[this.currentTeam]
    const caster = this.battle.combatants[casterId]
    const enemyId = this.battle.activeCombatants[caster.team == 'player' ? 'enemy' : 'player']
    const enemy = this.battle.combatants[enemyId]

    const submission = await this.onNewEvent({
      caster,
      enemy,
      type: 'submissionMenu',
    });

    //Stop here if replacing the pizza
    if (submission.replacement) {
      await this.onNewEvent({
        type: 'replace',
        replacement: submission.replacement
      })
      await this.onNewEvent({
        type: 'textMessage',
        text: `Go get them ${submission.replacement.name}`
      })
      this.nextTurn()
    return
    }


    if (submission.instanceId) {
      this.battle.items = this.battle.items.filter(i => i.instanceId !== submission.instanceId)
    }


    const resultingEvents = caster.getReplacedEvents(submission.action.success)

    for (let i = 0; i < resultingEvents.length; i++) {
      const event = {
        ...resultingEvents[i],
        submission,
        action: submission.action,
        caster,
        target: submission.target
      }
      await this.onNewEvent(event)
    }


    const targetDead = submission.target.hp <= 0
    if (targetDead) {
      await this.onNewEvent({
        type: 'textMessage',
        text: `${submission.target.name} is ruined!`
      })
    }

    const winner = this.getWinningTeam()
    if (winner) {
      await this.onNewEvent({
        type: 'textMessage',
        text: 'Winner'
      })
      // TODO: End the battle
      console.log('Exit battle mode');
      return;
    }


    if(targetDead) {
      const replacement = await this.onNewEvent({
        type: 'replacementMenu',
        team: submission.target.team,
      })

      await this.onNewEvent({
        type: 'replace',
        replacement: replacement
      })
      await this.onNewEvent({
        type: 'textMessage',
        text: `${replacement.name} appears!`
      })
      this.currentTeam = submission.target.team == 'player'
      this.nextTurn()
      return
    }


    //Post event
    const postEvent = caster.getPostEvents();
    for (let i = 0; i < postEvent.length; i++) {
      const event = {
        ...postEvent[i],
        submission,
        action: submission.action,
        caster,
        target: submission.target
      }
      await this.onNewEvent(event)
    }

    const expiredEvent = caster.decrementStatus()
    if ( expiredEvent) {
      await this.onNewEvent(expiredEvent)
    }

    this.nextTurn()
  }

  nextTurn() {
    this.currentTeam = this.currentTeam == 'player' ? 'enemy' : 'player'
    this.turn()
  }

  getWinningTeam() {
    const aliveTeams = []
    Object.values(this.battle.combatants).forEach(c => {
      if(c.hp > 0) {
        aliveTeams[c.team] = true
      }
    })
    if(!aliveTeams['player']) { return 'enemy'}
    if(!aliveTeams['enemy']) { return 'player'}
    return null
  }

  async init() {
    // await this.onNewEvent(
    //   {type: 'textMessage', text: 'The Battle is starting!'}
    // )

    this.turn()
  }
}
