CREATE TABLE User (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password PASSWORD(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    logged_in BOOLEAN DEFAULT FALSE
);

CREATE TABLE Messages (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    type: SET('say', 'whisper', 'shout', 'out-of-character', 'combat') NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE character (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    name VARCHAR(50) NOT NULL,
    race SET('human', 'dwarf', 'orc', 'goblin'),
    class SET('warrior', 'mage', 'scout', 'healer'
    level INT DEFAULT 1,
    constitution INT DEFAULT 10,
    dexterity INT DEFAULT 10,
    intellect INT DEFAULT 10,
    might INT DEFAULT 10,
    perception INT DEFAULT 10,
    resolve INT DEFAULT 10
    experience INT DEFAULT 0,
    gold INT DEFAULT 0,
    silver INT DEFAULT 0,
    copper INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  
);

CREATE TABLE Character_Inventory (
  id SERIAL PRIMARY KEY,
  character_id INT REFERENCES characters(id),
  item_id INT REFERENCES items(id),
  quantity INT DEFAULT 1
  location: SET('inventory', 'equipped', 'bank', 'mailbox')
  slot: INT NOT NULL
)

CREATE TABLE Condition (
  id SERIAL PRIMARY KEY,
  character_id INT REFERENCES characters(id),
  effect_id INT REFERENCES effects(id),
  duration INT DEFAULT 0
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE Items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  type SET('weapon', 'armor', 'consumable', 'container', 'ingredient', 'quest', 'misc')[],
  slot SET('head', 'shoulders', 'chest', 'legs', 'feet', 'hands', 'main-hand', 'off-hand', 'ranged', 'trinket', 'ring', 'neck', 'back', 'waist')[],
  class SET('warrior', 'mage', 'scout', 'healer')[],
  level INT DEFAULT 1,
  value INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE Abilities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  type SET('active', 'passive'),
  cooldown INT DEFAULT 0,
)