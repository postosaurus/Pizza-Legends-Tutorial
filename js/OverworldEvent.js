class OverworldEvent {
  constructor({map, event}) {
    this.map = map
    this.event = event
    console.log(event);
  }

  init() {
    return new Promise(resolve => {
      this[this.event.type](resolve)
    })
  }

  stand(resolve) {
    const who = this.map.gameObjects[this.event.who]
    // console.log(who);

    who.startBehavior({
      map: this.map
    }, {
      type: 'stand',
      direction: this.event.direction,
      time: this.event.time
    });

    const completeHandler = e => {
      // console.log(e.detail.whoId);
      if(e.detail.whoId == this.event.who) {
        document.removeEventListener('PersonStandingComplete', completeHandler)
        resolve()
      }
    }
    document.addEventListener('PersonStandingComplete', completeHandler)
  }

  walk(resolve) {
    const who = this.map.gameObjects[this.event.who]

    who.startBehavior({
      map: this.map
    }, {
      type: 'walk',
      direction: this.event.direction,
      retry: true
    });

    const completeHandler = e => {
      if(e.detail.whoId == this.event.who) {
        document.removeEventListener('PersonWalkingComplete', completeHandler)
        resolve()
      }
    }
    document.addEventListener('PersonWalkingComplete', completeHandler)
  }

  textMessage(resolve) {

    if(this.event.faceHero) {
      const obj = this.map.gameObjects[this.event.faceHero];
      obj.direction = utils.oppositeDirection(this.map.gameObjects['hero'].direction);
    }

    const message = new TextMessage({
      text: this.event.text,
      onComplete: () => resolve()
    });
    message.init(document.querySelector('.gameContainer'))
  }

  changeMap(resole) {

    const sceneTransition = new SceneTransition()
    sceneTransition.init(document.querySelector('.gameContainer'), () => {
      this.map.overworld.startMap(window.OverworldMaps[this.event.map])
      sceneTransition.fadeOut()
      resolve()

    })




  }

  battle(resole) {
    const battle = new Battle({
      onComplete: () => {
        resolve()
      }
    });
    battle.init(document.querySelector('.gameContainer'))
  }
}
