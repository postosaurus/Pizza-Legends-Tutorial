window.Actions = {
  damage1: {
    name: 'Whoomp',
    targetType: 'enemy',
    description: 'Hit in physical move',
    success: [
      {type: 'textMessage', text: '{CASTER} uses {ACTION}'},
      {type: 'animation', animation: 'spin'},
      {type: 'stateChange', damage: 5},
    ]
  },

  statusSaucy: {
    name: 'Tomato Squeeze',
    targetType: 'friendly',
    description: 'Makes your pizza saucy',
    success: [
      {type: 'textMessage', text: '{CASTER} uses {ACTION}'},
      {type: 'animation', animation: 'grow'},
      {type: 'stateChange',  status: { type: 'saucy', expiresIn: 3} },//, onCaster: true},
      {type: 'textMessage', text: '{CASTER} is nice and saucy.'},
    ]
  },

  statusClumsy: {
    name: 'Olive Oil',
    targetType: 'enemy',
    description: 'Make enemy oily',
    success: [
      {type: 'textMessage', text: '{CASTER} uses {ACTION}'},
      {type: 'animation', animation: 'glob', color: '#dafd2a'},
      {type: 'stateChange', status: { type: 'clumsy', expiresIn: 3} },//, onCaster: true},
      {type: 'textMessage', text: '{TARGET} is slipping.'},
    ]
  },

  damage2: {
    name: 'Ingredients',
    description: 'Put more ingredients on your pizza and attack',
    targetType: 'friendly',
    success: [
      {type: 'textMessage', text: '{CASTER} uses {ACTION}'},
      {type: 'animation', animation: 'blink'},
      {type: 'stateChange', damage: 15},
      {type: 'stateChange', status: { type: 'saucy', expiresIn: 5}},
      {type: 'textMessage', text: '{CASTER} hits himself.'},
    ]
  },

  damage3: {
    name: 'Turn Around',
    description: 'Turns around to hit hard',
    success: [
      {type: 'textMessage', text: '{CASTER} uses {ACTION}'},
      {type: 'animation', animation: 'turn'},
      {type: 'stateChange', damage: 10},
    ]
  },

//ITEM
  item_recoverStatus: {
    name: 'Heating Lamp',
    description: 'Makes your pizza fresh again.',
    targetType: 'friendly',
    success: [
      {type: 'textMessage', text: '{CASTER} uses a {ACTION}'},
      {type: 'animation', animation: 'recover'},
      {type: 'stateChange',  status: null },//, onCaster: true},
      {type: 'textMessage', text: '{CASTER} is feelin\' fresh'},
    ]
  },

  item_recoverHp: {
    name: 'Parmesan',
    description: 'Sprankle some parmesan on your pizza.',
    targetType: 'friendly',
    success: [
      {type: 'textMessage', text: '{CASTER} sprankle some {ACTION}'},
      {type: 'animation', animation: 'recover'},
      {type: 'stateChange',  recover: 10 },//, onCaster: true},
      {type: 'textMessage', text: '{CASTER} is tastier then before!'},
    ]
  },


}
