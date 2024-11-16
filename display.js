import { VIDEO_HEIGHT, VIDEO_WIDTH } from "./constants.js"

export default class Display {
  /**
   * Display Options
   * @param {Number} scale 
   * @param {Number} pixelSize
   */
  constructor(scale = 10, pixelSize = 10) {
    /**
     * @type {HTMLCanvasElement} canvas
     */
    this.canvas = document.getElementById("app")
    /**
     * @type {CanvasRenderingContext2D} ctx
     */
    this.ctx = this.canvas.getContext("2d")

    this.scale = scale
    this.pixelSize = pixelSize
  }
  /**
   * Display Buffer
   * @param {Array} video - display buffer
   */
  render(video) {
    for (let x = 0; x < VIDEO_WIDTH; x++) {
      for (let y = 0; y < VIDEO_HEIGHT; y++) {
        const pixel = video[x + y * VIDEO_WIDTH]
        if (pixel) {
          this.ctx.fillStyle = "#000"
          this.ctx.fillRect(
            x * this.scale,
            y * this.scale,
            this.pixelSize,
            this.pixelSize
          )
        }
      }
    }
  }
}