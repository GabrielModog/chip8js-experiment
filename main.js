import Chip8 from "./src/chip8.js"

import Display from "./src/display.js"
import Keyboard from "./src/keyboard.js"
import Sound from "./src/sound.js"

// devices
const keyboard = new Keyboard()
const sound = new Sound()
const display = new Display()

const chip8 = new Chip8(keyboard, sound, display)

chip8.init()
chip8.run()
