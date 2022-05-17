class Sprite {
  constructor(config) {

    //setup image
    this.image = new Image()
    this.image.src = config.src
    this.image.onload = () => {
      this.isLoaded = true
    }

    this.shadow = new Image();
    this.useShadow = config.useShadow || true;
    if (this.useShadow) {
      this.shadow.src = './images/characters/shadow.png'
      this.shadow.onload = () => {
        this.isShadowLoaded = true
      }
    }

    // config animations
    this.animations = config.animations || {
      "idle-down": [ [0,0] ],
      "walk-down": [ [1,0], [0,0], [3,0], [0,0]],
      "idle-right": [ [0,1] ],
      "walk-right": [ [1,1], [0,1], [3,1], [0,1]],
      "idle-up": [ [0,2] ],
      "walk-up": [ [1,2], [0,2], [3,2], [0,2]],
      "idle-left": [ [0,3] ],
      "walk-left": [ [1,3], [0,3], [3,3], [0,3]],
    }

    // inital state
    this.currentAnimation = config.currentAnimation || 'idle-down'
    this.currentAnimationFrame = 0

    this.animationFrameLimit = config.animationFrameLimit || 8
    this.animationFrameProgress = this.animationFrameLimit

    // reference to the gameObject
    this.gameObject = config.gameObject
  }

  get frame() {
    return this.animations[this.currentAnimation][this.currentAnimationFrame]
  }

  updateAnimationProgress() {
    if (this.animationFrameProgress > 0) {
      this.animationFrameProgress -= 1
      return
    }

    this.animationFrameProgress = this.animationFrameLimit
    this.currentAnimationFrame += 1

    if (this.frame === undefined) {
      this.currentAnimationFrame = 0
    }
  }

  setAnimation(key) {
    if (this.currentAnimation !== key) {
      this.currentAnimation = key
      this.currentAnimationFrame = 0;
      this.animationFrameProgress = this.animationFrameLimit
    }
  }

  draw(ctx, cameraPerson) {
    const x = this.gameObject.x  - 8 + utils.withGrid(10.5) - cameraPerson.x
    const y = this.gameObject.y - 18 + utils.withGrid(6) - cameraPerson.y

    const [frameX, frameY] = this.frame

    this.isShadowLoaded && ctx.drawImage(this.shadow, x, y)

    this.isLoaded && ctx.drawImage(
      this.image,
      frameX * 32, frameY * 32,
      32, 32,
      x, y,
      32, 32)

      this.updateAnimationProgress()
  }
}


// class Sprite {
//   constructor(config) {
//     this.image = new Image()
//     this.image.src = config.src
//     this.image.onload = () => {
//       this.isLoaded = true
//     };
//
//     this.shadow = new Image()
//     // this.useShadow = config.useShadow
//     if (config.useShadow) this.shadow.src = 'images/characters/shadow.png'
//     this.shadow.onload = () => {
//       this.isShadowLoaded = true
//     }
//
//     this.animations = config.animations || {
//       "idle-down": [ [0,0] ],
//       "walk-down": [ [1,0], [0,0], [3,0], [0,0]],
//       "idle-right": [ [0,1] ],
//       "walk-right": [ [1,1], [0,1], [3,1], [0,1]],
//       "idle-up": [ [0,2] ],
//       "walk-up": [ [1,2], [0,2], [3,2], [0,2]],
//       "idle-left": [ [0,3] ],
//       "walk-left": [ [1,3], [0,3], [3,3], [0,3]],
//     }
//     this.currentAnimation = config.currentAnimation || "idle-down";
//     this.currentAnimationFrame = 0;
//
//     this.animationFrameLimit = config.animationFrameLimit || 4;
//     this.animationFrameProgress =  this.animationFrameLimit;
//
//     this.gameObject = config.gameObject
//   }
//
//     get frame() {
//         return this.animations[this.currentAnimation][this.currentAnimationFrame]
//     }
//
//     setAnimation(key) {
//       if(this.currentAnimation !== key) {
//         this.currentAnimation = key;
//         this.currentAnimationFrame = 0;
//         this.animationFrameProgress = this.animationFrameLimit;
//       }
//     }
//
//     updateAnimationProgress() {
//       if(this.animationFrameProgress > 0) {
//         this.animationFrameProgress -= 1;
//         return;
//       }
//
//       this.animationFrameProgress = this.animationFrameLimit;
//       this.currentAnimationFrame += 1;
//
//       if (this.frame === undefined) {
//         this.currentAnimationFrame = 0;
//       }
//     }
//
//     draw(ctx, cameraPerson, offset) {
//
//       const [frameX, frameY] = this.frame;
//       const x = this.gameObject.x - 8 + offset[0]
//       const y = this.gameObject.y - 18 + offset[1]
//
//       this.isShadowLoaded && ctx.drawImage(this.shadow,
//       x +  utils.widthGrid(4) - cameraPerson.x, y + utils.widthGrid(4) - cameraPerson.y,
//       );
//
//       this.isLoaded && ctx.drawImage(this.image,
//         frameX * 32, frameY * 32,
//         32,32,
//         x +  utils.widthGrid(4) - cameraPerson.x, y + utils.widthGrid(4) - cameraPerson.y,
//         32,32
//       );
//       this.updateAnimationProgress();
//     }
//
// }
