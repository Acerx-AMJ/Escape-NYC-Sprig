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

setMap(levels[level])
setBackground(background)
setSolids([player, wall, coin])

// Start the game with the main menu which simply
// contains hard-coded text.
function setupMainMenu() {
  addText("ESCAPE NYC", {x: 5, y: 5, color: color`2`})
  addText("PRESS ANY KEY", {x: 4, y: 8, color: color`2`})
  addText("TO START", {x: 6, y: 10, color: color`2`})
}
setupMainMenu()

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
    clearText()
    level += 1
    setMap(levels[level])
    return
  }
})

/*
  GAME LOOP
*/

setInterval(() => {

}, 100)
