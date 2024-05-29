import { Button } from '@babylonjs/gui'

export const uiButton = (id: string, text: string) => {
  const button = Button.CreateSimpleButton(`${id}__button`, text)
  button.color = 'white'
  button.paddingTop = '10px'
  button.paddingBottom = '10px'
  button.paddingLeft = '10px'
  button.paddingRight = '10px'
  return button
}
