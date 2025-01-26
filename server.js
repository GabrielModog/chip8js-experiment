import { Glob } from "bun";
import { existsSync } from "fs"

const dev = true

const mainFolder = "public"
const glob = new Glob("src/*.js")

const listOfDevFiles = []

for(const file of glob.scanSync(".")) {
  listOfDevFiles.push(file)
}

const server = Bun.serve({
  development: dev,
  port: 3000,
  async fetch(request) {
    const url = new URL(request.url)

    console.log(url)

    // check main files
    if (url.pathname === "/") 
      return new Response(Bun.file(`${mainFolder}/index.html`), {
        headers: {
          'Content-Type': "text/html",
          'Content-Security-Policy': "script-src-elem *;",
       },
      })
    if (url.pathname === "/styles.css")
      return new Response(Bun.file(`${mainFolder}/styles.css`))
    if (url.pathname === "/main.js")
      return new Response(Bun.file(`src/main.js`), {
        headers: {
          'Content-Type': "application/javascript",
        }
      })
    if(url.pathname.endsWith(".js")) {
      for(let fileUrl of listOfDevFiles) {
        if(url.pathname === fileUrl.replace("src/", "/")) {
          return new Response(Bun.file(fileUrl))
        }
      }
    }
    // check roms files
    if (url.pathname.startsWith("/roms/")) {
      let filePath = `.${url.pathname}`
      filePath = filePath.replace("/roms/", `/${mainFolder}/roms/`)
      if (existsSync(filePath)) 
        return new Response(Bun.file(filePath))
    }
    return new Response("Not Found", { status: 404 })
  },
})

console.log(`Listening on ${server.url}`)
