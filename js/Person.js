class Person extends GameObject {
  constructor(config) {
    super(config)
    this.movingProgressRemaining = 0;

    this.directionUpdate = {
      'up': ['y', -1],
      'down': ['y', 1],
      'left': ['x', -1],
      'right': ['x', 1],
    };

    this.isStanding = false
    this.retrying = false
    this.isPlayerControlled = config.isPlayerControlled || false
  }

  update(state) {
    if (this.movingProgressRemaining > 0) {
      this.updatePosition()
    } else {
      if (!state.map.isCutscenePlaying && state.arrow && this.isPlayerControlled) {
        this.startBehavior(state, {
          type: 'walk',
          direction: state.arrow
        })
      }

      this.updateSprite(state)
    }
  }

  startBehavior(state, behavior) {
    this.direction = behavior.direction
    this.retrying = false

    if (behavior.type === 'walk') {
      if (state.map.isSpaceTaken(this.x, this.y, this.direction)) {
        if (behavior.retry && !this.isPlayerControlled) {
          this.retrying = true
          console.log(this.id);
          setTimeout(() => {
            this.startBehavior(state, behavior)
          }, 300);
        }
        return
      }

      state.map.moveWall(this.x, this.y, this.direction)
      this.movingProgressRemaining = 16
    }

    if (behavior.type === 'stand') {
      this.isStanding = true
      setTimeout(() => {
        utils.emitEvent('PersonStandingComplete', {
          whoId: this.id
        });
        this.isStanding = false
      }, behavior.time);
    }

    this.updateSprite(state)
  }

  updateSprite(state) {
    if (this.movingProgressRemaining > 0) {
      this.sprite.setAnimation('walk-' + this.direction)
      return
    }
    this.sprite.setAnimation('idle-' + this.direction)
  }

  updatePosition() {
    const [property, change] = this.directionUpdate[this.direction]
    this[property] += change
    this.movingProgressRemaining -= 1

    if (this.movingProgressRemaining === 0) {
      utils.emitEvent('PersonWalkingComplete', {
        whoId: this.id
      });
    }

  }

}

// class Person extends GameObject{
//   constructor(config) {
//     super(config)
//     this.movingProgressRemaining = 0;
//
//     this.sprite = new Sprite({
//       gameObject: this,
//       src: config.src || 'images/characters/people/hero.png',
//       useShadow: config.useShadow || true,
//     });
//
//     this.isPlayerControlled = config.isPlayerControlled || false
//     this.isStanding = false
//
//     this.directionUpdate = {
//       'up': ['y', -1],
//       'down': ['y', 1],
//       'left': ['x', -1],
//       'right': ['x', 1],
//     };
//   }
//
//   update(state) {
//     if (this.movingProgressRemaining > 0) {
//       this.updatePosition()
//     } else {
//       if(!state.map.isCutscenePlaying && this.isPlayerControlled && state.arrow){
//         this.startBehavior(state, {
//           type: 'walk',
//           direction: state.arrow
//         });
//       }
//
//       this.updateSprite()
//     }
//   }
//
//   startBehavior(state, behavior) {
//     this.direction = behavior.direction
//
//     if (behavior.type == 'walk') {
//       this.movingProgressRemaining = 16
//       this.updateSprite()
//     }
//   }
//
//   updatePosition() {
//     const [property, change] = this.directionUpdate[this.direction]
//     this[property] += change
//     this.movingProgressRemaining -= 1
//
//     if (this.movingProgressRemaining === 0) {
//       utils.emitEvent('PersonStandingComplete', {
//         whoId: this.id
//       })
//     }
//   }
//
//   updateSprite() {
//     if(this.movingProgressRemaining > 0) {
//       this.sprite.setAnimation('walk-' + this.direction)
//       return
//     }
//     this.sprite.setAnimation('idle-' + this.direction)
//   }
//
// }
