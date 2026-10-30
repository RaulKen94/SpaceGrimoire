(function () {
  'use strict';

  // ---------- UTIL ----------
  function shuffle(array) {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // ---------- STATE ----------
  const state = {
    screen: 'ship',
    hearts: CONFIG.CONSTANTS.STARTING_HEARTS,
    credits: 0,
    log: [],
    dungeon: null,     // { stars, combats, threshold, credits, starLevel }
    combatIndex: 0,

    // Movimento
    mDeck: [],
    mDiscard: [],
    mHand: [],
    mSum: 0,

    // Combattimento
    playerHP: CONFIG.CONSTANTS.PLAYER_MAX_HP,
    playerShield: 0,
    enemy: null,       // { name, hp, maxHp, damage }
    cDeck: [],
    cDiscard: [],
    cHand: [],
    turn: 0,
    playLimit: 0,
    playedThisTurn: 0,
    buffer: 0
  };

  function addLog(msg) {
    state.log.push(msg);
    if (state.log.length > 10) state.log.shift();
  }

  // ---------- FLUSSO RUN ----------
  function startGame() {
    state.hearts = CONFIG.CONSTANTS.STARTING_HEARTS;
    state.credits = 0;
    state.dungeon = null;
    state.combatIndex = 0;
    state.screen = 'ship';
    state.log = [];
    addLog('Benvenuto a bordo. Seleziona un dungeon.');
  }

  function goToShip() {
    state.screen = 'ship';
    state.dungeon = null;
    state.log = [];
  }

  // ---------- DUNGEON ----------
  function enterDungeon(starLevel) {
    const template = CONFIG.DUNGEONS[starLevel];
    if (!template) return;
    state.dungeon = Object.assign({}, template, { starLevel });
    state.combatIndex = 0;
    state.log = [];
    // Mazzo movimento persistente per il dungeon
    state.mDeck = shuffle(CONFIG.DUNGEON_CARDS);
    state.mDiscard = [];
    state.mHand = [];
    state.mSum = 0;
    addLog(`Entri nel dungeon ${starLevel}★: ${template.combats} combattimenti, soglia movimento ${template.threshold}.`);
    startMovement();
  }

  // ---------- MOVIMENTO ----------
  function startMovement() {
    state.screen = 'movement';
    state.mHand = [];
    state.mSum = 0;
    drawMovement(CONFIG.CONSTANTS.MOVEMENT_DRAW);
    addLog(`Settore ${state.combatIndex + 1}/${state.dungeon.combats}: serve ${state.dungeon.threshold} movimento.`);
  }

  function drawMovement(n) {
    for (let i = 0; i < n; i++) {
      if (state.mDeck.length === 0) {
        if (state.mDiscard.length === 0) {
          addLog('Nessuna carta disponibile per il movimento.');
          continue;
        }
        state.mDeck = shuffle(state.mDiscard);
        state.mDiscard = [];
      }
      state.mHand.push(state.mDeck.pop());
    }
  }

  function playMovementCard(index) {
    if (index < 0 || index >= state.mHand.length) return;
    const card = state.mHand[index];
    state.mHand.splice(index, 1);
    state.mDiscard.push(card);
    state.mSum += card.movement || 0;
    if (card.movement === 0) {
      // ricognizione ecc.
    }
    if (card.draw) drawMovement(card.draw);

    // Auto-pesca se la mano è vuota e non hai ancora raggiunto la soglia
    if (state.mHand.length === 0 && state.mSum < state.dungeon.threshold) {
      const before = state.mHand.length;
      drawMovement(CONFIG.CONSTANTS.MOVEMENT_DRAW);
      if (state.mHand.length === before) {
        // Nessuna carta pescabile: mercy rule, si avanza comunque
        addLog('Impossibile proseguire — avanzi per fortuna.');
        advanceToCombat();
      }
    }
  }

  function canAdvanceMovement() {
    return state.dungeon && state.mSum >= state.dungeon.threshold;
  }

  function advanceToCombat() {
    if (!canAdvanceMovement() && !(state.mHand.length === 0 && state.mSum > 0)) {
      // lascia passare solo se mercy rule
      if (!canAdvanceMovement()) return;
    }
    // Scarta la mano residua
    state.mDiscard.push.apply(state.mDiscard, state.mHand);
    state.mHand = [];
    startCombat();
  }

  // ---------- COMBATTIMENTO ----------
  function getTurnPattern(turn) {
    if (turn === 0) return { draw: 3, play: 2 };
    if (turn === 1) return { draw: 1, play: 1 };
    if (turn === 2) return { draw: 3, play: 2 };
    if (turn === 3) return { draw: 2, play: 2 };
    // turn >= 4: alterna p3u2 / p2u2
    if (turn % 2 === 0) return { draw: 3, play: 2 };
    return { draw: 2, play: 2 };
  }

  function startCombat() {
    state.screen = 'combat';
    state.playerHP = CONFIG.CONSTANTS.PLAYER_MAX_HP;
    state.playerShield = 0;
    state.turn = 0;
    state.playedThisTurn = 0;
    state.buffer = 0;

    const pool = state.dungeon.starLevel === 1 ? CONFIG.ENEMIES.star1 : CONFIG.ENEMIES.star2;
    const template = pool[Math.floor(Math.random() * pool.length)];
    state.enemy = { name: template.name, hp: template.hp, maxHp: template.hp, damage: template.damage };

    state.cDeck = shuffle(CONFIG.COMBAT_CARDS);
    state.cDiscard = [];
    state.cHand = [];

    addLog(`Combattimento ${state.combatIndex + 1}/${state.dungeon.combats}: ${state.enemy.name} (${state.enemy.hp} PV, ${state.enemy.damage} dmg).`);
    startTurn();
  }

  function startTurn() {
    if (state.playerHP <= 0 || state.enemy.hp <= 0) return;

    const pattern = getTurnPattern(state.turn);
    state.playLimit = pattern.play + state.buffer;
    state.buffer = 0;
    state.playedThisTurn = 0;
    drawCombat(pattern.draw);

    if (state.playerHP <= 0) { loseCombat(); return; }

    addLog(`Turno ${state.turn + 1}: peschi ${pattern.draw}, puoi giocare fino a ${state.playLimit}.`);
  }

  function drawCombat(n) {
    for (let i = 0; i < n; i++) {
      if (state.cDeck.length === 0) {
        if (state.cDiscard.length === 0) {
          state.playerHP = Math.max(0, state.playerHP - 1);
          addLog('Pesca impossibile! -1 PV.');
          continue;
        }
        state.cDeck = shuffle(state.cDiscard);
        state.cDiscard = [];
      }
      state.cHand.push(state.cDeck.pop());
    }
  }

  function canPlayCard() {
    return state.playedThisTurn < state.playLimit;
  }

  function playCombatCard(index) {
    if (state.screen !== 'combat') return;
    if (index < 0 || index >= state.cHand.length) return;
    if (!canPlayCard()) { addLog('Limite di giocate raggiunto per questo turno.'); return; }

    const card = state.cHand[index];
    state.cHand.splice(index, 1);
    state.cDiscard.push(card);
    state.playedThisTurn++;

    if (card.damage) {
      state.enemy.hp -= card.damage;
      if (state.enemy.hp < 0) state.enemy.hp = 0;
    }
    if (card.shield) state.playerShield += card.shield;
    if (card.draw) drawCombat(card.draw);

    if (state.playerHP <= 0) { loseCombat(); return; }
    if (state.enemy.hp <= 0) { winCombat(); return; }
  }

  function endTurn() {
    if (state.screen !== 'combat') return;

    // Buffer: se giochi meno carte del consentito, accumuli max +1
    const unused = state.playLimit - state.playedThisTurn;
    if (unused > 0) state.buffer = 1;

    // Attacco nemico
    const dmg = state.enemy.damage;
    const absorbed = Math.min(state.playerShield, dmg);
    const hpLoss = dmg - absorbed;
    state.playerHP = Math.max(0, state.playerHP - hpLoss);
    addLog(`${state.enemy.name} attacca: ${hpLoss} danni (scudo assorbe ${absorbed}).`);
    state.playerShield = 0;

    if (state.playerHP <= 0) { loseCombat(); return; }

    state.turn++;
    startTurn();
  }

  function winCombat() {
    addLog(`${state.enemy.name} sconfitto!`);
    state.combatIndex++;
    if (state.combatIndex >= state.dungeon.combats) {
      completeDungeon();
    } else {
      startMovement();
    }
  }

  function loseCombat() {
    state.hearts--;
    addLog(`Combattimento perso! Cuori rimasti: ${state.hearts}.`);
    if (state.hearts <= 0) {
      state.screen = 'gameover';
    } else {
      state.screen = 'ship';
      state.dungeon = null;
    }
  }

  function completeDungeon() {
    state.credits += state.dungeon.credits;
    addLog(`Dungeon completato! +${state.dungeon.credits} crediti.`);
    state.screen = 'victory';
  }

  function leaveVictoryScreen() {
    state.screen = 'ship';
    state.dungeon = null;
    state.log = [];
  }

  // ---------- EXPORT ----------
  window.Game = {
    state: state,
    startGame: startGame,
    goToShip: goToShip,
    enterDungeon: enterDungeon,
    playMovementCard: playMovementCard,
    canAdvanceMovement: canAdvanceMovement,
    advanceToCombat: advanceToCombat,
    playCombatCard: playCombatCard,
    endTurn: endTurn,
    canPlayCard: canPlayCard,
    leaveVictoryScreen: leaveVictoryScreen,
    addLog: addLog
  };
})();
