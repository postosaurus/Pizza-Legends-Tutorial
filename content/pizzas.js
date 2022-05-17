window.PizzaTypes = {
  normal: 'normal',
  spicy: 'spicy',
  veggie: 'veggie',
  fungi: 'fungi',
  chill: 'chill',
}

window.Pizzas = {
  "s001": {
    name: 'Slice Samurai',
    type: PizzaTypes.spicy,
    description: 'Slice \'em up!',
    src: './images/characters/pizzas/s001.png',
    icon: './images/icons/spicy.png',
    actions: ['damage1', 'damage2', 'statusClumsy', 'damage3', 'statusSaucy'],
    // actions: ['statusClumsy']
  },
  "s002": {
    name: 'Bacon Brigade',
    type: PizzaTypes.spicy,
    description: 'Bacon power',
    src: './images/characters/pizzas/s002.png',
    icon: './images/icons/spicy.png',
    actions: ['damage1', 'damage2', 'statusClumsy', 'damage3', 'statusSaucy'],
    // actions: ['statusClumsy']
  },
  "v001": {
    name: 'Call Me Kale',
    type: PizzaTypes.veggie,
    description: 'Need some gas?',
    src: './images/characters/pizzas/v001.png',
    icon: './images/icons/veggie.png',
    actions: ['damage1', 'statusSaucy', 'damage3', 'statusSaucy'],
  },
  "f001": {
    name: 'Portobello Express',
    type: PizzaTypes.fungi,
    description: 'Fungeramon..',
    src: './images/characters/pizzas/f001.png',
    icon: './images/icons/fungi.png',
    actions: ['damage1', 'statusClumsy', 'damage3', 'statusSaucy'],
    // actions: ['statusClumsy']
  }
}
