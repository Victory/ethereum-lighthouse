var web3 = new Web3(new Web3.providers.HttpProvider("/parity"));
var eth = web3.eth;
var howOftenToUpdate = 5000;

jQuery(function ($) {
  var $logList = $("#logList");
  var log = function (msg) {
    console.info(msg);
    if (typeof msg.data !== "undefined") {
      $logList.prepend($("<li>", {text: "data: " + msg.data + " - " + JSON.stringify(msg)}));
    } else {
      $logList.prepend($('<li>', {text: JSON.stringify(msg)}));
    }
  };

  console.log(eth.contract(abi));
  var tic = 0;

  $("#startButton").click(function () {
    var address = $("#address").val();
    var fromAccount = $("#account").val();
    var abi = JSON.parse($("#abi").val());
    var abiContract = eth.contract(abi);
    var contract = abiContract.at(address);

    log("starting");
    var filter = web3.eth.filter({toBlock: 'latest', address: address, 'topics': null});
    filter.watch(function (err, result) {
      log(result);
    });

    console.log(contract.pushVal.estimateGas());
    console.log(contract.pushVal.getData());

    setInterval(function () {
      tic += 1;
      contract.pushVal.sendTransaction(tic, {
          to: address,
          from: fromAccount,
          gas: 500000
        },
        function (err, result) {
          console.log('calling back', err, result);
        });
      }, howOftenToUpdate);

  });
});
