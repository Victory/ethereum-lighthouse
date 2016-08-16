var abi2js = (function () {
  /**
   *  Uses the abi object to create HTML Elements
   * @param abiInfo
   * @param $dom object {$interface: etc...}
   */
  var abiToHtml = function (abiInfo, $dom) {

    var $function;
    var descriptor;
    var input;
    var $input;
    var $form;
    var inputs;
    var abi = abiInfo.abi;
    var name = abiInfo.name;

    $dom.$interfaceTitle.text(name);
    $dom.$interface.css('display', 'block');

    abi = abi.sort(function (lhs, rhs) {
      return lhs.name > rhs.name;
    });

    for (kk in abi) {
      if (!abi.hasOwnProperty(kk)) {
        continue;
      }

      descriptor = abi[kk];

      if (descriptor.type === "function") {
        if (descriptor.name == abiInfo.name) {
          continue;
        }

        $function = $dom.$function.clone();
        $function.find(".functionName").text(descriptor.name);

        inputs = descriptor.inputs;
        for (jj in inputs) {
          if (!inputs.hasOwnProperty(jj)) {
            continue;
          }
          input = inputs[jj];
          $input = $dom.$input.clone();

          $input.find("input").attr('name', jj);
          $input.find("input").attr('placeholder', input.type);
          $input.find(".inputTitle").text(input.name + ":");
          $function.find(".inputList").append($input);
        }

        $form = $function.find("form");
        $form.attr('el-function-name', descriptor.name);
        $form.submit(function (evt) {
          evt.preventDefault();
          console.log($(this).serialize());
        });
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
      abi = JSON.parse(abi);
    } else {
      throw "getContract could not find contracts in obj"
    }

    return {
      name: key,
      abi: abi
    }
  };

  var getContractBin = function (obj) {
    var bin;
    var key;

    if (typeof obj.contracts !== "undefined") {
      key =  Object.keys(obj.contracts)[0];
      bin = obj.contracts[key].bin;
    } else {
      throw "getContract could not find contracts in obj"
    }

    return {
      name: key,
      bin: bin
    }
  }


  /**
   * Takes either a string that can be parsed with JSON.parse, or a object with obj.contracts
   * @param jsonFromParityOrDataFromParity string|object
   * @returns {{name, abi}}
   */
  var jsify = function (jsonFromParityOrDataFromParity) {
    if (typeof jsonFromParityOrDataFromParity === "string") {
      jsonFromParityOrDataFromParity = JSON.parse(jsonFromParityOrDataFromParity);
    }
    return {
      abiInfo: getContract(jsonFromParityOrDataFromParity),
      binInfo: getContractBin(jsonFromParityOrDataFromParity)
    };
  };

  var makeHtmlInterface = function(abiInfo) {
    var $interfaceTitle = $("#interfaceTitle");
    var $interface = $("#interface");
    var $tmp;

    $tmp = $("#inputPrototype");
    $tmp.removeAttr("id");
    var $input = $tmp.clone();
    $tmp.remove();

    $tmp = $("#functionPrototype");
    $tmp.removeAttr("id");
    var $function = $tmp.clone();
    $tmp.remove();

    abiToHtml(abiInfo, {
      $interface: $interface,
      $input: $input,
      $function: $function,
      $interfaceTitle: $interfaceTitle
    });
  };

  return {
    jsify: jsify,
    makeHtmlInterface: makeHtmlInterface
  }
}());

