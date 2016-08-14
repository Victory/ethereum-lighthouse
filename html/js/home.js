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

  $compileResults.val('');
  $abiResults.val('');
  $contractAddress.val('');
  $killContract.prop('disabled', false);

  var $log = $("#log");

  var logerr = function () {
    console.info("error from: \n", arguments.callee.caller.toString());
    console.info.apply(console, arguments);

    var oldLog = $log.text();
    $log.text(JSON.stringify(arguments) + " \n" + oldLog);
  };

  var log = function () {
    console.info.apply(console, arguments);
    var oldLog = $log.text();
    $log.text(JSON.stringify(arguments) + " \n" + oldLog);
  };

  var showBalance = function () {
    var bal = eth.getBalance(coin);
    $("#balanceHeader").text("Current balance is: ");
    $("#balance").text(web3.fromWei(bal, 'ether'));
  };

  $("#setCoin").click(function () {
    coin = $("#coin").val();
    showBalance();
  });

  eth.getHashrate(function (err, result) {
    $("#hashRate").text(result);
  });

  $("textarea.contract").on('input, blur', function () {
    $("#compileError").text("");
  });

  $("#contractForm").submit(function (evt) {
    evt.preventDefault();

    var $coin = $("#coin");

    if (!$coin.val()) {
      $("#compileError").text("No coin set");
      return;
    }
    web3.eth.defaultAccount = $coin.val();

    var src = $(this).find("textarea.contract").val();
    $.post("/solc", {src: src}, function (data) {
      lastCall = data;
      if (typeof data === "string") {
        $("#compileError").text(data);
        return;
      }
      var abiInfo = abi2js.jsify(data);
      abi2js.makeHtmlInterface(abiInfo);

      var abi = abiInfo.abi;

      $compileResults.val(JSON.stringify(data));
      $abiResults.val(abi);
      log(eth.contract(abi));
      var TestContract = eth.contract(abi);

      function getAddress(myContract) {
        log("transactionHash", myContract.transactionHash); // The hash of the transaction, which deploys the contract
        web3.eth.getBlockNumber(function (err, result) {
          log('the blockNumber when we got the transactionHash', result);
        });
      }

      function callContract(myContract) {
        log("theAddress", myContract.address); // the contract address
        instance = eth.contract(abi).at(myContract.address);
        var startBlockNumber;
        web3.eth.getBlockNumber(function (err, result) {
          instance.helloWorld();
          startBlockNumber = result;
          log('called hello waiting for blocks', result);
        });

        $contractAddress.val(myContract.address);
        $killContract.prop('disabled', false);

        var filter = web3.eth.filter({toBlock: 'latest', address: myContract.address, 'topics': null});
        filter.watch(function (err, result) {
          log('startBlocknumber on watch', startBlockNumber);
          log('filtering', result, err);
        });

        log(instance);
        log("running hello world", instance.helloWorld());
      }

      TestContract.new({
        data: "0x" + data.contracts.TestContract.bin,
        gas: 300000,
        from: $("#coin").val()
      }, function (err, myContract) {
        if (err) {
          logerr('found error', err);
          return;
        }

        if(!myContract.address) {
          getAddress(myContract);
        } else { // check address on the second call (contract deployed)
          console.log('myContract', myContract);
          callContract(myContract);
        }
      });
    });

    $killContract.click(function () {
      if (!instance) {
        return;
      }
      instance.kill();
      $("#contractAddress").val('');
      $killContract.prop('disabled', true);
    });
  });
});
