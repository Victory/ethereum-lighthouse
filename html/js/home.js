var web3 = new Web3(new Web3.providers.HttpProvider("/parity"));
var eth = web3.eth;
var lastCall;
jQuery(function ($) {
  var coin;

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
    var src = $(this).find("textarea.contract").val();
    $.post("/solc", {src: src}, function (data) {
      lastCall = data;
      if (typeof data === "string") {
        $("#compileError").text(data);
        return;
      }
      var abi = data.contracts.TestContract.abi;
      $("#compileResults").text(JSON.stringify(data));
      console.info(eth.contract(abi));
      var TestContract = eth.contract(JSON.parse(abi));
      var myTest = TestContract.new({
        data: "0x" + data.contracts.TestContract.bin,
        gas: 300000,
        from: $("#coin").val(),
      }, function (err, myContract) {
        console.info(err, myContract);
        // from offical docs at https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethcontract
        if(!err) {
          // e.g. check tx hash on the first call (transaction send)
          if(!myContract.address) {
            console.info("transactionHash", myContract.transactionHash) // The hash of the transaction, which deploys the contract
            // check address on the second call (contract deployed)
          } else {
            console.info("theAddress", myContract.address) // the contract address
          }
          // Note that the returned "myContractReturned" === "myContract",
          // so the returned "myContractReturned" object will also get the address set.
        }
      });
    });
  });
});
