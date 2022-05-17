class SubmissionMenu {
  constructor({caster, enemy, onComplete, items, replacements}) {
    // console.log('submission', caster, enemy);
    this.caster = caster
    this.enemy = enemy
    this.replacements = replacements
    this.onComplete = onComplete

    console.log({ replacements});

    let quantityMap = {}
    items.forEach((item) => {
      if (item.team === caster.team) {

        let existing = quantityMap[item.actionId]
        if (existing) {
          existing.quantity += 1
        } else {
          quantityMap[item.actionId] = {
            actionId: item.actionId,
            quantity: 1,
            instanceId: item.instanceId
          }
        }

      }
    });
    this.items = Object.values(quantityMap)
    console.log(this.items);

  }

  decide() {
    const  move = Math.floor(Math.random() * this.caster.actions.length)
    console.log(move);
    this.menuSubmit(Actions[ this.caster.actions[move] ])
  }

  showMenu(container) {
    console.log('createElement');
    this.keyboardMenu = new KeyboardMenu()
    this.keyboardMenu.init(container)
    this.keyboardMenu.setOptions( this.getPages().root )
    console.log(this.keyboardMenu);
  }

  menuSubmit(action, instanceId=null) {
    this.keyboardMenu?.end()

    this.onComplete({
      action,
      target: action.targetType === 'friendly' ? this.caster : this.enemy,
      instanceId
    })
  }

menuSubmitReplacement(replacement) {
  this.keyboardMenu?.end()
  this.onComplete({
    replacement
  })
}


  init(container) {
    if (this.caster.isPlayerControlled) {
      console.log('showMenu');
      this.showMenu(container)
    } else {
      console.log(' enemy decides');
      this.decide()
    }
  }



  getPages() {
    const backOption = {
      label: 'Back',
      description: 'Go back where you\'re from.',
      handler: () => {
        this.keyboardMenu.setOptions(this.getPages().root)
      }
    }
    return {
      root: [
        {
          label: 'Attack',
          description: 'Choose an attack',
          handler: () => {
            this.keyboardMenu.setOptions(this.getPages().attacks)
          }
        },
        {
          label: 'Items',
          description: 'Choose an item',
          // disabled: true,
          handler: () => {
            this.keyboardMenu.setOptions(this.getPages().items)


          }
        },
        {
          label: 'Swap',
          description: 'Change to another pizza',
          handler: () => {
            this.keyboardMenu.setOptions( this.getPages().replacements)
          }
        },
      ],
      attacks: [
        ...this.caster.actions.map(key => {
          const action = Actions[key]
          return {
            label: action.name,
            description: action.description,
            handler: () => {
              this.menuSubmit(action)
            }
          }
        }),
        backOption
      ],
      items: [
        ...this.items.map(item => {
          const action = Actions[item.actionId]
          // console.log('Actions', action)
          return {
            label: action.name,
            description: action.description,
            right: () => {
              return 'x'+item.quantity
            },
            handler: () => {
              this.menuSubmit(action,  item.instanceId)
            }
          }
        }),
        backOption
      ],

      replacements: [
        ...this.replacements.map(replacement => {
          return {
            label: replacement.name,
            description: replacement.description,
            handler: () => {
              this.menuSubmitReplacement(replacement)
              console.log('replacements submissionMenu', replacement);
            }
          }
        }),
        backOption
      ]

    }
  }
}
