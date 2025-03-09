const fs = require('fs');
const path = require('path');

// Copy main.js to build directory
fs.copyFileSync(
  path.join(__dirname, 'main.js'),
  path.join(__dirname, 'build', 'main.js')
);