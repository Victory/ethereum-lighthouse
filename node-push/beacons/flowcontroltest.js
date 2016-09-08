var vPromise = require('vPromise');

module.exports.flow = function (el) {
  var vp = new vPromise(function (resolve, reject) {
    setTimeout(function () {
      resolve(true);
    }, 3000);
  });

  console.log('oh hai');

  return vp;
};