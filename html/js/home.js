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

  /*
  var filter = web3.eth.filter('latest');
  filter.watch(function (err, result) {
    //console.log(result, err)
  });
  */
  web3.eth.getBalance("")
});
