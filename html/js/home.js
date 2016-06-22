jQuery(function ($) {
  var web3 = new Web3(new Web3.providers.HttpProvider("/parity"));
  var filter = web3.eth.filter('latest');
  filter.watch(function (err, result) {
    //console.log(result, err)
  });
});
