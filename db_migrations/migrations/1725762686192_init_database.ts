import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate'

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createType('class', ['FIGHTER', 'MAGE', 'SCOUT', 'HEALER'])
  pgm.createType('race', ['HUMAN', 'GOBLIN', 'DWARF', 'ORC'])
  pgm.createType('npc_type', [
    'TRAINER',
    'QUEST-GIVER',
    'MERCHANT',
    'BANKER',
    'MONSTER',
  ])
  pgm.createType('attribute', [
    'CONSTITUTION',
    'DEXTERITY',
    'INTELLECT',
    'MIGHT',
    'PERCEPTION',
    'RESOLVE',
  ])
  pgm.createType('stat', [
    'ACCURACY',
    'ACTION_SPEED',
    'AREA_OF_EFFECT',
    'CONCENTRATION',
    'DAMAGE',
    'DEFLECTION',
    'DURATION',
    'FORTITUDE',
    'HEALING',
    'HEALTH',
  ])
  pgm.createType('ability_effect_type', ['DAMAGE', 'HEALING', 'BUFF', 'DEBUFF'])
  pgm.createType('message_type', [
    'system',
    'say',
    'whisper',
    'shout',
    'party',
    'out-of-character',
    'combat',
    'auction',
  ])
  pgm.createType('item_type', [
    'weapon',
    'armor',
    'consumable',
    'quest',
    'ingredient',
    'misc',
  ])
  pgm.createType('item_slot', [
    'primary',
    'secondary',
    'ranged',
    'head',
    'arms',
    'shoulder',
    'back',
    'chest',
    'legs',
    'feet',
    'hands',
    'neck',
    'ring',
  ])
  pgm.createTable('player_character', {
    id: 'id',
    // We'll need the userID at some point
    // user_id: { type: 'integer', notNull: true },
    name: { type: 'varchar(300)', notNull: true },
    surname: { type: 'varchar(300)' },
    class: { type: 'class', notNull: true },
    con: { type: 'integer', notNull: true },
    dex: { type: 'integer', notNull: true },
    int: { type: 'integer', notNull: true },
    mig: { type: 'integer', notNull: true },
    per: { type: 'integer', notNull: true },
    res: { type: 'integer', notNull: true },
    level: { type: 'integer', notNull: true, default: 1 },
    current_health: { type: 'integer', notNull: true },
    zoneId: { type: 'integer' },
    locX: { type: 'integer' },
    locY: { type: 'integer' },
    locZ: { type: 'integer' },
  })
  pgm.createTable('message', {
    id: 'id',
    type: { type: 'message_type', notNull: true },
    characterId: { type: 'integer', notNull: true },
    reciepientId: { type: 'integer' },
    message: { type: 'varchar(1000)', notNull: true },
    createdAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  })
  pgm.createTable('friend', {
    characterId: { type: 'integer', notNull: true },
    friendId: { type: 'integer', notNull: true },
  })
  pgm.createTable('blocked', {
    characterId: { type: 'integer', notNull: true },
    blockedId: { type: 'integer', notNull: true },
  })
  pgm.createTable('ability', {
    id: 'id',
    name: { type: 'varchar(300)', notNull: true },
    description: { type: 'varchar(1000)', notNull: true },
    type: { type: 'varchar(1000)', notNull: true },
    value: { type: 'integer', notNull: true },
  })
  pgm.createTable('ability_effect', {
    id: 'id',
    abilityId: { type: 'integer', notNull: true },
    effect: { type: 'ability_effect_type', notNull: true },
    value: { type: 'integer' },
  })
  pgm.createTable('ability_attribute', {
    id: 'id',
    abilityId: { type: 'integer', notNull: true },
    attribute: { type: 'attribute', notNull: true },
    value: { type: 'integer', notNull: true },
  })
  pgm.createTable('ability_stat', {
    id: 'id',
    abilityId: { type: 'integer', notNull: true },
    stat: { type: 'stat', notNull: true },
    value: { type: 'integer', notNull: true },
  })
  pgm.createTable('inventory', {
    id: 'id',
    characterId: { type: 'integer', notNull: true },
    itemId: { type: 'integer', notNull: true },
    quantity: { type: 'integer' },
  })
  pgm.createTable('item', {
    id: 'id',
    name: { type: 'varchar(1000)', notNull: true },
    type: { type: 'varchar(1000)', notNull: true },
    value: { type: 'integer', notNull: true },
    weight: { type: 'integer', notNull: true },
    slot: { type: 'item_slot', notNull: true },
  })
  pgm.createTable('item_attribute', {
    id: 'id',
    itemId: { type: 'integer', notNull: true },
    attribute: { type: 'attribute', notNull: true },
    value: { type: 'integer', notNull: true },
  })
  pgm.createTable('item_stat', {
    id: 'id',
    itemId: { type: 'integer', notNull: true },
    stat: { type: 'stat', notNull: true },
    value: { type: 'integer', notNull: true },
  })
  pgm.createTable('non_player_character', {
    id: 'id',
    name: { type: 'varchar(300)', notNull: true },
    level: { type: 'integer', notNull: true, default: 1 },
    currentHealth: { type: 'integer', notNull: true },
    type: { type: 'npc_type', notNull: true, default: 'MONSTER' },
    zoneId: { type: 'integer' },
    locX: { type: 'integer' },
    locY: { type: 'integer' },
    locZ: { type: 'integer' },
  })
  pgm.createTable('non_player_character_stat', {
    id: 'id',
    npcId: { type: 'integer', notNull: true },
    stat: { type: 'stat', notNull: true },
    value: { type: 'integer', notNull: true },
  })
  pgm.createTable('non_player_character_ability', {
    id: 'id',
    npcId: { type: 'integer', notNull: true },
    abilityId: { type: 'integer', notNull: true },
  })
  pgm.createTable('zone', {
    id: 'id',
    name: { type: 'varchar(300)', notNull: true },
  })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('ability_attribute')
  pgm.dropTable('ability_effect')
  pgm.dropTable('ability_stat')
  pgm.dropTable('ability')
  pgm.dropTable('blocked')
  pgm.dropTable('friend')
  pgm.dropTable('inventory')
  pgm.dropTable('item_attribute')
  pgm.dropTable('item_stat')
  pgm.dropTable('item')
  pgm.dropTable('message')
  pgm.dropTable('player_character')
  pgm.dropTable('non_player_character_ability')
  pgm.dropTable('non_player_character_stat')
  pgm.dropTable('non_player_character')
  pgm.dropType('ability_effect_type')
  pgm.dropType('npc_type')
  pgm.dropType('attribute')
  pgm.dropType('class')
  pgm.dropType('item_slot')
  pgm.dropType('item_type')
  pgm.dropType('message_type')
  pgm.dropType('race')
  pgm.dropType('stat')
  pgm.dropTable('zone')
}
