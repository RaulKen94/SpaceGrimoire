(function () {
  'use strict';

  // ============ CARTE COMBAT (12) ============
  const COMBAT_CARDS = [
    { id: 'colpo_perforante', name: 'Colpo Perforante', slot: 'fucile',   damage: 3 },
    { id: 'raffica',          name: 'Raffica',          slot: 'fucile',   damage: 2 },
    { id: 'precisione',       name: 'Precisione',       slot: 'fucile',   damage: 1, draw: 1 },
    { id: 'colpo_potente',    name: 'Colpo Potente',    slot: 'fucile',   damage: 2 },
    { id: 'colpo_rapido',     name: 'Colpo Rapido',     slot: 'pistola',  damage: 1 },
    { id: 'colpo_doppio',     name: 'Colpo Doppio',     slot: 'pistola',  damage: 2 },
    { id: 'mira_assistita',   name: 'Mira Assistita',   slot: 'casco',    damage: 1, shield: 1 },
    { id: 'parata',           name: 'Parata',           slot: 'tuta',     shield: 1 },
    { id: 'scudo_energetico', name: 'Scudo Energetico', slot: 'tuta',     shield: 2 },
    { id: 'surriscaldamento', name: 'Surriscaldamento', slot: 'trinket_a', draw: 1 },
    { id: 'ricarica',         name: 'Ricarica',         slot: 'trinket_b', shield: 1, draw: 1 },
    { id: 'overclock',        name: 'Overclock',        slot: 'trinket_c', damage: 2 }
  ];

  // ============ CARTE DUNGEON (12) ============
  const DUNGEON_CARDS = [
    { id: 'passo',            name: 'Passo',               slot: 'stivali',  movement: 1 },
    { id: 'corsa',            name: 'Corsa',               slot: 'stivali',  movement: 2 },
    { id: 'sprint',           name: 'Sprint',              slot: 'stivali',  movement: 3 },
    { id: 'passo_furtivo',    name: 'Passo Furtivo',       slot: 'stivali',  movement: 1 },
    { id: 'ricognizione',     name: 'Ricognizione',        slot: 'casco',    movement: 0, draw: 1 },
    { id: 'scanner',          name: 'Scanner',             slot: 'casco',    movement: 1, draw: 1 },
    { id: 'segnalatore',      name: 'Segnalatore',         slot: 'pistola',  movement: 1, draw: 1 },
    { id: 'raffica_copertura',name: 'Raffica di Copertura',slot: 'pistola',  movement: 2 },
    { id: 'marcia',           name: 'Marcia',              slot: 'tuta',     movement: 1 },
    { id: 'condotto',         name: 'Condotto',            slot: 'trinket_a', movement: 1, draw: 1 },
    { id: 'deviazione',       name: 'Deviazione',          slot: 'trinket_b', movement: 2 },
    { id: 'salto',            name: 'Salto',               slot: 'trinket_d', movement: 2 }
  ];

  // ============ NEMICI ============
  const ENEMIES = {
    star1: [
      { name: 'Drone Ostile',    hp: 6, damage: 1 },
      { name: 'Razr Alieno',     hp: 6, damage: 1 }
    ],
    star2: [
      { name: 'Guardiano Corazzato', hp: 8, damage: 2 },
      { name: 'Predatore Sintetico', hp: 8, damage: 2 }
    ]
  };

  // ============ DUNGEON ============
  const DUNGEONS = {
    1: { stars: 1, combats: 2, threshold: 3, credits: 10 },
    2: { stars: 2, combats: 3, threshold: 4, credits: 20 }
  };

  // ============ COSTANTI ============
  const CONSTANTS = {
    STARTING_HEARTS: 2,
    PLAYER_MAX_HP: 10,
    MOVEMENT_DRAW: 3
  };

  window.CONFIG = { COMBAT_CARDS, DUNGEON_CARDS, ENEMIES, DUNGEONS, CONSTANTS };
})();
