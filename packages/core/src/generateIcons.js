const sharp = require('sharp');

const OUTPUT_SIZES = [16, 19, 48, 128];

function generateIcons(pathToFile, outputDir) {
  const inputImg = sharp(pathToFile);
  const imgName = pathToFile
    .split('/')
    .slice(-1)[0]
    .replace(/(\.[\w]+)$/, '');

  OUTPUT_SIZES.forEach(imgSize => {
    const outputImg = inputImg.clone();
    outputImg
      .resize(imgSize, imgSize)
      .png()
      .toFile(`${outputDir}/${imgName}${imgSize}.png`);
  });
}

module.exports = generateIcons;
