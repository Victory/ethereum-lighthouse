const fs = require('fs');
const path = require('path');

var configPath = process.argv[2];

var usage = function (err) {
  if (typeof err !== "undefined") {
    console.error(err);
  }
  var basename = path.basename(process.argv[1]);

  console.log("Usage: \n" +
    `  ${basename} CONFIGFILE\n\n` +
    "Example:\n" +
    `  ${basename} config/lighthouse.conf`);

  process.exit(1);
};

if (typeof configPath === "undefined") {
  usage("Error: Config file not set.");
}

var spinalToCamel = function (spinal) {
  var bits = spinal.split("-");
  var camel = bits[0];
  bits.slice(1).map(function (vv) {
    camel += vv[0].toUpperCase() + vv.slice(1);
  });
  return camel;
};

var readConfig = function () {
  var configFile = fs.readFileSync(configPath, 'UTF-8');
  var lines = configFile.split(/\r?\n/);
  var config = {};
  var ln;
  var bits;
  var key;
  var value;

  for (ii in lines) {
    if (!lines.hasOwnProperty(ii)) {
      continue;
    }
    ln = lines[ii].trim();
    if (ln[0] == "#" || ln.length === 0) {
      continue;
    }
    bits = ln.split("=");
    key = spinalToCamel(bits[0].trim());
    value = bits.splice(1).join("").trim();

    if (key === "abi") {
      config[key] = JSON.parse(value);
    } else if (key === "require") {
      if (value[0] !== "/") {
        config[key] = path.join(__dirname, '..', 'beacons', value);
      } else {
        config[key] = value;
      }
    } else {
      config[key] = value;
    }
  }

  return config;
};

console.log("Using config file: " + configPath);

module.exports.options = readConfig();
