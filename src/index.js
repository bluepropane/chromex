const fs = require('fs');
const ncp = require('ncp').ncp;
const path = require('path');

const TEMPLATE_DIR = path.join(__dirname, '../template');
ncp.limit = 16;

console.log(process.argv);

function populateTemplate(read, write) {
  console.log(read, write);
}

function main(outputDir) {
  if (!outputDir) {
    console.log('Usage: create-chrome-extension <project name');
    return;
  }
  ncp(
    TEMPLATE_DIR,
    outputDir,
    {
      transform: populateTemplate,
    },
    function(err) {
      if (err) {
        return console.error(err);
      }
      console.log('done!');
    }
  );
}

main(process.argv[2]);
