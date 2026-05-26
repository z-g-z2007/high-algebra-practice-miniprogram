let privateConfig;
try {
  privateConfig = require('./private.js');
} catch (e) {
  privateConfig = require('./private.example.js');
}

module.exports = privateConfig;
