(function() {
    window.SpaceGrimoire = window.SpaceGrimoire || {};
    var NS = window.SpaceGrimoire;

    function shuffle(array) {
        var arr = array.slice();
        for (var i = arr.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
        return arr;
    }

    var state = {
        screen: 'ship',
        hearts: NS.CONSTANTS.STARTING_HEARTS,
        credits: 0,
        backpack: [],
        backpackCapacity: NS.CONSTANTS.BACKPACK_SLOTS_DEFAULT || 2,
        dungeon: null,
        combatIndex: 0,

        mDeck: [],
        mDiscard: [],
        mHand: [],
        mSum: 0,

        playerHP: NS.CONSTANTS.PLAYER_MAX_HP,
        playerShield: 0,
        enemy: null,
        cDeck: [],
        cDiscard: [],
        cHand: [],
        turn: 0,
        playLimit: 0,
        playedThisTurn: 0,
        buffer: 0
    };

    function startGame() {
        state.hearts = NS.CONSTANTS.STARTING_HEARTS;
        state.credits = 0;
        state.backpack = [];
        state.backpackCapacity = NS.CONSTANTS.BACKPACK_SLOTS_DEFAULT || 2;
        state.dungeon = null;
        state.combatIndex = 0;
        state.screen = 'ship';

        if (NS.UI && NS.UI.render) NS.UI.render();
    }

    function openEquipment() {
        state.screen = 'equipment';
    }

    function closeEquipment() {
        state.screen = 'ship';
    }

    function openShop() {
        state.screen = 'shop';
    }

    function closeShop() {
        state.screen = 'ship';
    }

    function hasItem(itemId) {
        return state.backpack.some(function(it) { return it.id === itemId; });
    }

    function canBuyHeart() {
        var maxH = NS.CONSTANTS.MAX_HEARTS || NS.CONSTANTS.STARTING_HEARTS;
        return state.credits >= NS.CONSTANTS.HEART_HEAL_COST && state.hearts < maxH;
    }

    function buyHeart() {
        if (!canBuyHeart()) return false;
        state.credits -= NS.CONSTANTS.HEART_HEAL_COST;
        state.hearts++;
        return true;
    }

    function canBuyItem(item) {
        if (!item) return false;
        if (state.credits < item.cost) return false;
        if (state.backpack.length >= state.backpackCapacity) return false;
        if (hasItem(item.id)) return false;
        return true;
    }

    function buyItem(itemId) {
        var item = (NS.PASSIVE_ITEMS || []).find(function(it) { return it.id === itemId; });
        if (!item || !canBuyItem(item)) return false;
        state.credits -= item.cost;
        state.backpack.push(item);
        return true;
    }

    function enterDungeon(starLevel) {
        var template = NS.DUNGEONS[starLevel];
        if (!template) return;
        
        state.dungeon = Object.assign({}, template, { starLevel: starLevel });
        state.combatIndex = 0;
        
        // Genera i mazzi di default
        var decks = NS.Items.getDefaultDecks();
        
        // Inizializza e resetta il mazzo Dungeon
        state.mDeck = shuffle(decks.dungeon);
        state.mDiscard = [];
        state.mHand = [];
        state.mSum = 0;
        
        // Inizializza e resetta il mazzo Combat
        state.cDeck = shuffle(decks.combat);
        state.cDiscard = [];
        state.cHand = [];
        
        startMovement();
    }

    function startMovement() {
        state.screen = 'movement';
        state.mHand = [];
        // Effetto passivo Micro-Propulsore: parte con +1 movimento bonus
        state.mSum = hasItem('micro_propulsore') ? 1 : 0;
        drawMovement(NS.CONSTANTS.MOVEMENT_DRAW);
    }

    function drawMovement(n) {
        for (var i = 0; i < n; i++) {
            if (state.mDeck.length === 0) {
                if (state.mDiscard.length === 0) continue;
                state.mDeck = shuffle(state.mDiscard);
                state.mDiscard = [];
            }
            state.mHand.push(state.mDeck.pop());
        }
    }

    function playMovementCard(index) {
        if (index < 0 || index >= state.mHand.length) return;
        
        var card = state.mHand[index];
        state.mHand.splice(index, 1);
        state.mDiscard.push(card);
        state.mSum += card.movement || 0;
        
        if (card.draw) drawMovement(card.draw);

        if (state.mHand.length === 0 && state.mSum < state.dungeon.threshold) {
            drawMovement(NS.CONSTANTS.MOVEMENT_DRAW);
        }
    }

    function canAdvanceMovement() {
        return state.dungeon && state.mSum >= state.dungeon.threshold;
    }

    function advanceToCombat() {
        if (!canAdvanceMovement()) return;
        
        for (var i = 0; i < state.mHand.length; i++) {
            state.mDiscard.push(state.mHand[i]);
        }
        state.mHand = [];
        startCombat();
    }

    function getTurnPattern(turn) {
        if (turn === 0) return { draw: 3, play: 2 };
        if (turn === 1) return { draw: 1, play: 1 };
        if (turn === 2) return { draw: 3, play: 2 };
        if (turn === 3) return { draw: 2, play: 2 };
        if (turn % 2 === 0) return { draw: 3, play: 2 };
        return { draw: 2, play: 2 };
    }

    function startCombat() {
        state.screen = 'combat';
        state.playerHP = NS.CONSTANTS.PLAYER_MAX_HP;
        state.playerShield = 0;
        state.turn = 0;
        state.playedThisTurn = 0;
        state.buffer = 0;

        var pool = state.dungeon.starLevel === 1 ? NS.ENEMIES.star1 : NS.ENEMIES.star2;
        var template = pool[Math.floor(Math.random() * pool.length)];
        state.enemy = { 
            id: template.id,
            name: template.name, 
            hp: template.hp, 
            maxHp: template.hp, 
            damage: template.damage, 
            icon: template.icon || 'ri-aliens-fill',
            type: template.type || 'Entità Ostile'
        };

        // Usa le carte combat di default per il nuovo combattimento
        var decks = NS.Items.getDefaultDecks();
        state.cDeck = shuffle(decks.combat);
        state.cDiscard = [];
        state.cHand = [];

        startTurn();
    }

    function startTurn() {
        if (state.playerHP <= 0 || state.enemy.hp <= 0) return;

        var pattern = getTurnPattern(state.turn);
        state.playLimit = pattern.play + state.buffer;
        state.buffer = 0;
        state.playedThisTurn = 0;

        // Effetto passivo Deflettore Ausiliario: +1 scudo ad ogni turno
        if (hasItem('deflettore_ausiliario')) {
            state.playerShield += 1;
        }

        drawCombat(pattern.draw);

        // Effetto passivo Batteria di Riserva: +1 carta extra pescata al primo turno (turn 0)
        if (state.turn === 0 && hasItem('batteria_riserva')) {
            drawCombat(1);
        }

        if (state.playerHP <= 0) loseCombat();
    }

    function drawCombat(n) {
        for (var i = 0; i < n; i++) {
            if (state.cDeck.length === 0) {
                if (state.cDiscard.length === 0) {
                    state.playerHP = Math.max(0, state.playerHP - 1);
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
        if (state.screen !== 'combat' || index < 0 || index >= state.cHand.length) return;
        if (!canPlayCard()) return;

        var card = state.cHand[index];
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

        var unused = state.playLimit - state.playedThisTurn;
        if (unused > 0) state.buffer = 1;

        var dmg = state.enemy.damage;
        var absorbed = Math.min(state.playerShield, dmg);
        var hpLoss = dmg - absorbed;
        
        state.playerHP = Math.max(0, state.playerHP - hpLoss);
        state.playerShield = 0;

        if (state.playerHP <= 0) { loseCombat(); return; }

        state.turn++;
        startTurn();
    }

    function winCombat() {
        state.combatIndex++;
        if (state.combatIndex >= state.dungeon.combats) {
            completeDungeon();
        } else {
            startMovement();
        }
    }

    function loseCombat() {
        state.hearts--;
        if (state.hearts <= 0) {
            state.screen = 'gameover';
        } else {
            state.screen = 'ship';
            state.dungeon = null;
        }
    }

    function completeDungeon() {
        // Effetto passivo Scanner Minerario: +5 crediti bonus
        var bonus = hasItem('scanner_minerario') ? 5 : 0;
        state.credits += (state.dungeon.credits + bonus);
        state.screen = 'victory';
    }

    function leaveVictoryScreen() {
        state.screen = 'ship';
        state.dungeon = null;
    }

    NS.Game = {
        state: state,
        startGame: startGame,
        openEquipment: openEquipment,
        closeEquipment: closeEquipment,
        openShop: openShop,
        closeShop: closeShop,
        hasItem: hasItem,
        canBuyHeart: canBuyHeart,
        buyHeart: buyHeart,
        canBuyItem: canBuyItem,
        buyItem: buyItem,
        enterDungeon: enterDungeon,
        playMovementCard: playMovementCard,
        canAdvanceMovement: canAdvanceMovement,
        advanceToCombat: advanceToCombat,
        playCombatCard: playCombatCard,
        endTurn: endTurn,
        canPlayCard: canPlayCard,
        leaveVictoryScreen: leaveVictoryScreen
    };
})();