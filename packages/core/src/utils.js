const path = require('path');

/**
 *
 * @param {string} string
 */
function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 *
 * @param {String} pathToImg
 * @param {number[]} dimensions
 * @param {Object} options
 */
function dimensionedIconNames(pathToImg, dimensions, options) {
  const regex = /(\.[\w]+)$/;
  const pathDir = path.dirname(pathToImg);
  const imgFullName = path.basename(pathToImg);
  const imgName = imgFullName.replace(regex, '');

  const imgExt = (regex.exec(imgFullName) || [''])[0];

  return dimensions.reduce(
    (accum, dim) => ({
      ...accum,
      [dim]: path.join(
        options.fullPath ? pathDir : '',
        `${imgName}_${dim}${options.fileExt || imgExt}`
      ),
    }),
    {}
  );
}

/**
 *
 * @param {String} pageType
 */
function getPageDir(pageType) {
  return path.join('pages', pageType);
}

module.exports = {
  capitalize,
  dimensionedIconNames,
  getPageDir,
};
