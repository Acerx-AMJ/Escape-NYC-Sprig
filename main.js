/*
@title: Escape NYC
@author: 
@tags: []
@addedOn: 2025-00-00
*/

/*
  KEYBINDS
  w, a, s, d - move
  i - reset level
*/

/*
  INITIALIZATION
*/

const player     = "p",
      wall       = "w",
      background = "b",
      enemy      = "l",
      coin       = "c";

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
.............`
]

let collectedCoins  = 0,
    maximumCoins    = 0,
    canRetryOnDeath = false,
    playerHasDied   = false;

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

// Draw the same hard-coded text when the player
// looses.
function setupLoseScreen() {
  clearText()
  addText("YOU DIED!", {x: 6, y: 5, color: color`2`})
  addText("PRESS ANY KEY", {x: 4, y: 8, color: color`2`})
  addText("TO RETRY", {x: 6, y: 10, color: color`2`})
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
  setTimeout(() => {canRetryOnDeath = true}, 500)
  
  getFirst(player).remove()
  level = 0
  setMap(levels[level])
  setupLoseScreen()
}

/*
  INPUT HANDLING
*/

onInput("s", () => {
  if (level == 0) return
  getFirst(player).y += 1
})

onInput("w", () => {
  if (level == 0) return
  getFirst(player).y -= 1
})

onInput("d", () => {
  if (level == 0) return
  getFirst(player).x += 1
})

onInput("a", () => {
  if (level == 0) return
  getFirst(player).x -= 1
})

// Reset the level unless in the main menu
onInput("i", () => {
  if (level == 0) return
  setMap(levels[level])
})

onInput("j", () => {
  if (level == 0) return
})

onInput("k", () => {
  if (level == 0) return
})

onInput("l", () => {
  if (level == 0) return
})

afterInput(() => {
  // Switch from main menu to the first level
  // (a key has been pressed)
  if (level == 0) {
    // Small timeout in case they accidentally press
    // a button.
    if (playerHasDied && !canRetryOnDeath) return
    
    playerHasDied = false
    level += 1
    initGameLevel()
    return
  }

  // Handle colleting coins. increment the coin
  // counter and delete the tile
  const { y: y, x: x } = getFirst(player)
  const coinTile = getTile(x, y).find((tile) => tile.type === coin)
  
  if (coinTile) {
    coinTile.remove()
    collectedCoins += 1
    drawGameText()
  }

  // Handle dying. Switch to the 'main menu' and
  // start the game from the beginning. The player
  // stepped on an enemy. What a dumbass.
  const enemyTile = getTile(x, y).find((tile) => tile.type === enemy)

  if (enemyTile) {
    killPlayer()
  }
})

/*
  GAME LOOP
*/

setInterval(() => {
  if (level == 0) return
  const { y: y, x: x } = getFirst(player)

  getAll(enemy).map(function (e) {
    // Handle moving enemies to the player
    let ny = e.y,
        nx = e.x;
    
    if (e.y < y) ny += 1
    if (e.y > y) ny -= 1
    if (e.x < x) nx += 1
    if (e.x > x) nx -= 1

    // Manual collision because the engine is really
    // limiting. I guess that's a good thing?
    if (!getTile(nx, ny).some((tile) => tile.type === wall || tile.type === enemy)) {
      e.x = nx
      e.y = ny
    }
    
    // Enemy stepped on the player
    if (y == ny && x == nx) {
      killPlayer()
    }
  });
}, 1000)
