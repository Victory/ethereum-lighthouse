var http = require('http');

module.exports.updateLighthouse = function (el) {

  // Zoo in Tulsa Oklahoma, USA
  var options = {
    host: 'earthquake.usgs.gov',
    path: '/fdsnws/event/1/query?format=geojson&longitude=-95.9057458&latitude=36.2135582&maxradius=1'
  };

  callback = function(response) {
    var data = '';
    response.on('data', function (chunk) {
      data += chunk;
    });

    response.on('end', function () {
      var obj = JSON.parse(data);

      if (obj.features[0] == 0) {
        return;
      }

      var props = obj.features[0].properties;
      var mag = 10 * props.mag;

      el.contract.pushVal.sendTransaction(mag, {
          to: el.options.contractAddress,
          from: el.options.walletAddress,
          gas: el.options.gas
        },
        function (err, result) {
          console.log('calling back', err, result);
        }
      );

      console.log('Pushing mag', mag.toString(16));
    });
  };

  http.request(options, callback).end();
};
