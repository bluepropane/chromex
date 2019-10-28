echo clearing output
rm -rf output

echo generating output
node src/index.js output

echo starting dev
cd output && yarn dev
