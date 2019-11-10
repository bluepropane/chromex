const fs = require('fs');
const glob = require('glob');
const path = require('path');
const ncp = require('ncp').ncp;
const pLimit = require('p-limit');
const cp = require('child_process');

const CONCURRENCY = 16;

const GLOB_ALL_REPLACEABLE_FILES = '**/*.{js,json}';

const limitPool = pLimit(CONCURRENCY);
ncp.limit = CONCURRENCY;

function copyTemplateFiles({ srcDir, outputDir }) {
  return new Promise((res, rej) => {
    ncp(srcDir, outputDir, function(err) {
      err ? rej(err) : res();
    });
  });
}

async function replaceTemplateVariables({ outputDir, variables }) {
  const matches = await new Promise((res, rej) => {
    glob(
      path.join(outputDir, GLOB_ALL_REPLACEABLE_FILES),
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

module.exports = async function(srcDir, outputDir, vars) {
  await copyTemplateFiles({ srcDir, outputDir });
  await replaceTemplateVariables({
    outputDir,
    variables: varToRegex(vars),
  });
};

module.exports.copyTemplateFiles = copyTemplateFiles;
module.exports.replaceTemplateVariables = replaceTemplateVariables;
