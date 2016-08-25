var web3 = new Web3(new Web3.providers.HttpProvider("/parity"));
var eth = web3.eth;
var lastCall;
var instance;
jQuery(function ($) {
  var coin;
  var $compileResults = $("#compileResults");
  var $contractAddress = $("#contractAddress");
  var $abiResults = $("#abiResults");
  var $killContract = $("#killContract");
  var $compileButton = $("#compileButton");
  var $clearButton = $("#clearButton");
  var $contract = $("#contract");

  $compileResults.val('');
  $abiResults.val('');
  $contractAddress.val('');
  $killContract.prop('disabled', true);
  $compileButton.prop('disabled', false);

  var $log = $("#log");

  var logerr = function () {
    console.info("error from: \n", arguments.callee.caller.toString());
    console.info.apply(console, arguments);

    var oldLog = $log.text();
    $log.text(arguments[1] + " \n" + oldLog);
  };

  var log = function () {
    console.info.apply(console, arguments);
    var oldLog = $log.text();
    $log.text(JSON.stringify(arguments) + " \n" + oldLog);
  };

  var showBalance = function () {
    var bal = eth.getBalance(coin);
    log("Current balance is: " + web3.fromWei(bal, 'ether') + " ETH")
  };

  $("#setCoin").click(function () {
    coin = $("#coin").val();
    showBalance();
  });

  eth.getHashrate(function (err, result) {
    $("#hashRate").text(result);
  });

  $clearButton.click(function () {
    $compileButton.text("Compile");
    $compileButton.prop('disabled', false);
    $contract.val('');
  });

  $contract.on('input, blur', function () {
    $("#compileError").text("");
  });

  $("#contractForm").submit(function (evt) {
    evt.preventDefault();

    $compileButton.text("compiling ...");
    $compileButton.prop('disabled', true);

    var $coin = $("#coin");

    if (!$coin.val()) {
      $("#compileError").text("No coin set");
      return;
    }
    web3.eth.defaultAccount = $coin.val();

    var src = $contract.val();
    $.post("/solc", {src: src}, function (data) {
      lastCall = data;
      if (typeof data === "string") {
        $("#compileError").text(data);
        return;
      }
      var contractInfo = abi2js.jsify(data);
      var abiInfo = contractInfo.abiInfo;
      var binInfo = contractInfo.binInfo;

      var abi = abiInfo.abi;

      $compileResults.val(JSON.stringify(data));
      $abiResults.val(abi);
      log(eth.contract(abi));
      var contract = eth.contract(abi);

      function getAddress(myContract) {
        log("transactionHash", myContract.transactionHash); // The hash of the transaction, which deploys the contract
        web3.eth.getBlockNumber(function (err, result) {
          log('the blockNumber when we got the transactionHash', result);
        });
      }

      function callContract(myContract) {
        log("theAddress", myContract.address); // the contract address
        instance = eth.contract(abi).at(myContract.address);
        abi2js.makeHtmlInterface(abiInfo, instance, web3);

        /*
        var startBlockNumber;
        web3.eth.getBlockNumber(function (err, result) {
          startBlockNumber = result;
          log('called hello waiting for blocks', result);
        });
        */

        $contractAddress.val(myContract.address);
        $killContract.prop('disabled', false);

        var filter = web3.eth.filter({toBlock: 'latest', address: myContract.address, 'topics': null});
        filter.watch(function (err, result) {
          log('filtering', result, err);
        });

        log(instance);
      }

      contract.new({
        data: "0x" + binInfo.bin,
        gas: 3000000,
        from: $("#coin").val()
      }, function (err, myContract) {
        if (err) {

          $compileButton.text("Compile");
          $compileButton.prop('disabled', false);

          logerr('found error', err);
          return;
        }

        if(!myContract.address) {
          getAddress(myContract);
        } else { // check address on the second call (contract deployed)
          log('myContract', myContract);
          callContract(myContract);
        }
      });
    });

    $killContract.click(function () {
      $compileButton.text("Compile");
      $compileButton.prop('disabled', false);

      if (!instance) {
        return;
      }
      instance.kill();
      $compileResults.val('');
      $abiResults.val('');
      $contractAddress.val('');
      $killContract.prop('disabled', true);
    });
  });
});
