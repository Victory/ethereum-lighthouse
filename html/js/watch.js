/**
 * Used with watch.html to watch events on an address
 */
var web3 = new Web3(new Web3.providers.HttpProvider("/parity"));
var eth = web3.eth;
var howOftenToUpdate = 5000;

jQuery(function ($) {
  var logFactory = function ($logList, isError) {
    return function (msg) {
      console.info(msg);
      var $li = $("<li>");
      if (isError) {
        $li.addClass("error");
      }
      if (typeof msg.data !== "undefined") {
        $logList.prepend($li.text(msg.data + " - " + JSON.stringify(msg)));
      } else {
        $logList.prepend($li.text(JSON.stringify(msg)));
      }
    }
  };

  $(".watchButton").click(function () {
    var $thisGroup = $(this).parents(".address-group");

    var address = $thisGroup.find(".address").val();
    var $logList = $thisGroup.find(".logList");
    var log = logFactory($logList);
    log("watching: " + address);

    var filter = web3.eth.filter({toBlock: 'latest', address: address, 'topics': null});
    filter.watch(function (err, result) {
      if (err) {
        log(error, true);
      } else {
        log(result, false);
      }
    });

  });
});