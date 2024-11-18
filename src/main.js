import Chip8 from "./chip8.js"
import { KEYS } from "./constants.js"

import Display from "./display.js"
import Keyboard from "./keyboard.js"
import Sound from "./sound.js"

// devices
const keyboard = new Keyboard(KEYS)
const sound = new Sound()
const display = new Display()

const chip8 = new Chip8(keyboard, sound, display)

chip8.init()
chip8.run()
