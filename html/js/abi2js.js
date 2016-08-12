/*
var abi2js = function (abi) {
  var obj = {
    functions: []
  };
  for (kk in abi) {
    if (abi.isPrototypeOf(kk)) {
      continue;
    }

    if (type === "function") {
      obj['functions'] = {

      };
    }
  }
};
*/

var getContractAbi = function(obj) {
  var abi;
  if (typeof obj.contracts !== "undefined") {
    var key =  Object.keys(obj.contracts)[0];
    abi = obj.contracts[key].abi;
    var abi = JSON.parse(abi);
    console.log(abi[0]);
  } else {
  }

  return abi;
};

var jsify = function (abiJSON) {
  var abiObj = JSON.parse(abiJSON);
  var contract = getContractAbi(abiObj);
  console.log(contract);
};
