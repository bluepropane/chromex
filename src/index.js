const fs = require('fs');
const glob = require('glob');
const path = require('path');
const ncp = require('ncp').ncp;
const pLimit = require('p-limit');

const CONCURRENCY = 16;

const TEMPLATE_DIR = path.join(__dirname, '../template');
const GLOB_ALL_FILES = '**/*';

const limitPool = pLimit(CONCURRENCY);
ncp.limit = CONCURRENCY;

function copyTemplateFiles({ outputDir }) {
  return new Promise((res, rej) => {
    ncp(TEMPLATE_DIR, outputDir, function(err) {
      if (err) {
        rej(err);
      } else {
        res();
      }
    });
  });
}

async function replaceTemplateVariables({ outputDir, variables }) {
  const matches = await new Promise((res, rej) => {
    glob(
      path.join(outputDir, GLOB_ALL_FILES),
      { nodir: true },
      (err, matches) => {
        if (err) rej(err);
        else {
          res(matches);
        }
      }
    );
  });

  const tasks = matches.map(match =>
    limitPool(async () => {
      let content = (await fs.promises.readFile(match)).toString();
      variables.forEach(([regex, replaceValue]) => {
        content = content.replace(regex, replaceValue);
      });

      fs.promises.writeFile(match, content);
    })
  );

  await Promise.all(tasks);
}

function varToRegex(variables) {
  return Object.entries(variables).reduce(
    (accum, [varName, replaceValue]) => [
      ...accum,
      [new RegExp(`\\$\\(${varName}\\)`, 'gm'), replaceValue],
    ],
    []
  );
}

async function main(outputDir) {
  if (!outputDir) {
    console.log('Usage: create-chrome-extension <project name>');
    return;
  }
  await copyTemplateFiles({ outputDir });

  const TEMPLATE_VARS = {
    PROJECT_NAME: outputDir,
  };
  await replaceTemplateVariables({
    outputDir,
    variables: varToRegex(TEMPLATE_VARS),
  });
}

main(process.argv[2]);
