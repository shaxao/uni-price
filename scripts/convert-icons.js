const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const ICONS_DIR = path.join(__dirname, '../src/static/images')
const SVG_FILES = ['home.svg', 'home-active.svg']

async function convertSvgToPng() {
  for (const svgFile of SVG_FILES) {
    const svgPath = path.join(ICONS_DIR, svgFile)
    const pngPath = path.join(ICONS_DIR, svgFile.replace('.svg', '.png'))

    try {
      await sharp(svgPath)
        .png()
        .resize(48, 48) // 2x size for retina displays
        .toFile(pngPath)

      console.log(`Converted ${svgFile} to PNG`)
    } catch (error) {
      console.error(`Error converting ${svgFile}:`, error)
    }
  }
}

convertSvgToPng() 