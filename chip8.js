import { FONTSET, START_ADDRESS, VIDEO_HEIGHT, VIDEO_WIDTH } from "./constants.js"
import CPU from "./cpu.js"
import Keyboard from "./keyboard.js"

// devices
const keyboard = new Keyboard()

class Chip8 {
  /**
   * @type {CPU}
   */
  cpu
  
  constructor() {
    this.cpu = new CPU(keyboard)

    this.scale = 10
    this.canvas = document.getElementById("app")
    this.ctx = this.canvas.getContext("2d")

    this.canvas.width = VIDEO_WIDTH * this.scale
    this.canvas.height = VIDEO_HEIGHT * this.scale
  }

  loadFontsetInMemory() {
    for(let i = 0; i < FONTSET.length; i++) {
      this.cpu.memory[i] = FONTSET[i]
    }
  }

  /**
   * loadRomBufferInMemory(buffer)
   * @param {Uint8Array} buffer 
   */
  loadRomBufferInMemory(buffer) {
    for(let loc = 0; loc < buffer.length; loc++) {
      this.cpu.memory[START_ADDRESS + loc] = buffer[loc]
    }
  }

  /**
   * fetchRom(romName)
   * @param {string} romName
   */
  async fetchRom(romName = "corax.ch8") {
    const response = await fetch(`roms/${romName}`)
    const data = await response.arrayBuffer()
    this.loadRomBufferInMemory(new Uint8Array(data))
  }

  tempRender() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    for (let i = 0; i < VIDEO_WIDTH * VIDEO_HEIGHT; i++) {
      let x = (i % VIDEO_WIDTH) * this.scale
      let y = Math.floor(i / VIDEO_WIDTH) * this.scale
      if (this.cpu.video[i] > 0) {
        this.ctx.fillStyle = "#000"
        this.ctx.fillRect(x, y, this.scale, this.scale)
      }
    }
  }

  init() {
    this.loadFontsetInMemory()
    this.fetchRom()
  }

  run() {
    setInterval(() => {
      // console.log(this.cpu.video)
      this.cpu.cycle()
      this.tempRender()
    }, 1000 / 600)
  }
}

const chip8 = new Chip8()
chip8.init()
chip8.run()
