class OverworldMap {
  constructor(config) {
    this.overworld = null
    this.gameObjects = config.gameObjects || {}
    this.walls = config.walls || {}
    this.cutsceneSpaces = config.cutsceneSpaces || []

    this.lowerImage = new Image()
    this.lowerImage.src = config.lowerSrc

    this.upperImage = new Image()
    this.upperImage.src = config.upperSrc

    this.isCutscenePlaying = false
  }

  mountObjects() {
    Object.keys(this.gameObjects).forEach((key, i) => {
      let object = this.gameObjects[key]

      object.mount(this)
      object.id = key
    });
  }

  checkForActionCutscene() {
    if (this.isCutscenePlaying) return;
    const hero = this.gameObjects.hero
    const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction)

    const match = Object.values(this.gameObjects).find(object => {
      return `${object.x}, ${object.y}` === `${nextCoords.x}, ${nextCoords.y}`
    });

    console.log(match, match.talking[0].length);
    if (!this.isCutscenePlaying && match && match.talking.length) {
      this.startCutscene(match.talking[0].events)
    }
  }

  checkForFootstepCutscene() {
    const hero = this.gameObjects.hero
    const match = this.cutsceneSpaces[`${hero.x}, ${hero.y}`]
    if (!this.isCutscenePlaying && match) {
      this.startCutscene(match[0].events)
    }
  }

  isSpaceTaken(currentX, currentY, direction) {
    const {x, y} = utils.nextPosition(currentX, currentY, direction)
    return this.walls[`${x}, ${y}`] || false
  }

  drawLowerImage(ctx, cameraPerson) {
    ctx.drawImage(this.lowerImage,
      utils.withGrid(10.5) - cameraPerson.x,
      utils.withGrid(6) - cameraPerson.y)
  }

  drawUpperImage(ctx, cameraPerson) {
    ctx.drawImage(this.upperImage,
      utils.withGrid(10.5) - cameraPerson.x,
      utils.withGrid(6) - cameraPerson.y)
  }

  async startCutscene(events) {
    // console.log(events);
    this.isCutscenePlaying = true

    for (let i = 0; i<events.length; i++) {
      const eventHandler = new OverworldEvent({
        event: events[i],
        map: this
      });
      await eventHandler.init()
    }

    this.isCutscenePlaying = false
    Object.values(this.gameObjects).forEach(object =>  {
      if (object.retrying) {return}
      object.doBehaviorEvent(this) // BUG: Cant talk to walking persons
    });
  }

  addWall(x, y) {
    this.walls[`${x}, ${y}`] = true
  }

  removeWall(x, y) {
    delete this.walls[`${x}, ${y}`]
  }

  moveWall(wasX, wasY, direction) {
    this.removeWall(wasX, wasY)
    const {x, y} = utils.nextPosition(wasX, wasY, direction)
    this.addWall(x, y)
  }
}

window.OverworldMaps = {
  DemoRoom: {
    lowerSrc: './images/maps/DemoLower.png',
    upperSrc: './images/maps/DemoUpper.png',
    gameObjects: {
      hero: new Person({
        x: utils.withGrid(5), y: utils.withGrid(9),
        isPlayerControlled: true,
      }),

      npcA: new Person({
        x: utils.withGrid(3), y: utils.withGrid(5),
        src: './images/characters/people/npc1.png',
        behaviorLoop: [
          {type: 'walk', direction: 'down'},
          {type: 'walk', direction: 'left'},
          {type: 'stand', direction: 'up', time: 800},
          {type: 'walk', direction: 'right'},
          {type: 'walk', direction: 'up'},
        ],
        talking: [{
          events: [
            {type: 'textMessage', text:'I am HUNGRY!!!', faceHero: 'npcA'},
            {type: 'battle'}
          ]
        }]

      }),

      npcB: new Person({
        x: utils.withGrid(8), y: utils.withGrid(5),
        src: './images/characters/people/npc4.png',
        behaviorLoop: [
          {type: 'stand', direction: 'up', time: 800},
          {type: 'stand', direction: 'right', time: 1000},
          {type: 'stand', direction: 'down', time: 500},
          {type: 'stand', direction: 'left', time: 200},
        ],
        talking: [{
          events: [
            {type: 'textMessage', text:'Hello', faceHero: 'npcB'}
          ]
        }]
      })
    },
    cutsceneSpaces : {
      [utils.asGridCoords(7, 4)]: [
        {
        events: [
          {who: 'npcB', type: 'stand', direction: 'up', time: 300 },
          {who: 'npcB', type: 'textMessage', text: 'Hey!', },
          {who: 'hero', type: 'walk', direction: 'down'},
          {who: 'hero', type: 'stand', direction: 'right', time: 100},
          {who: 'npcB', type: 'stand', direction: 'left', time: 100},
          {who: 'npcB', type: 'textMessage', text: `You can't be in there!`},
          ]
        }
      ],
      [utils.asGridCoords(5, 10)]:[
        {
          events: [
            {type: 'changeMap', map: 'Kitchen'},
          ]
        }
      ]

    },
    walls: {
      [utils.asGridCoords(7, 6)]: true,
      [utils.asGridCoords(8, 6)]: true,
      [utils.asGridCoords(7, 7)]: true,
      [utils.asGridCoords(8, 7)]: true,
    }
  },

  Kitchen: {
    lowerSrc: './images/maps/GreenKitchenLower.png',
    upperSrc: './images/maps/GreenKitchenUpper.png',
    gameObjects: {
      hero: new Person({
        x: utils.withGrid(6), y: utils.withGrid(8),
        isPlayerControlled: true
      }),

      npcB: new Person({
        x: utils.withGrid(4), y: utils.withGrid(5),
        src: './images/characters/people/npc2.png',
        talking: [{
          events: [
            {type: 'textMessage', text:'Hey there! You look like someone that is looking for a job. Bring me 3 Lemons and a Drinking Straw and I will teach you something. It is real nice, believe me.', faceHero: 'npcB'}
          ]
        }]

      })
    },

  }
}
