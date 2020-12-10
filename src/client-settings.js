const config = global.__config;

const root = config.root;

const settings = require(root + '/src/all-settings');

requiredKeys = ['location', 'verbose', 'image', 'video'];
obj = {};

requiredKeys.forEach((key) => {
  obj[key] = settings[key];
});

console.log(obj);
module.exports = Object.freeze(obj);
