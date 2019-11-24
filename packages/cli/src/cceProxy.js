// Temporary solution since main CLI's package name is taken
const fs = require('fs');
const cp = require('child_process');
const { copyTemplate } = require('@chromex/utils');
const path = require('path');

const TEMPLATE_DIR = path.join(__dirname, 'template');

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

async function updatePkgJson(outputDir) {
  const pkgJsonPath = path.join(outputDir, 'package.json');
  const pkgJson = JSON.parse(
    (await fs.promises.readFile(pkgJsonPath)).toString()
  );
  pkgJson.name = outputDir;
  await fs.promises.writeFile(pkgJsonPath, JSON.stringify(pkgJson, null, 2));
}

async function main(outputDir) {
  if (!outputDir) {
    console.log('Usage: create-chrome-extension <project name>');
    return false;
  } else if (fs.existsSync(outputDir)) {
    console.log(
      `${outputDir} already exists, please remove it or choose another project name!`
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
  return true;
}

module.exports = main;
