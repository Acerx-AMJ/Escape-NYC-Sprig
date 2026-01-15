/*
First time? Check out the tutorial game:
https://sprig.hackclub.com/gallery/getting_started

@title: Escape NYC
@author: 
@tags: []
@addedOn: 2025-00-00
*/

const player = "p"

setLegend(
  [ player, bitmap`
................
................
.......999......
......99.9......
......9..99.....
......0...0.0...
....0003.30.0...
....0.0...000...
....0.05550.....
......0...0.....
.....0....0.....
.....0...0......
......000.......
......0.0.......
.....00.00......
................` ]
)

setSolids([])

let level = 0
const levels = [
  map`
p.
..`
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

afterInput(() => {
  
})
