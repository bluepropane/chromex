/**
 * https://developer.chrome.com/extensions/manifest/icons
 */
const path = require('path');
const sharp = require('sharp');
const { ICON_OUTPUT_SIZES } = require('./constants');
const { dimensionedIconNames } = require('./utils');

function generateIcons(pathToFile, outputDir) {
  const inputImg = sharp(pathToFile);
  const iconOutputs = dimensionedIconNames(pathToFile, ICON_OUTPUT_SIZES, {
    fileExt: '.png',
  });
  Object.entries(iconOutputs).forEach(([imgSize, iconOutput], idx) => {
    imgSize = parseInt(imgSize);
    const outputImg = inputImg.clone();
    outputImg
      .resize(imgSize, imgSize)
      .png()
      .toFile(path.join(outputDir, iconOutput));
  });
}

module.exports = generateIcons;
