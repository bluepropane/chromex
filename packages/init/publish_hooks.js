const cp = require('child_process');
const path = require('path');
const fs = require('fs');

const templateDir = path.join(__dirname, 'src', 'template');

const pkgPath = path.join(templateDir, 'package.json');
const pkgJson = require(pkgPath);

function cleanGit() {
  cp.execSync('rm -rf .git && git init', {
    cwd: templateDir,
  });
}

function updatePkgName(name) {
  pkgJson.name = name;

  fs.writeFile(pkgPath, JSON.stringify(pkgJson, null, 2), err => {
    console.log(err || 'Success');
  });
}

switch (process.argv[2]) {
  case 'pre':
    cleanGit();
    updatePkgName('$(PROJECT_NAME)');
    break;

  case 'post':
    updatePkgName('template');
    break;
}
