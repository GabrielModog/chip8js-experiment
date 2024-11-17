import { START_ADDRESS } from "./constants.js"
import CPU from "./cpu.js"

export default class Chip8 {
  /**
   * @type {CPU}
   */
  cpu

  constructor(keyboard, sound, display) {
    this.cpu = new CPU(keyboard, sound, display)
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
