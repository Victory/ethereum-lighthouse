var web3 = new Web3(new Web3.providers.HttpProvider("/parity"));
var eth = web3.eth;
var lastCall;
var instance;
jQuery(function ($) {
  var coin;

  var log = function () {
    console.info.apply(console, arguments);
    $("#log").append(JSON.stringify(arguments) + " \n")
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

    if (!$("#coin").val()) {
      $("#compileError").text("No coin set");
      return;
    }
    web3.eth.defaultAccount = $("#coin").val();

    var src = $(this).find("textarea.contract").val();
    $.post("/solc", {src: src}, function (data) {
      lastCall = data;
      if (typeof data === "string") {
        $("#compileError").text(data);
        return;
      }
      var abi = data.contracts.TestContract.abi;
      $("#compileResults").text(JSON.stringify(data));
      log(eth.contract(abi));
      var TestContract = eth.contract(JSON.parse(abi));

      var myTest = TestContract.new({
        data: "0x" + data.contracts.TestContract.bin,
        gas: 300000,
        from: $("#coin").val(),
      }, function (err, myContract) {
        log(err, myContract);
        // from offical docs at https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethcontract
        if(!err) {
          // e.g. check tx hash on the first call (transaction send)
          if(!myContract.address) {
            log("transactionHash", myContract.transactionHash) // The hash of the transaction, which deploys the contract

            log('getting blockNumber');
            web3.eth.getBlockNumber(function (err, result) {
              log('the blockNumber when we get the transactionHash', result);
            });

          } else { // check address on the second call (contract deployed)
            log("theAddress", myContract.address) // the contract address
            instance = eth.contract(JSON.parse(abi)).at(myContract.address);
            instance.helloWorld();
            $("#contractAddress").val(myContract.address);
            $("#killContract").prop('disabled', false);

            var filter = web3.eth.filter({toBlock: 'latest', address: myContract.address, 'topics':null});
            filter.watch(function (err, result) {
              console.info('filtering', result, err);
            });

            log(instance);
            log("running hello world", instance.helloWorld());
          }
        }
      });
    });

    $("#killContract").click(function () {
      if (!instance) {
        return;
      }
      instance.kill();
      $("#contractAddress").val('');
      $("#killContract").prop('disabled', true);
    });
  });
});
