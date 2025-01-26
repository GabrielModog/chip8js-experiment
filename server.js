import { existsSync } from "fs"

const mainFolder = "public"

const server = Bun.serve({
  port: 3000,
  async fetch(request) {
    const result = await Bun.build({
      entrypoints: ['./src/main.js'],
      outdir: './public',
      minify: {
        whitespace: true,
        identifiers: true,
        syntax: false,
      },
    })

    const url = new URL(request.url)

    console.log(url)
    console.log(result)

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
      return new Response(Bun.file(`${mainFolder}/main.js`), {
        headers: {
          'Content-Type': "application/javascript",
        }
      })
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
