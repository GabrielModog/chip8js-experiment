import Chip8 from "./chip8.js"
import { KEYS } from "./constants.js"

import Display from "./display.js"
import Keyboard from "./keyboard.js"
import Sound from "./sound.js"

let searchParams = new URLSearchParams(document.location.search);

// forms
const scaleElm = document.getElementById("scale")
const romSelectElm = document.getElementById("roms")
const pauseBtn = document.getElementById("pauseBtn")

// devices
const keyboard = new Keyboard(KEYS)
const sound = new Sound()
const display = new Display()

const chip8 = new Chip8(keyboard, sound, display)

let rom = "blitz"

if (searchParams.has("rom")) {
  rom = searchParams.get("rom")
  romSelectElm.value = rom
}

chip8.init(rom)

document.addEventListener("DOMContentLoaded", () => {
  chip8.tick()
})

scaleElm.addEventListener("change", (event) => {
  chip8.onScaleChange(parseInt(event.target.value))
})

romSelectElm.addEventListener("change", (event) => {
  chip8.clear()
  searchParams.set("rom", event.target.value)
  document.location.search = searchParams.toString()
  chip8.init(event.target.value)
})

pauseBtn.addEventListener("change", (event) => {
  chip8.cpu.paused = event.target.checked
  pauseBtn.nextElementSibling.innerText = chip8.cpu.paused  ? "Play" : "Pause"
})
