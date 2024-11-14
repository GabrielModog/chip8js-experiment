import { KEYS } from "./constants.js"

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
   * Callback function to execute next key
   * @type {Function?}
   */
  onNextKeyDown
  
  constructor() {
    this.keysPressed = {}
    this.onNextKeyDown = null
    this.init()
  }
}

/**
 * isKeyPressed
 * @param {number} keyCode - should be a valid keycode
 * @returns {boolean}
 */
Keyboard.prototype.isKeyPressed = function(keyCode) {
  return this.keysPressed[keyCode]
}

/**
 * onKeyDown(event)
 * @param {KeyboardEvent} event 
 */
Keyboard.prototype.onKeyDown = function(event) {
  const keyCode = event?.keyCode || event?.key.toUpperCase().charCodeAt(0)
  const key = KEYS[keyCode]
  this.keysPressed[key] = true
  if(this.onNextKeyDown && key) {
    this.onNextKeyDown(key)
    this.onNextKeyDown = null
  }
}

/**
 * onKeyRelease(event)
 * @param {KeyboardEvent} event 
 */
Keyboard.prototype.onKeyRelease = function(event) {
  // keyCode it's deprecated in some browsers
  const keyCode = event?.keyCode || event?.key.charCodeAt(0)
  const key = KEYS[keyCode]
  this.keysPressed[key] = false
}

Keyboard.prototype.init = function() {
  window.addEventListener("keydown", this.onKeyDown.bind(this), false)
  window.addEventListener("keyup", this.onKeyRelease.bind(this), false)
}