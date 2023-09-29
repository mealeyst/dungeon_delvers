import { MainMenu } from './engine/gui/mainMenu'
import { Stage } from './engine/stage/stage'

document.addEventListener(
  'DOMContentLoaded',
  function () {
    new Stage()
    new MainMenu()
  },
  false,
)
