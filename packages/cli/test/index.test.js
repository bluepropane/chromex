const path = require('path');
const { spawn } = require('child_process');
const concatStream = require('concat-stream');
const { EOL } = require('os');

// jest.mock('inquirer', () => {
//   return {
//     prompt: jest.fn(() => ({
//       value: 'asd',
//     })),
//   };
// });

async function cli(args, deferredWork) {
  const p = spawn('node', ['../../src/index.js', ...args]);

  p.stdin.setEncoding('utf-8');

  if (deferredWork) {
    await deferredWork(p);
  }

  return new Promise((res, rej) => {
    p.stderr.once('data', err => {
      rej(err.toString());
    });

    p.on('error', rej);

    p.stdout.pipe(
      concatStream(result => {
        res(
          result
            .toString()
            .trim()
            .split(EOL)
        );
      })
    );
  });
}

describe('cli functional tests', () => {
  beforeAll(() => {
    process.chdir(path.join(__dirname, 'fixture'));
  });

  it('add: should prompt if no pageType specified', async () => {
    await expect(
      cli(['add'], p => {
        return new Promise(res => {
          p.stdin.write('\n', res);
        });
      })
    ).resolves.toStrictEqual([
      '`undefined` is not a valid page type.',
      'Valid page types: popup|bg|reloader|options|newtab_override',
    ]);
  });

  it('add: can create popup page correctly', async () => {
    await expect(cli(['add', 'popup'])).resolves.toStrictEqual([]);
  });
});
