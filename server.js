import { existsSync } from "fs"

const mainFolder = "public"

const server = Bun.serve({
  port: 3000,
  async fetch(request) {
    const url = new URL(request.url)
    // check main files
    if (url.pathname === "/") 
      return new Response(Bun.file(`${mainFolder}/index.html`))
    if (url.pathname === "/main.js")
      return new Response(Bun.file(`${mainFolder}/main.js`))
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
