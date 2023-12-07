import { Button, Control, Grid, StackPanel, TextBlock } from '@babylonjs/gui'
import { ATTRIBUTES } from '../../core/attribute'

export class AttributeSelect {
  private _attributes: Record<ATTRIBUTES, number>
  private _availablePoints: number = 15
  renderAttributePanel(menuId: string) {
    const attributesPanel = new StackPanel(`${menuId}__attribute_stack`)
    attributesPanel.height = '100%'
    attributesPanel.width = '200px'
    attributesPanel.background = 'black'
    attributesPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT

    for (const attribute in ATTRIBUTES) {
      const attributePanel = new StackPanel(`${menuId}__${attribute}_stack`)
      const availablePointsLabel = new TextBlock(
        `${menuId}__available_points_label`,
        `Available Points: ${this._availablePoints}`,
      )

      availablePointsLabel.color = 'white'
      const attributeValueGrid = new Grid(
        `${menuId}__attribute_${attribute}_grid`,
      )
      attributeValueGrid.width = '160px'
      attributeValueGrid.height = '40px'
      attributeValueGrid.addColumnDefinition(0.33)
      attributeValueGrid.addColumnDefinition(0.33)
      attributeValueGrid.addColumnDefinition(0.33)
      const attributeLabel = new TextBlock(
        `${menuId}__attribute_${attribute}`,
        ATTRIBUTES[attribute as keyof typeof ATTRIBUTES],
      )
      const attributeValue = new TextBlock(
        `${menuId}__attribute_${attribute}_value`,
        '10',
      )
      attributeValue.color = 'white'
      attributeLabel.color = 'white'
      attributeLabel.height = '40px'
      attributePanel.addControl(attributeLabel)
      attributeValueGrid.addControl(attributeValue, 1, 1)
      const attributeMinusButton = Button.CreateSimpleButton(
        `${menuId}__${attribute}_minus`,
        '-',
      )
      const attributePlusButton = Button.CreateSimpleButton(
        `${menuId}__${attribute}_plus`,
        '+',
      )
      attributeMinusButton.onPointerDownObservable.add(() => {
        console.log('minus')
      })
      attributePlusButton.onPointerDownObservable.add(() => {
        console.log('plus')
      })
      attributeMinusButton.color = 'white'
      attributePlusButton.color = 'white'
      attributeValueGrid.addControl(attributeMinusButton, 0, 0)
      attributeValueGrid.addControl(attributePlusButton, 0, 2)
      attributePanel.addControl(attributeValueGrid)
      attributePanel.paddingBottom = '20px'
      attributesPanel.addControl(availablePointsLabel)
      attributesPanel.addControl(attributePanel)
      return attributesPanel
    }
  }
}
