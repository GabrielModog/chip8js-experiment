import Chip8 from "./chip8.js"
import { KEYS } from "./constants.js"

import Display from "./display.js"
import Keyboard from "./keyboard.js"
import Sound from "./sound.js"

// forms
const scaleElm = document.getElementById("scale")
const romSelectElm = document.getElementById("roms")
const pauseElm = document.getElementById("pauseElm")

// devices
const keyboard = new Keyboard(KEYS)
const sound = new Sound()
const display = new Display()

const chip8 = new Chip8(keyboard, sound, display)

chip8.init("blitz")

document.addEventListener("DOMContentLoaded", () => {
  chip8.tick()
})

scaleElm.addEventListener("change", (event) => {
  chip8.onScaleChange(parseInt(event.target.value))
})

romSelectElm.addEventListener("change", (event) => {
  chip8.clear()
  chip8.init(event.target.value)
})

pauseElm.addEventListener("change", (event) => {
  chip8.cpu.paused = event.target.checked
  pauseElmLabel.innerText = chip8.cpu.paused ? "PLAY" : "PAUSE"
})