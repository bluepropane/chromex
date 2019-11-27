#!/usr/bin/env node

// Temporary solution since main CLI's package name is taken
const fs = require('fs');
const cp = require('child_process');
const { copyTemplate } = require('@chromex/utils');
const path = require('path');

const TEMPLATE_DIR = path.join(__dirname, 'template');

function shell(cmd, opts) {
  return new Promise((res, rej) => {
    cp.exec(cmd, opts, (err, out, stderr) => {
      err ? rej(err, stderr) : res(out.substring(0, out.length - 1)); // remove newline char
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

function install(outputDir) {
  return shell('npm install --no-package-lock', {
    cwd: path.join(process.cwd(), outputDir),
  });
}

async function updatePkgJson(outputDir) {
  const pkgJsonPath = path.join(outputDir, 'package.json');
  const pkgJson = JSON.parse(
    (await fs.promises.readFile(pkgJsonPath)).toString()
  );
  pkgJson.name = outputDir;
  await fs.promises.writeFile(pkgJsonPath, JSON.stringify(pkgJson, null, 2));
}

function ensureCompatibility() {
  const { promisify } = require('util');
  if (!fs.promises) {
    fs.promises = {
      readFile: promisify(fs.readFile),
      writeFile: promisify(fs.writeFile),
    };
  }
}

async function main(outputDir) {
  ensureCompatibility();
  if (!outputDir) {
    console.log('Usage: create-chrome-extension <project name>');
    return false;
  } else if (fs.existsSync(outputDir)) {
    console.log(
      `
[Chromex] Unable to install into ${outputDir}: directory already exists.
Please remove directory or choose another project name!
`
    );
    return false;
  }
  const user = await getUserInfo();

  const templateVars = {
    PROJECT_NAME: outputDir,
    USER_NAME: user.name,
    USER_EMAIL: user.email,
  };

  await copyTemplate(TEMPLATE_DIR, outputDir, templateVars);

  await updatePkgJson(outputDir);

  console.log(`Generated new extension boilerplate in ${outputDir}`);
  console.log(
    'Installing packages - this might take a while (a couple minutes)...\n'
  );
  let success = true;
  const output = await install(outputDir).catch(err => {
    console.warn(
      `Error occured while attempting to install node packages in ${outputDir} project:`,
      err,
      `\nManual installation is required; proceed with instruction output below.`
    );
    success = false;
  });
  !!output && console.log(output);

  console.log(`
Success! To get started on your extension project, run:
  

  cd ${outputDir} ${success ? '' : '&& npm install'}
  npm run dev
  

Happy hacking!`);
}

module.exports = main;

main(process.argv[2]);
