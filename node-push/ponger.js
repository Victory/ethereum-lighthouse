module.exports.updateLighthouse = function (el) {
  var rnd = Math.floor(Math.random() * 100);

  el.contract.pushVal.sendTransaction(rnd, {
      to: el.options.contractAddress,
      from: el.options.walletAddress,
      gas: el.options.gas
    },
    function (err, result) {
      console.log('calling back', err, result);
    }
  );
  console.log("updating lighthouse", rnd.toString(16));
};