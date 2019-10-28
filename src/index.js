const fs = require('fs');
const glob = require('glob');
const path = require('path');
const ncp = require('ncp').ncp;
const pLimit = require('p-limit');
const cp = require('child_process');

const CONCURRENCY = 16;

const TEMPLATE_DIR = path.join(__dirname, '../template');
const GLOB_ALL_REPLACEABLE_FILES = '**/*.{js,json}';

const limitPool = pLimit(CONCURRENCY);
ncp.limit = CONCURRENCY;

function copyTemplateFiles({ outputDir }) {
  return new Promise((res, rej) => {
    ncp(TEMPLATE_DIR, outputDir, function(err) {
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

function shell(cmd) {
  return new Promise((res, rej) => {
    cp.exec(cmd, (err, out, stderr) => {
      err ? rej(stderr) : res(out.substring(0, out.length - 1)); // remove newline char
    });
  });
}

async function getUserInfo() {
  const [name, email] = await Promise.all([
    shell('git config user.name'),
    shell('git config user.email'),
  ]);
  return {
    name,
    email,
  };
}

async function main(outputDir) {
  if (!outputDir) {
    console.log('Usage: create-chrome-extension <project name>');
    return;
  }
  const user = await getUserInfo();
  await copyTemplateFiles({ outputDir });

  const TEMPLATE_VARS = {
    PROJECT_NAME: outputDir,
    USER_NAME: user.name,
    USER_EMAIL: user.email,
  };
  await replaceTemplateVariables({
    outputDir,
    variables: varToRegex(TEMPLATE_VARS),
  });
}

module.exports = main;
main(process.argv[2]);
