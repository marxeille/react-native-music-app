const fs = require('fs')
const imageFileNames = () => {
  const array = fs
    .readdirSync('src/assets/icons/')
    .filter(file => {
      return file.endsWith('.png')
    })
    .map(file => {
      return file
        .replace('@2x.png', '')
        .replace('@3x.png', '')
        .replace('.png', '')
    })
  return Array.from(new Set(array))
}
const generate = () => {
  let properties = imageFileNames()
    .map(name => {
      return `${name.replace(/-/g, '_')}: require('./${name}.png')`
    })
    .join(',\n  ')
  const string = `const Images = {
  ${properties}
}
export default Images
`
  fs.writeFileSync('src/assets/icons/icons.js', string, 'utf8')
}
generate()