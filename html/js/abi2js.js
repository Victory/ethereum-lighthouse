/**
 *  Uses the abi object to create HTML Elements
 * @param abi
 * @param $dom {$interface: etc...}
 */
var abiToHtml = function (abi, $dom) {

  console.log($dom);

  $dom.$interface.css('display', 'block');

  var $function;

  console.log(abi);
  var descriptor;
  var input;
  var $input;

  for (kk in abi) {
    if (abi.isPrototypeOf(kk)) {
      continue;
    }
    descriptor = abi[kk];

    if (descriptor.type === "function") {
      console.log(descriptor.name);
      $function = $dom.$function.clone();
      $function.find(".functionName").text(descriptor.name);

      for (jj in descriptor.inputs) {
        if (descriptor.inputs.isPrototypeOf[jj]) {
          continue;
        }
        input = descriptor.inputs[jj];
        $input = $dom.$input.clone();
        console.log($input, input, input.name);

        $input.find("input").attr('placeholder', input.type);
        $input.find(".inputTitle").text(input.name + ":");
        $function.find(".inputList").append($input);
      }

      $dom.$interface.append($function);
    }
  }

};

var getContract = function(obj) {
  var abi;
  var key;

  if (typeof obj.contracts !== "undefined") {
    key =  Object.keys(obj.contracts)[0];
    abi = obj.contracts[key].abi;
    var abi = JSON.parse(abi);
  } else {
  }

  return {
    name: key,
    abi: abi
  }
};

var jsify = function (jsonFromParity) {
  var abiObj = JSON.parse(jsonFromParity);
  return getContract(abiObj);
};

var makeHtmlInterface = function(abiInfo) {
  var $interfaceTitle = $("#interfaceTitle");
  var $interface = $("#interface");
  var $tmp;

  $tmp = $("#inputPrototype");
  $tmp.attr("id", "");
  var $input = $tmp.clone();
  $tmp.remove();

  $tmp = $("#functionPrototype");
  $tmp.attr("id", "");
  var $function = $tmp.clone();
  $tmp.remove();

  $interfaceTitle.text(abiInfo.name);
  abiToHtml(abiInfo.abi, {
    $interface: $interface,
    $input: $input,
    $function: $function
  });
};
