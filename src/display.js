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
    this.canvas.width = VIDEO_WIDTH * this.scale
    this.canvas.height = VIDEO_HEIGHT * this.scale
  }
  /**
   * Display Buffer
   * @param {Array} video - display buffer
   */
  render(video) {
    // TODO: fix missing bits on display
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    for (let x = 0; x < VIDEO_WIDTH; x++) {
      for (let y = 0; y < VIDEO_HEIGHT; y++) {
        const pixel = video[x + y * VIDEO_WIDTH]
        if (pixel) {
          this.ctx.fillStyle = "#212f3d"
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
