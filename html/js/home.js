var web3 = new Web3(new Web3.providers.HttpProvider("/parity"));
var eth = web3.eth;
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

  var src = "contract abstraction {}";
  $.post("/solc", {src: src}, function (data) {
    console.log(data);
  });
});
