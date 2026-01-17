/*
@title: Escape NYC
@author:
@tags: []
@addedOn: 2025-00-00
*/

// All times here are in milliseconds
const TRANSITION_DURATION = 2000,
      TITLE_INPUT_DELAY   = 500,
      ENEMY_UPDATE_SPEED  = 1000;

const player     = "p",
      wall       = "w",
      background = "b",
      enemy      = "l",
      coin       = "c";

let level = 0
const levels = [
  map`.`,
  map`
.............
.............
..c...l......
.............
.............
.............
.........cc..
....pw...cc..
.....w.......
.............
.............
.............
...........l.
.............
.............`,
  map`
p....c
.wwww.
.cwc..
.cwc..
.cwc..
c.l..c`,
]

let collectedCoins  = 0,
    maximumCoins    = 0,
    canRetryOnDeath = false,
    playerHasDied   = false;

setLegend(
  [ player,     bitmap`
5555555555555555
5555555555555555
5555555555555555
5555555555555555
5555555555555555
5555555555555555
5555555555555555
5555555555555555
5555555555555555
5555555555555555
5555555555555555
5555555555555555
5555555555555555
5555555555555555
5555555555555555
5555555555555555` ],
  [ wall,       bitmap`
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000` ],
  [ background, bitmap`
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL` ],
  [ enemy,      bitmap`
3333333333333333
3333333333333333
3333333333333333
3333333333333333
3333333333333333
3333333333333333
3333333333333333
3333333333333333
3333333333333333
3333333333333333
3333333333333333
3333333333333333
3333333333333333
3333333333333333
3333333333333333
3333333333333333` ],
  [ coin,       bitmap`
......0000......
....00222200....
...0666622220...
..066666666220..
..066600006620..
.0F6606FFF06220.
.0F660266F06220.
.0F660266F06620.
.0F660266F06620.
.0F660266F06620.
.0FF60222606620.
..0F6600006660..
..0FF666666660..
...0FFF666660...
....00FFFF00....
......0000......` ],
)

setMap(levels[level])
setBackground(background)

// Set collisions
setSolids([player, wall])

// Start the game with the main menu which simply
// contains hard-coded text.
function setupMainMenu() {
  clearText()
  addText("ESCAPE NYC", {x: 5, y: 5, color: color`2`})
  addText("PRESS ANY KEY", {x: 4, y: 8, color: color`2`})
  addText("TO START", {x: 6, y: 10, color: color`2`})
}
setupMainMenu()

// Setup the transition between levels
function setupTransition() {
  // Too lazy to rename variables. Basically do not
  // switch levels on key press
  playerHasDied = true
  setMap(levels[0])
  
  setTimeout(() => {
    playerHasDied = false
    level += 1
    initGameLevel()
  }, TRANSITION_DURATION)
  
  clearText()
  addText("LEVEL BEAT!", {x: 5, y: 6, color: color`2`})
  addText("NEXT LEVEL " + (level + 1), {x: 4, y: 9, color: color`2`})
}

// Setup the win screen
function setupWinScreen() {
  playerHasDied = true
  canRetryOnDeath = false
  setTimeout(() => {canRetryOnDeath = true}, TITLE_INPUT_DELAY)
  
  level = 0
  setMap(levels[level])
  
  clearText()
  addText("YOU WON!", {x: 6, y: 5, color: color`2`})
  addText("PRESS ANY KEY", {x: 4, y: 8, color: color`2`})
  addText("TO PLAY AGAIN", {x: 4, y: 10, color: color`2`})
}

// Setup the necessary variables for a new level.
// Call whenever levels get switched
function initGameLevel() {
  setMap(levels[level])
  
  collectedCoins = 0
  maximumCoins = getAll(coin).length;
  drawGameText()
}

// Draw game UI like the coin counter
function drawGameText() {
  clearText();
  addText("COINS: " + collectedCoins + "/" + maximumCoins, {x: 3, y: 0, color: color`2`})
}

// Kill the player and show the death screen.
function killPlayer() {
  playerHasDied = true
  canRetryOnDeath = false
  setTimeout(() => {canRetryOnDeath = true}, TITLE_INPUT_DELAY)
  
  level = 0
  setMap(levels[level])
  
  clearText()
  addText("YOU DIED!", {x: 6, y: 5, color: color`2`})
  addText("PRESS ANY KEY", {x: 4, y: 8, color: color`2`})
  addText("TO RETRY", {x: 6, y: 10, color: color`2`})
}

// Check if an enemy can walk on a tile
function isEmpty(x, y) {
  return !getTile(x, y).some(({type}) => type === wall || type === enemy)
}

// Check if the game is running
function isGame() {
  return level !== 0 && !playerHasDied
}

onInput("s", () => {
  if (isGame()) getFirst(player).y += 1
})

onInput("w", () => {
  if (isGame()) getFirst(player).y -= 1
})

onInput("d", () => {
  if (isGame()) getFirst(player).x += 1
})

onInput("a", () => {
  if (isGame()) getFirst(player).x -= 1
})

afterInput(() => {
  // Switch from main menu to the first level
  // (a key has been pressed)
  if (level === 0) {
    // Small timeout in case they accidentally press
    // a button.
    if (playerHasDied && !canRetryOnDeath) return
    
    playerHasDied = false
    level += 1
    initGameLevel()
    return
  }

  if (!isGame()) return

  // Handle colleting coins. increment the coin
  // counter and delete the tile
  const { y: y, x: x } = getFirst(player)
  const coinTile = getTile(x, y).find(({type}) => type === coin)
  
  if (coinTile) {
    coinTile.remove()
    collectedCoins += 1
    drawGameText()
  }

  // Handle dying. Switch to the 'main menu' and
  // start the game from the beginning. The player
  // stepped on an enemy. What a dumbass.
  if (getTile(x, y).some(({type}) => type === enemy)) {
    killPlayer()
  }

  // Switch levels ONLY if the player didn't die the
  // same frame. I don't think we need a dead player
  // here
  if (collectedCoins === maximumCoins) {
    if (level + 1 === levels.length) {
      setupWinScreen()
    } else {
      setupTransition()
    }
  }
})

setInterval(() => {
  if (!isGame()) return
  const { y: y, x: x } = getFirst(player)

  // Handle moving enemies to the player
  getAll(enemy).map(function (e) {
    // Manual collision because the engine is really
    // limiting. I guess that's a good thing?
    if (e.y < y && isEmpty(e.x, e.y + 1)) e.y += 1
    if (e.y > y && isEmpty(e.x, e.y - 1)) e.y -= 1
    if (e.x < x && isEmpty(e.x + 1, e.y)) e.x += 1
    if (e.x > x && isEmpty(e.x - 1, e.y)) e.x -= 1
    
    // Enemy stepped on the player
    if (y == e.y && x == e.x) {
      killPlayer()
    }
  });
}, ENEMY_UPDATE_SPEED)
