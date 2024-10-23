import { Server, Socket } from 'socket.io'
import { client } from '../database'
import { ARCHTYPES } from './class/class'
import * as FIGHTER from './class/fighter'
import * as HEALER from './class/healer'
import * as MAGE from './class/mage'
import * as SCOUT from './class/scout'
import {
  ATTRIBUTES,
  ATTRIBUTE_MAX_CREATION_VALUE,
  ATTRIBUTE_MIN_CREATION_VALUE,
} from './attributes'
import { STATS } from './stats'

export type Attributes = {
  [ATTRIBUTES.CON]: number
  [ATTRIBUTES.DEX]: number
  [ATTRIBUTES.INT]: number
  [ATTRIBUTES.MIG]: number
  [ATTRIBUTES.PER]: number
  [ATTRIBUTES.RES]: number
}

const archtypes = {
  [ARCHTYPES.FIGHTER]: FIGHTER,
  [ARCHTYPES.HEALER]: HEALER,
  [ARCHTYPES.MAGE]: MAGE,
  [ARCHTYPES.SCOUT]: SCOUT,
}

const calculateModifier = (attributeValue: number, modifier: number) => {
  return Number((attributeValue - 10) * modifier)
}

const calculateStat = (modifier: number, baseStat?: number) => {
  if (baseStat) {
    return Math.ceil(Number(((1 + modifier) * baseStat).toFixed(2)))
  }
  return Number((1 + modifier).toFixed(2))
}

const attributeWithinBounds = (value: number) => {
  if (value < ATTRIBUTE_MIN_CREATION_VALUE) {
    return ATTRIBUTE_MIN_CREATION_VALUE
  }
  if (value > ATTRIBUTE_MAX_CREATION_VALUE) {
    return ATTRIBUTE_MAX_CREATION_VALUE
  }
  return value
}

const BASE_MODIFIERS = {
  [STATS.ACCURACY]: 0.01,
  [STATS.ACTION_SPEED]: 0.03,
  [STATS.AREA_OF_EFFECT]: 0.06,
  [STATS.CONCENTRATION]: 0.03,
  [STATS.DAMAGE]: 0.03,
  [STATS.DEFLECTION]: 0.01,
  [STATS.DURATION]: 0.05,
  [STATS.FORTITUDE]: 0.02,
  [STATS.HEALING]: 0.03,
  [STATS.HEALTH]: 0.05,
  [STATS.REFLEX]: 0.02,
  [STATS.WILLPOWER]: 0.02,
}

export type CharacterCreationArgs = {
  name: string
  archtype: ARCHTYPES
  attributes: Attributes
}

export type Character = {
  name: string
  attributes: Attributes
  stats: {
    [key in STATS]: number
  }
  currentHealth: number
}

export const create = async ({
  name,
  archtype,
  attributes: inAttributes,
}: CharacterCreationArgs) => {
  const attributes = {
    [ATTRIBUTES.CON]: attributeWithinBounds(inAttributes[ATTRIBUTES.CON]),
    [ATTRIBUTES.DEX]: attributeWithinBounds(inAttributes[ATTRIBUTES.DEX]),
    [ATTRIBUTES.INT]: attributeWithinBounds(inAttributes[ATTRIBUTES.INT]),
    [ATTRIBUTES.MIG]: attributeWithinBounds(inAttributes[ATTRIBUTES.MIG]),
    [ATTRIBUTES.PER]: attributeWithinBounds(inAttributes[ATTRIBUTES.PER]),
    [ATTRIBUTES.RES]: attributeWithinBounds(inAttributes[ATTRIBUTES.RES]),
  }
  const stats = {
    [STATS.ACCURACY]: calculateStat(
      calculateModifier(
        attributes[ATTRIBUTES.PER],
        BASE_MODIFIERS[STATS.ACCURACY],
      ),
      archtypes[archtype].BASE_STATS[STATS.ACCURACY],
    ),
    [STATS.ACTION_SPEED]: calculateStat(
      calculateModifier(
        attributes[ATTRIBUTES.DEX],
        BASE_MODIFIERS[STATS.ACTION_SPEED],
      ),
    ),
    [STATS.AREA_OF_EFFECT]: calculateStat(
      calculateModifier(
        attributes[ATTRIBUTES.INT],
        BASE_MODIFIERS[STATS.AREA_OF_EFFECT],
      ),
    ),
    [STATS.CONCENTRATION]: calculateStat(
      calculateModifier(
        attributes[ATTRIBUTES.RES],
        BASE_MODIFIERS[STATS.CONCENTRATION],
      ),
    ),
    [STATS.DAMAGE]: calculateStat(
      calculateModifier(
        attributes[ATTRIBUTES.MIG],
        BASE_MODIFIERS[STATS.DAMAGE],
      ),
    ),
    [STATS.DEFLECTION]: calculateStat(
      calculateModifier(
        attributes[ATTRIBUTES.RES],
        BASE_MODIFIERS[STATS.DEFLECTION],
      ),
    ),
    [STATS.DURATION]: calculateStat(
      calculateModifier(
        attributes[ATTRIBUTES.INT],
        BASE_MODIFIERS[STATS.DURATION],
      ),
    ),
    [STATS.FORTITUDE]: calculateStat(
      calculateModifier(
        attributes[ATTRIBUTES.CON],
        BASE_MODIFIERS[STATS.FORTITUDE],
      ),
    ),
    [STATS.HEALING]: calculateStat(
      calculateModifier(
        attributes[ATTRIBUTES.MIG],
        BASE_MODIFIERS[STATS.HEALING],
      ),
    ),
    [STATS.HEALTH]: calculateStat(
      calculateModifier(
        attributes[ATTRIBUTES.CON],
        BASE_MODIFIERS[STATS.HEALTH],
      ),
      archtypes[archtype].BASE_STATS[STATS.HEALTH],
    ),
    [STATS.REFLEX]: calculateStat(
      calculateModifier(
        attributes[ATTRIBUTES.PER],
        BASE_MODIFIERS[STATS.REFLEX],
      ) +
        calculateModifier(
          attributes[ATTRIBUTES.DEX],
          BASE_MODIFIERS[STATS.REFLEX],
        ),
    ),
    [STATS.WILLPOWER]: calculateStat(
      calculateModifier(
        attributes[ATTRIBUTES.RES],
        BASE_MODIFIERS[STATS.WILLPOWER],
      ) +
        calculateModifier(
          attributes[ATTRIBUTES.INT],
          BASE_MODIFIERS[STATS.WILLPOWER],
        ),
    ),
  }
  const currentHealth = stats[STATS.HEALTH] // Set current health to max health on creation

  await client.query({
    text: 'INSERT INTO player_character (name, class, con, dex, int, mig, per, res, current_health) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
    values: [
      name,
      archtype,
      attributes[ATTRIBUTES.CON],
      attributes[ATTRIBUTES.DEX],
      attributes[ATTRIBUTES.INT],
      attributes[ATTRIBUTES.MIG],
      attributes[ATTRIBUTES.PER],
      attributes[ATTRIBUTES.RES],
      currentHealth,
    ],
  })

  return {
    name,
    attributes,
    stats,
    currentHealth,
  }
}

export default (_io: Server, socket: Socket) => {
  socket.on(
    'character:create',
    async (args: CharacterCreationArgs, callback) => {
      callback(await create(args))
    },
  )
}
