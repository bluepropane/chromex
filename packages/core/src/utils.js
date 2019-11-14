const path = require('path');

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

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

module.exports = {
  capitalize,
  dimensionedIconNames,
};
