const Web3 = require("web3");
const el = require(__dirname + "/lib/setup.js");
const lightHouse = require(el.options.require);

var web3 = new Web3(new Web3.providers.HttpProvider(el.options.rpcEndpoint));
var eth = web3.eth;

var abiContract = eth.contract(el.options.abi);
var contract = abiContract.at(el.options.contractAddress);

el.contract = contract;
el.web3 = web3;
el.eth = eth;

lightHouse.updateLighthouse(el);
//console.log("lighthouse", el.options);