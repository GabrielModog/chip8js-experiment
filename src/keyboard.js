/**
 * Handle user inputs
 * @class Keyboard
 */
export default class Keyboard {
  /**
   * Map of keys pressed/released
   * @type {Object}
  */
  keysPressed
  /**
   * Callback function to execute next pressed key
   * @type {Function?}
   */
  nextKeyCallback

  constructor(keysMap) {
    this.keysMap = keysMap
    this.keysPressed = {}
    this.nextKeyCallback = null
    this.init()
  }

  init() {
    window.addEventListener("keydown", this.onKeyDown.bind(this), false)
    window.addEventListener("keyup", this.onKeyRelease.bind(this), false)
  }
}

/**
 * isKeyPressed
 * @param {number} key - should be a valid key (chip-8 format)
 * @returns {boolean}
 */
Keyboard.prototype.isKeyPressed = function (key) {
  return this.keysPressed[key]
}

/**
 * onKeyDown(event)
 * @param {KeyboardEvent} event 
 */
Keyboard.prototype.onKeyDown = function (event) {
  const keyCode = event?.keyCode
  const key = this.keysMap[keyCode]
  if(!key) return
  this.keysPressed[key] = true
  if (this.nextKeyCallback && key) {
    this.nextKeyCallback(key)
    this.nextKeyCallback = null
  }
}

/**
 * onKeyRelease(event)
 * @param {KeyboardEvent} event 
 */
Keyboard.prototype.onKeyRelease = function (event) {
  // keyCode it's deprecated in some browsers
  const keyCode = event?.keyCode
  const key = this.keysMap[keyCode]
  this.keysPressed[key] = false
}