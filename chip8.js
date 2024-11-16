import { START_ADDRESS, VIDEO_HEIGHT, VIDEO_WIDTH } from "./constants.js"
import CPU from "./cpu.js"
import Keyboard from "./keyboard.js"
import Sound from "./sound.js"

// devices
const keyboard = new Keyboard()
const sound = new Sound()

class Chip8 {
  /**
   * @type {CPU}
   */
  cpu

  constructor() {
    this.cpu = new CPU(keyboard, sound)

    this.scale = 10
    this.canvas = document.getElementById("app")
    this.ctx = this.canvas.getContext("2d")

    this.canvas.width = VIDEO_WIDTH * this.scale
    this.canvas.height = VIDEO_HEIGHT * this.scale
  }

  /**
   * loadRomBufferInMemory(buffer)
   * @param {Uint8Array} buffer 
   */
  loadRomBufferInMemory(buffer) {
    for (let loc = 0; loc < buffer.length; loc++) {
      this.cpu.memory[START_ADDRESS + loc] = buffer[loc]
    }
  }

  /**
   * fetchRom(romName)
   * @param {string} romName
   */
  async fetchRom(romName = "chip8picture.ch8") {
    const response = await fetch(`roms/${romName}`)
    const data = await response.arrayBuffer()
    this.loadRomBufferInMemory(new Uint8Array(data))
  }

  tempRender() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    for (let x = 0; x < VIDEO_WIDTH; x++) {
      for (let y = 0; y < VIDEO_HEIGHT; y++) {
        const pixel = this.cpu.video[x + y * VIDEO_WIDTH]
        if (pixel) {
          this.ctx.fillStyle = "#000"
          this.ctx.fillRect(
            x * this.scale,
            y * this.scale,
            this.scale,
            this.scale
          )
        }
      }
    }
  }

  init() {
    this.cpu.loadFontsetInMemory()
    this.fetchRom()
  }

  run() {
    // TODO: remove setInterval and use requestAnimationFrame instead
    setInterval(() => {
      this.cpu.cycle()
      this.tempRender()
    }, 50)
  }
}

const chip8 = new Chip8()
chip8.init()
chip8.run()
