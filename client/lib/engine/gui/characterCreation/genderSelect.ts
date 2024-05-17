import { Control, Grid } from '@babylonjs/gui'
import { uiButton } from './uiButton'

export const genderSelect = (
  menuId: string,
  genderSelectCallback: (gender: 'm' | 'f') => void,
) => {
  const maleButton = uiButton(`${menuId}__gender_male`, 'Male')
  const femaleButton = uiButton(`${menuId}__gender_female`, 'Female')
  maleButton.onPointerDownObservable.add(() => {
    genderSelectCallback('m')
  })
  femaleButton.onPointerDownObservable.add(() => {
    genderSelectCallback('f')
  })
  const genderGrid = new Grid(`${menuId}__gender_grid`)
  genderGrid.addColumnDefinition(0.5)
  genderGrid.addColumnDefinition(0.5)
  genderGrid.width = '500px'
  genderGrid.height = '60px'
  genderGrid.addControl(maleButton, 0, 0)
  genderGrid.addControl(femaleButton, 0, 1)
  genderGrid.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER
  return genderGrid
}
