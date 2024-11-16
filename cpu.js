import { VIDEO_WIDTH, VIDEO_HEIGHT, START_ADDRESS, FONTSET } from "./constants.js"
import Keyboard from "./keyboard.js"
import Sound from "./sound.js"

export default class CPU {
  /**
   * Handle Devices
   * @param {Keyboard} keyboard
   * @param {Sound} sound
   */
  constructor(keyboard, sound) {
    this.memory = new Uint8Array(4096)
    this.registers = new Uint8Array(16)
    this.stack = new Array()
    this.pc = START_ADDRESS
    this.video = new Array(VIDEO_WIDTH * VIDEO_HEIGHT)
    this.sp = 0
    this.i = 0
    this.delayTimer = 0
    this.soundTimer = 0
    this.paused = false
    this.speed = 10

    // devices
    this.keyboard = keyboard
    this.sound = sound
  }

  cycle() {
    if(!this.paused) {
      let opcode = (this.memory[this.pc] << 8 | this.memory[this.pc + 1])
      this.instructions(opcode)
      if(this.delayTimer > 0) {
        this.delayTimer -= 1
      }
      if(this.soundTimer > 0) {
        this.soundTimer -= 1
      }
    }

    if(this.soundTimer > 0) {
      this.sound.play()
    } else {
      this.sound.stop()
    }
  }

  /**
   * increment_pc()
   * - an util method to increament Program Counter
   */
  increment_pc() {
    this.pc += 2
  }

  rand() {
    return Math.floor(Math.random() * 0xff)
  }

  /**
   * clearDisplay()
   * - clear video display
   */
  clearDisplay(){
    this.video = new Array(VIDEO_WIDTH * VIDEO_HEIGHT)
  }

  /**
   * instructions(opcode)
   * @param {number} opcode - hexadecimal number
   */
  instructions(opcode) {
    this.increment_pc()

    let x = (opcode & 0x0f00) >> 8
    let y = (opcode & 0x00f0) >> 4

    switch(opcode & 0xf000) {
      case 0x0: {
        switch(opcode) {
          case 0x00e0: {
            this.clearDisplay()
          } break
          case 0x00ee: {
            this.pc = this.stack.pop()
          } break
        }
      } break
      case 0x1000: {
        const nnn = (opcode & 0xfff)
        this.pc = nnn
      } break
      case 0x2000: {
        const nnn = (opcode & 0xfff)
        this.stack.push(this.pc)
        this.pc = nnn
      } break
      case 0x3000: {
        const bytekk = (opcode & 0xff)
        if(this.registers[x] === bytekk) {
          this.increment_pc()
        }
      } break
      case 0x4000: {
        const bytekk = (opcode & 0xff)
        if(this.registers[x] !== bytekk) {
          this.increment_pc()
        }
      } break
      case 0x5000: {
        if(this.registers[x] === this.registers[y]) {
          this.increment_pc()
        }
      } break
      case 0x6000: {
        const bytekk = (opcode & 0xff)
        this.registers[x] = bytekk
      } break
      case 0x7000: {
        const bytekk = (opcode & 0xff)
        this.registers[x] += bytekk
      } break
      case 0x8000: {
        const mode = (opcode & 0xf)
        switch(mode) {
          case 0x0: {
            this.registers[x] = this.registers[y]
          } break
          case 0x1: {
            this.registers[x] |= this.registers[y]
          } break
          case 0x2: {
            this.registers[x] &= this.registers[y]
          } break
          case 0x3: {
            this.registers[x] ^= this.registers[y]
          } break
          case 0x4: {
            this.registers[0xf] = 0
            const sum = this.registers[x] + this.registers[y]
            if(sum > 0xff) {
              this.registers[0xf] = 1
            }
            this.registers[x] = sum
          } break
          case 0x5: {
            this.registers[0xf] = 0
            if(this.registers[x] > this.registers[y]){
              this.registers[0xf] = 1
            }
            this.registers[x] -= this.registers[y]
          } break
          case 0x6: {
            this.registers[0xf] = this.registers[x] & 0x1
            this.registers[x] >>= 1
          } break
          case 0x7: {
            this.registers[0xf] = 0
            if(this.registers[y] > this.registers[x]) {
              this.registers[0xf] = 1
            }
            this.registers[x] = this.registers[y] - this.registers[x]
          } break
          case 0xe: {
            this.registers[0xf] = (this.registers[x] & 0x80) >> 7
            this.registers[x] <<= 1
          } break
        }
      } break
      case 0x9000: {
        if(this.registers[x] !== this.registers[y]) {
          this.increment_pc()
        }
      } break
      case 0xa000: {
        const nnn = (opcode & 0xfff)
        this.i = nnn
      } break
      case 0xb000: {
        const nnn = (opcode & 0xfff)
        this.pc = this.registers[0] + nnn
      } break
      case 0xc000: {
        const bytekk = (opcode & 0xff)
        const rand = this.rand()
        this.registers[x] = rand & bytekk
      } break
      case 0xd000: {
        this.registers[0xf] = 0 // set VF = collision
        
        const msb = 0x80 // most significant byte
        const width = 8 // constant width for chip-8 sprites
        const xReg = this.registers[x]
        const yReg = this.registers[y]
        let height = opcode & 0xf // n-byte

        for(let row = 0; row < height; row++) {
          let pixel = this.memory[this.i + row]
          for(let col = 0; col < width; col++) {
            if((pixel & (msb >> col)) !== 0) {
              const xx = (xReg + col) % VIDEO_WIDTH
              const yy = (yReg + row) % VIDEO_HEIGHT
              const idx = xx + (yy * VIDEO_WIDTH)
              // let idx = ((xReg + col) + ((yReg + row) * VIDEO_WIDTH))
              if(this.video[idx] === 1) {
                this.registers[0xf] = 1
              }
              this.video[idx] ^= 1
            }
          }
        }
      } break
      case 0xe000: {
        const mode = (opcode & 0xff)
        switch(mode) {
          case 0x9e: {
            if(this.keyboard.isKeyPressed(this.v[x])) {
              this.increment_pc()
            }
          } break
          case 0xa1: {
            if(!this.keyboard.isKeyPressed(this.v[x])) {
              this.increment_pc()
            }
          } break
        }
      } break
      case 0xf000: {
        const mode = (opcode & 0xff)
        switch(mode) {
          case 0x07: {
            this.registers[x] = this.delayTimer
          } break
          case 0x0a: {
            this.paused = true
          } break
          case 0x15: {
            this.delayTimer = this.registers[x]
          } break
          case 0x18: {
            this.soundTimer = this.registers[x]
          } break
          case 0x1e: {
            this.i += this.registers[x]
          } break
          case 0x29: {
            this.i = this.registers[x] * 5
          } break
          case 0x33: {
            let value = this.registers[x]
            this.memory[this.i] = Math.floor(value / 100)
            this.memory[this.i + 1] = Math.floor((value % 100) / 10)
            this.memory[this.i + 2] = Math.floor(value % 10)
          } break
          case 0x55: {
            for(let registerIndex = 0; registerIndex <= x; registerIndex++) {
              this.memory[this.i + registerIndex] = this.registers[registerIndex]
            }
          } break
          case 0x65: {
            for(let registerIndex = 0; registerIndex <= x; registerIndex++) {
              this.registers[registerIndex] = this.memory[this.i + registerIndex]
            }
          } break
        }
      } break
    }
  }
}
