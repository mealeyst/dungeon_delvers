import { Button, Control, Grid, StackPanel, TextBlock } from '@babylonjs/gui'
import { ATTRIBUTES, Attributes } from '../../core/attribute'
import { Race } from '../../../content/race'

export class AttributeSelect {
  private _attributes: Attributes
  private _attributeValues: Record<ATTRIBUTES, TextBlock>
  private _availablePoints: number = 15
  private _availablePointsLabel: TextBlock
  constructor() {
    this._attributeValues = {
      [ATTRIBUTES.CON]: new TextBlock(''),
      [ATTRIBUTES.DEX]: new TextBlock(''),
      [ATTRIBUTES.INT]: new TextBlock(''),
      [ATTRIBUTES.MIG]: new TextBlock(''),
      [ATTRIBUTES.PER]: new TextBlock(''),
      [ATTRIBUTES.RES]: new TextBlock(''),
    }
  }
  renderAttributePanel(menuId: string, attributes: Attributes) {
    this._attributes = attributes
    const attributesPanel = new StackPanel(`${menuId}__attributes_stack`)
    attributesPanel.height = '100%'
    attributesPanel.width = '200px'
    attributesPanel.background = 'black'
    attributesPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT
    this._availablePointsLabel = new TextBlock(
      `${menuId}__available_points_label`,
      `Available Points: ${this._availablePoints}`,
    )
    this._availablePointsLabel.color = 'white'
    this._availablePointsLabel.height = '40px'
    attributesPanel.addControl(this._availablePointsLabel)
    Object.values(ATTRIBUTES).forEach(attribute => {
      const attributeGrid = new Grid(`${menuId}__attribute_${attribute}`)
      attributeGrid.height = '100px'
      attributeGrid.addRowDefinition(0.5)
      attributeGrid.addRowDefinition(0.5)
      const attributeValueGrid = new Grid(
        `${menuId}__attribute_${attribute}_values_grid`,
      )
      attributeValueGrid.width = '160px'
      attributeValueGrid.height = '40px'
      attributeValueGrid.addColumnDefinition(0.33)
      attributeValueGrid.addColumnDefinition(0.33)
      attributeValueGrid.addColumnDefinition(0.33)
      const attributeLabel = new TextBlock(
        `${menuId}__attribute_${attribute}`,
        attribute,
      )
      this._attributeValues[attribute as ATTRIBUTES] = new TextBlock(
        `${menuId}__attribute_${attribute}_value`,
        this._attributes[attribute as ATTRIBUTES].value.toString(),
      )
      this._attributeValues[attribute as ATTRIBUTES].color = 'white'
      attributeLabel.color = 'white'
      attributeLabel.height = '40px'
      attributeGrid.addControl(attributeLabel, 0, 0)
      attributeValueGrid.addControl(
        this._attributeValues[attribute as ATTRIBUTES],
        1,
        1,
      )
      const attributeMinusButton = Button.CreateSimpleButton(
        `${menuId}__${attribute}_minus`,
        '-',
      )
      const attributePlusButton = Button.CreateSimpleButton(
        `${menuId}__${attribute}_plus`,
        '+',
      )
      attributeMinusButton.onPointerDownObservable.add(clickEvent => {
        if (this._availablePoints < 15) {
          this.updateAtribute(
            this._availablePoints + 1,
            attribute,
            this._attributes[attribute].value - 1,
          )
        }
      })
      attributePlusButton.onPointerDownObservable.add(clickEvent => {
        if (this._availablePoints > 0) {
          this.updateAtribute(
            this._availablePoints - 1,
            attribute,
            this._attributes[attribute].value + 1,
          )
        }
      })
      attributeMinusButton.color = 'white'
      attributePlusButton.color = 'white'
      attributeValueGrid.addControl(attributeMinusButton, 0, 0)
      attributeValueGrid.addControl(attributePlusButton, 0, 2)
      attributeGrid.addControl(attributeValueGrid, 1, 0)
      attributeGrid.paddingBottom = '20px'
      attributesPanel.addControl(attributeGrid)
    })
    return attributesPanel
  }

  updateAtribute(
    availablePoints: number,
    attribute: ATTRIBUTES,
    value: number,
  ) {
    this._availablePoints = availablePoints
    this._attributes[attribute].value = value
    this._attributeValues[attribute].text = value.toString()
    this._availablePointsLabel.text = `Available Points: ${this._availablePoints}`
  }

  updateAttributes(attributes: Attributes) {
    this._attributes = attributes
    this._availablePoints = 15
    this._availablePointsLabel.text = `Available Points: ${this._availablePoints}`
    Object.values(ATTRIBUTES).forEach(attribute => {
      this._attributeValues[attribute].text =
        this._attributes[attribute as ATTRIBUTES].value.toString()
    })
  }
}
