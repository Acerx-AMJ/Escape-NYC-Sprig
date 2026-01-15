/*
First time? Check out the tutorial game:
https://sprig.hackclub.com/gallery/getting_started

@title: Escape NYC
@author: 
@tags: []
@addedOn: 2025-00-00
*/

const player = "p"
const wall = "w"
const background = "b"

setLegend(
  [ player, bitmap`
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
......0...0.....` ], [
  wall, bitmap`
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
0000000000000000`
  ], [
    background, bitmap`
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
LLLLLLLLLLLLLLLL`
  ]
)

setSolids([])

let level = 0
const levels = [
  map`
pw.
.w.
...`
]

setMap(levels[level])

setPushables({
  [ player ]: []
})

onInput("s", () => {
  getFirst(player).y += 1
})
onInput("w", () => {
  getFirst(player).y -= 1
})
onInput("d", () => {
  getFirst(player).x += 1
})
onInput("a", () => {
  getFirst(player).x -= 1
})

setBackground(background)
setSolids([player, wall])

afterInput(() => {
  
})
