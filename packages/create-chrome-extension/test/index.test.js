import main from '../src/';
const fs = require('fs');
const TEST_OUTPUT_DIR = './test-out';

describe('', () => {
  beforeAll(() => {
    main(TEST_OUTPUT_DIR);
  });

  test('output dir is created', () => {
    expect(fs.readdirSync(TEST_OUTPUT_DIR)).not.toThrow();
  });

  afterAll(() => {
    fs.rmdirSync(TEST_OUTPUT_DIR, { recursive: true });
  });
});
