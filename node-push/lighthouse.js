const Web3 = require("web3");
const el = require(__dirname + "/lib/setup.js");

var lightHouse;
try {
  lightHouse = require(el.options.require);
} catch (e) {
  console.log('could not find: ' + el.options.require);
  throw e;
}

console.log('Using lighthouse script: ' + el.options.require);

var web3 = new Web3(new Web3.providers.HttpProvider(el.options.rpcEndpoint));
var eth = web3.eth;

var abiContract = eth.contract(el.options.abi);
var contract = abiContract.at(el.options.contractAddress);

el.contract = contract;
el.web3 = web3;
el.eth = eth;


var Runner = function () {

  this.isRunning = false;

  var resolved = function (runAgain) {
    if (!runAgain) {
      process.exit(0);
    }
    this.isRunning = false;
  }.bind(this);

  var rejected = function () {
    process.exit(1);
  };


  return {
    run: function () {
      if (this.isRunning) {
        return;
      }
      this.isRunning = true;

      lightHouse[el.options.pushFunction](el).then(resolved, rejected);
    }.bind(this)
  }
};

var runner = new Runner();
setInterval(runner.run, el.options.interval);
//console.log("lighthouse", el.options);