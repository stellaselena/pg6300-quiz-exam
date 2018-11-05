/*eslint-disable no-var */
process.env.NODE_ENV = 'test';
require('babel-register')();

require.extensions['.css'] = function () {return null;};
require.extensions['.png'] = function () {return null;};
require.extensions['.jpg'] = function () {return null;};

var { JSDOM } = require('jsdom');

var exposedProperties = ['window', 'navigator', 'document'];

const { window } = new JSDOM(`...`);
const { document } = (new JSDOM(`...`)).window;
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});

global.navigator = {
  userAgent: 'node.js'
};

global.documentRef = document;  //eslint-disable-line no-undef

var Enzyme = require('enzyme');
var Adapter = require('enzyme-adapter-react-16');

Enzyme.configure({ adapter: new Adapter() });
