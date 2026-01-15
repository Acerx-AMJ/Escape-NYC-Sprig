/*
First time? Check out the tutorial game:
https://sprig.hackclub.com/gallery/getting_started

@title: Escape NYC
@author: 
@tags: []
@addedOn: 2025-00-00
*/

/*
  INITIALIZATION
*/

const player = "p"
const wall = "w"
const background = "b"
const enemy = "l"

setLegend(
  [ player,     bitmap`
.....0000000....
.....0000000....
....000000000...
....C9999999C...
....C9929299C...
....C0999990C...
......00000.....
......50005.....
.....5555555....
....5.55555.5...
....5.55555.5...
....9.55555.9...
......00000.....
......00000.....
......0...0.....
......0...0.....` ],
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
................
................
....0000000.....
....9900000.....
....9999000.....
....9929290.....
....9999999.....
....9900099.....
....9990999.....
......0L0.......
.....00000......
....0.000.3.....
....0.000.0.....
....9.000.9.....
......0.0.......
......0.0.......` ],
)

let level = 0
let switchToGame = false

const levels = [
  map`.`,
  map`
.............
.............
......l......
.............
.............
.............
.............
....pw.......
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
setSolids([player, wall])

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

afterInput(() => {
  // Switch from main menu to the first level
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
  if (level === 0) {
    
  }
}, 100)
