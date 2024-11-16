import { START_ADDRESS, VIDEO_HEIGHT, VIDEO_WIDTH } from "./constants.js"
import CPU from "./cpu.js"

export default class Chip8 {
  /**
   * @type {CPU}
   */
  cpu

  constructor(keyboard, sound, display) {
    this.cpu = new CPU(keyboard, sound, display)

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

  init() {
    this.cpu.loadFontsetInMemory()
    this.fetchRom()
  }

  run() {
    // TODO: remove setInterval and use requestAnimationFrame instead
    setInterval(() => {
      this.cpu.cycle()
    }, 50)
  }
}
