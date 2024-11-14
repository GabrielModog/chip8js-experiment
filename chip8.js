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

    this.canvas = document.getElementById("app")
    this.canvas.width = VIDEO_WIDTH * 4
    this.canvas.height = VIDEO_HEIGHT * 4
    this.ctx = this.canvas.getContext("2d")
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
    this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.height)
    for (let i = 0; i < VIDEO_WIDTH * VIDEO_HEIGHT; i++) {
      let x = (i % VIDEO_WIDTH) * 4
      let y = Math.floor(i / VIDEO_WIDTH) * 4

      if (this.cpu.video[i]) {
        this.ctx.fillStyle = "#000"
        this.ctx.fillRect(x, y, 4, 4)
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
