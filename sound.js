export default class Sound {
  /**
   * AudioContext Instance
   * @type {AudioContext}
   */
  audioContext
  /**
   * Gain
   * @type {GainNode}
   */
  gain
  /**
   * Destionation / Audio Source
   * @type {AudioDestinationNode}
   */
  destination

  constructor() {
    this.audioContext = new window.AudioContext()
    this.gain = this.audioContext.createGain()
    this.destination = this.audioContext.destination
    this.gain.connect(this.destination)
  }
}

Sound.prototype.play = function() {
  if(this.audioContext && !this.oscillator) {
    this.oscillator = this.audioContext.createOscillator()
    this.oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime)
    this.oscillator.type = "square"
    this.oscillator.connect(this.gain)
    this.oscillator.start()
  }
}

Sound.prototype.stop = function() {
  if(this.oscillator) {
    this.oscillator.stop()
    this.oscillator.disconnect()
    this.oscillator = null
  }
}