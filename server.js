import { existsSync } from "fs"

const server = Bun.serve({
  port: 3000,
  async fetch(request) {
    const url = new URL(request.url)
    if (url.pathname === "/") return new Response(Bun.file("index.html"))
    if (url.pathname === "/main.js") return new Response(Bun.file("main.js"))
    // check roms files
    if (url.pathname.startsWith("/roms/")) {
      const filePath = `.${url.pathname}`
      if (existsSync(filePath)) 
        return new Response(Bun.file(filePath))
    }
    // check javascript files
    if (url.pathname.startsWith("/src/")) {
      const filePath = `.${url.pathname}`
      if (existsSync(filePath))
        return new Response(Bun.file(filePath))
    }
    return new Response("Not Found", { status: 404 })
  },
})

console.log(`Listening on ${server.url}`)
