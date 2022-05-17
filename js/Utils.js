const utils = {
  withGrid(n) {
    return n * 16
  },

  asGridCoords(x, y) {
    return `${x*16}, ${y*16}`
  },

  nextPosition(initalX, initalY, direction) {
    let x = initalX
    let y = initalY
    const size = 16
    if(direction === 'left') {
      x -= size;
    } else if (direction === 'right') {
      x += size;
    } else if (direction === 'up') {
      y -= size;
    } else if (direction === 'down') {
      y += size;
    }
    return {x, y};
  },

  oppositeDirection(direction) {
    if(direction === 'left') {return 'right'}
    if(direction === 'right') {return 'left'}
    if(direction === 'up') {return 'down'}
    return 'up'
  },

  emitEvent(name, detail) {
    const event = new CustomEvent(name, {
      detail
    });
    document.dispatchEvent(event);
  },

  randomFromArray(array) {
    return array[ Math.floor( Math.random() * array.length) ]
  },

  wait(ms) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, ms);
    });
  }

}
