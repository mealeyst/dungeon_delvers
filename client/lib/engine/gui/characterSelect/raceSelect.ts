import { Control, Grid } from '@babylonjs/gui'
import { RaceType } from '../../../content/race'
import { uiButton } from './uiButton'

export const raceSelect = (
  menuId: string,
  raceSelectCallback: (race: RaceType) => void,
) => {
  const humanButton = uiButton(`${menuId}__race_human`, 'Human')
  const dwarfButton = uiButton(`${menuId}__race_dwarf`, 'Dwarf')
  const goblinButton = uiButton(`${menuId}__race_goblin`, 'Goblin')
  const orcButton = uiButton(`${menuId}__race_orc`, 'Orc')
  humanButton.onPointerDownObservable.add(() => {
    raceSelectCallback('human')
  })
  dwarfButton.onPointerDownObservable.add(() => {
    raceSelectCallback('dwarf')
  })
  goblinButton.onPointerDownObservable.add(() => {
    raceSelectCallback('goblin')
  })
  orcButton.onPointerDownObservable.add(() => {
    raceSelectCallback('orc')
  })
  const raceGrid = new Grid(`${menuId}__race_grid`)
  raceGrid.width = '500px'
  raceGrid.height = '200px'
  raceGrid.addColumnDefinition(0.5)
  raceGrid.addColumnDefinition(0.5)
  raceGrid.addRowDefinition(0.5)
  raceGrid.addRowDefinition(0.5)
  raceGrid.addControl(humanButton, 0, 0)
  raceGrid.addControl(dwarfButton, 0, 1)
  raceGrid.addControl(goblinButton, 1, 0)
  raceGrid.addControl(orcButton, 1, 1)
  raceGrid.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER
  return raceGrid
}
