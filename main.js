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
      enemy2     = "2",
      enemy3     = "3",
      coin       = "c",
      box        = "x",
      smallBox   = "s";

let level = 0
const levels = [
  map`.`,
  map`
...sxx..........
c..slx..........
c.xwwwwwwwwwwcc.
wxwxxxxx........
...wccccc.......
...wwwwwws3.....
.x.c.p..........
...c..2.w.......
.x.c...ww..c....
...c...w..ss....
.......wsssc....
...www.wslccxxxx
..3..xsxxccc....
...2............
............x2..
............x..c`,
  map`
wwwwwwwwwwwwwwwww
c.w.........cc...
..ww.sc.....ccxxc
...cw.s........xx
c...wcx.xlx.....w
3...ww..xxx..3..w
................w
......xsxx......w
............cc..w
..2.cc.pw...cc..w
....cc..w.......w
....xsxsx..s....w
..w........s.....
..w...3....s.ss.c
c.w.s...s....sl..
..w.cwww.....ss.c
wwwwwwwwwwwwwwwww`,
  map`
wwwwwwwwwwwwwwwwwww
w...cw....x.ss....w
wc.s.w....xcxl....w
w.ls.s..x...ss.c..w
wsss.s..x.........w
w.3..wwwwssxxxxssxw
w....w..w..x...3..w
xxssxw.pw.cxc.....w
w.......wwwwwwwwssw
w......xcwc.......w
w.......cwc...2...w
w..xx...cwc.......w
w.sxx2scxl..cs....w
wsl.swssxxssss.3..w
w....w............w
w....w.......s....w
w....w.....cxcxc..w
w..3.w..2..s.c.s..w
w....s.....cxcxc..w
wc...s......cs....w
wwwwwwwwwwwwwwwwwww`,
]

let collectedCoins  = 0,
    maximumCoins    = 0,
    canRetryOnDeath = false,
    playerHasDied   = false;

setLegend(
  [ player,     bitmap`
5555555555555555
5555555555555555
5577777777777755
5577777777777755
5577777777777755
5577777777777755
5577777777777755
5577777777777755
5577777777777755
5577777777777755
5577777777777755
5577777777777755
5577777777777755
5577777777777755
5555555555555555
5555555555555555` ],
  [ wall,       bitmap`
0000000000000000
0999999909999999
0999999909999999
0999999909999999
0000000000000000
9990999999909999
9990999999909999
9990999999909999
0000000000000000
0999999909999999
0999999909999999
0999999909999999
0000000000000000
9990999999909999
9990999999909999
9990999999909999` ],
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
3388888888888833
3388888888888833
3388888888888833
3388888888888833
3388888888888833
3388888888888833
3388888888888833
3388888888888833
3388888888888833
3388888888888833
3388888888888833
3388888888888833
3333333333333333
3333333333333333` ],
  [ enemy2,     bitmap`
.....333333.....
.....333333.....
.....338833.....
.....338833.....
.....338833.....
.....338833.....
.....338833.....
.....338833.....
.....338833.....
.....338833.....
.....338833.....
.....338833.....
.....338833.....
.....338833.....
.....333333.....
.....333333.....` ],
  [ enemy3,     bitmap`
................
................
................
................
................
3333333333333333
3333333333333333
3388888888888833
3388888888888833
3333333333333333
3333333333333333
................
................
................
................
................` ],
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
  [ box,        bitmap`
CCCCCCCCCCCCCCCC
CCCCCCCCCCCCCCCC
CCCC99999999CCCC
CCCCC999999CCCCC
CC9CCC9999CCC9CC
CC99CCC99CCC99CC
CC999CCCCCC999CC
CC9999CCCC9999CC
CC9999CCCC9999CC
CC999CCCCCC999CC
CC99CCC99CCC99CC
CC9CCC9999CCC9CC
CCCCC999999CCCCC
CCCC99999999CCCC
CCCCCCCCCCCCCCCC
CCCCCCCCCCCCCCCC` ],
  [ smallBox,   bitmap`
CCCCCCCCCCCCCCCC
CCCCCCCCCCCCCCCC
CC999999999999CC
CC999999999999CC
CC999999999999CC
CC999999999999CC
CC999999999999CC
CC999999999999CC
CC999999999999CC
CC999999999999CC
CC999999999999CC
CC999999999999CC
CC999999999999CC
CC999999999999CC
CCCCCCCCCCCCCCCC
CCCCCCCCCCCCCCCC` ],
)

setMap(levels[level])
setBackground(background)

// Set collisions
setSolids([player, enemy, enemy2, enemy3, wall,
           box, smallBox])

setPushables({
  [player]: [box, smallBox],
  [enemy]: [smallBox],
  [enemy2]: [smallBox],
  [enemy3]: [smallBox],
})

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
  return !getTile(x, y).some(({type}) => type === wall || type === enemy || type === box)
}

function isEnemy(x, y) {
  return getTile(x, y).some(({type}) => type === enemy || type === enemy2 || type === enemy3)
}

// Check if the game is running
function isGame() {
  return level !== 0 && !playerHasDied
}

// Gotta do what you gotta do. Collision API is too
// primitive, so we have to check enemy collision
// manually.
onInput("s", () => {
  if (!isGame()) return
  const { y: y, x: x} = getFirst(player)
  if (isEnemy(x, y + 1)) {
    killPlayer()
    return
  }
  getFirst(player).y += 1
})

onInput("w", () => {
  if (!isGame()) return
  const { y: y, x: x} = getFirst(player)
  if (isEnemy(x, y - 1)) {
    killPlayer()
    return
  }
  getFirst(player).y -= 1
})

onInput("d", () => {
  if (!isGame()) return
  const { y: y, x: x} = getFirst(player)
  if (isEnemy(x + 1, y)) {
    killPlayer()
    return
  }
  getFirst(player).x += 1
})

onInput("a", () => {
  if (!isGame()) return
  const { y: y, x: x} = getFirst(player)
  if (isEnemy(x - 1, y)) {
    killPlayer()
    return
  }
  getFirst(player).x -= 1
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
    let ny = e.y,
        nx = e.x;

    if (e.y < y) ny += 1
    if (e.y > y) ny -= 1
    if (e.x < x) nx += 1
    if (e.x > x) nx -= 1

    if (y == ny && x == nx) {
      killPlayer()
    }
    e.y = ny
    e.x = nx
  })

  // Handle vertical enemies
  getAll(enemy2).map(function (e) {
    let ny = e.y
    if (e.y < y) ny += 1
    if (e.y > y) ny -= 1

    if (y == ny && x == e.x) {
      killPlayer()
    }
    e.y = ny
  })

  // Handle horizontal enemies
  getAll(enemy3).map(function (e) {
    let nx = e.x
    if (e.x < x) nx += 1
    if (e.x > x) nx -= 1

    if (y == e.y && x == nx) {
      killPlayer()
    }
    e.x = nx
  })
}, ENEMY_UPDATE_SPEED)
