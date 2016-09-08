var Web3 = require("web3");
var path = require("path");
endpoint = process.argv[2];
addr = process.argv[3];
fromAccount = process.argv[4];

function usage() {
  console.error("Usage: \n" +
    "  " + process.argv[1] + " http://host:port contractAddress wallet\n\n" +
    path.basename("   " + process.argv[1]) + "  http://127.0.0.1:8485/path 0xabf958ad64c65e7afa3badc2efc8327b1ce7fb8f 0xc8f958ad64c65e7afa3badc2efc8327b1ce7fb8f");
}

function rand() {
  return Math.floor(Math.random() * 100);
}

if (typeof endpoint === "undefined" || typeof addr === "undefined") {
  console.error("Error");
  usage();
  return;
}

var web3 = new Web3(new Web3.providers.HttpProvider(endpoint));
var eth = web3.eth;
console.log("Web3 RPC endpoint...: " + web3.currentProvider.host);
console.log("Contract address....: " + addr);

var abiString = '[{"constant":false,"inputs":[{"name":"val","type":"int32"}],"name":"pushVal","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"pullVal","outputs":[{"name":"","type":"int32"}],"type":"function"},{"constant":false,"inputs":[],"name":"getVal","outputs":[{"name":"","type":"int32"}],"type":"function"},{"constant":false,"inputs":[],"name":"getClock","outputs":[{"name":"","type":"string"}],"type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"","type":"int32"}],"name":"SendingPong","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"","type":"string"}],"name":"SendingClock","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"","type":"int32"}],"name":"ValPushed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"","type":"int32"}],"name":"ValPulled","type":"event"}]';
var abi = JSON.parse(abiString);

(function () {
  // update the pushVal in the contract
  function updatePushVal() {
    var abiContract = eth.contract(abi);
    var contract = abiContract.at(addr);
    var rnd = rand();
    console.log("Pushing: " + rnd.toString(16));

    contract.pushVal.sendTransaction(rnd, {
        to: addr,
        from: fromAccount,
        gas: 500000
      },
      function (err, result) {
        console.log('calling back', err, result);
      }
    );
  }

  updatePushVal();
  setInterval(updatePushVal, 25000);
}());
