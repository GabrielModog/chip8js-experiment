import { FPS, START_ADDRESS } from "./constants.js"
import CPU from "./cpu.js"

export default class Chip8 {
  /**
   * @type {CPU}
   */
  cpu

  constructor(keyboard, sound, display) {
    this.cpu = new CPU(keyboard, sound, display)

    this.freeze = false
    this.interval = 0
    this.now = 0
    this.lastTime = 0
    this.elapsed = 0
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
  async fetchRom(romName = "blitz.ch8") {
    const response = await fetch(`public/roms/${romName}`)
    const data = await response.arrayBuffer()
    this.loadRomBufferInMemory(new Uint8Array(data))
  }

  init() {
    this.interval =  1000 / FPS
    this.lastTime = Date.now()

    this.cpu.loadFontsetInMemory()
    this.fetchRom()
  }

  run() {
    this.now = Date.now()
    this.elapsed = this.now - this.lastTime

    if(this.elapsed >= this.interval) {
      this.cpu.cycle()
    }
    requestAnimationFrame(this.run.bind(this))
  }
}
