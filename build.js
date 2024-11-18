const result = await Bun.build({
  entrypoints: ['./src/main.js'],
  outdir: './public',
  minify: {
    whitespace: true,
    identifiers: true,
    syntax: false,
  },
})

console.log(result)