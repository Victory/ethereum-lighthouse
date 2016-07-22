
contract abstract {}

contract TestContract is abstract {
  address owner;
  event SaidHello(string msg);

  function TestContract() {
    owner = msg.sender;
  }

  function helloWorld() returns (bytes32) {
    SaidHello("said it");
    return "hello world";
  }

  function noArgsNoReturns() {
  }

  function noArgsReturnString() returns (bytes32) {
    return "a string";
  }

  function () {
    throw;
  }

  function kill() {
    selfdestruct(owner);
  }
}