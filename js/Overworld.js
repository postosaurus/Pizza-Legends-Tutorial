class Overworld {
  constructor(config) {
    this.element = config.element
    this.canvas = this.element.querySelector('.gameCanvas')
    this.ctx = this.canvas.getContext("2d")


    this.debug = false
    this.debugContainer = document.querySelector('.debug')
    this.debugContainer.classList.add('hide')
    this.map = null
  }

  startMap(config) {
    this.map = new OverworldMap(config)
    this.map.overworld = this
    this.map.mountObjects()
  }

  init() {
    this.startMap(window.OverworldMaps.DemoRoom)

    this.directionInput = new DirectionInput()
    this.directionInput.init()

    this.bindActionInput()
    this.bindHeroPositionCheck()

    // DEBUG:
    document.addEventListener('keydown', (e) => {
      if (e.code === 'KeyQ') {
        if (this.debug) {
          this.debug = false
          this.debugContainer.classList.add('hide')
        } else {
          this.debug = true
          this.debugContainer.classList.remove('hide')
        }
      }
    });

    this.startGameLoop()

    this.map.startCutscene([
      // {type: 'battle'},
      // {type: 'textMessage', text: 'Good! To move use the arrow keys or w, a, s, d.'},
      // {type: 'textMessage', text: 'Go and talk to people by hitting the space bar.'}
      // {map: 'Kitchen', type: 'changeMap'},
      {who: 'hero', type: 'walk', direction: 'up'},
      {who: 'hero', type: 'walk', direction: 'up'},
      {who: 'hero', type: 'walk', direction: 'up'},
      {who: 'hero', type: 'walk', direction: 'up'},
      {who: 'hero', type: 'walk', direction: 'right'},
      {who: 'hero', type: 'walk', direction: 'right'},
      {who: 'npcB', type: 'stand', direction: 'left', time: 100},
      {type: 'textMessage', text: 'Welcome to this world, press the space bar for actions.'},
      {type: 'textMessage', text: 'You can also use the space bar to talk to people. Try it out.'},
      {who: 'npcB', type: 'walk', direction: 'right'},
      // {who: 'hero', type: 'stand', direction: 'right', time: 300},
    ])
  }

  startGameLoop() {
    const step = () => {

      Object.values(this.map.gameObjects).forEach((object, i) => {
        object.update({
          map: this.map,
          arrow: this.directionInput.direction,
          retry: false
        })
      });


      this.cameraPerson = this.map.gameObjects.hero

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

      this.map.drawLowerImage(this.ctx, this.cameraPerson)

      Object.values(this.map.gameObjects).sort((a, b) => {
        return a.y - b.y}).forEach(object =>{
        object.sprite.draw(this.ctx, this.cameraPerson)
      });


      this.map.drawUpperImage(this.ctx, this.cameraPerson)

      // DEBUG:
      document.querySelector('.posX').innerText = 'x: ' + Math.floor(this.map.gameObjects['hero'].x / 16)
      document.querySelector('.posY').innerText = 'y: ' + Math.floor(this.map.gameObjects['hero'].y / 16)

      if (this.debug) {
        Object.keys(this.map.walls).forEach((item, i) => {
          const [x, y] = item.split(', ')
          this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
          this.ctx.fillRect(
            x - this.cameraPerson.x + utils.withGrid(10.5),
            y - this.cameraPerson.y + utils.withGrid(6),
            16, 16)
          });

          Object.keys(this.map.cutsceneSpaces).forEach((space, i) => {
            // console.log(space);
            const [x, y] = space.split(', ')
            this.ctx.fillStyle = 'rgba(0, 0, 255, 0.3)'
            this.ctx.fillRect(
              x - this.cameraPerson.x + utils.withGrid(10.5),
              y - this.cameraPerson.y + utils.withGrid(6),
              16, 16)
            });


      }

      requestAnimationFrame(() => {
        step();
      })
    };
    step()
  }

  bindActionInput() {
    new KeyPressListener('Space', () => {
      this.map.checkForActionCutscene()
    })
  }

  bindHeroPositionCheck() {
    document.addEventListener('PersonWalkingComplete', (e) => {
      if (e.detail.whoId === this.map.gameObjects.hero.id) {
        this.map.checkForFootstepCutscene()
      }
    })
  }
}
