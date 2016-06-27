contract abstract {}

contract TestContract is abstract {
  address owner;

  function TestContract() {
    owner = msg.sender;
  }

  function helloWorld() returns (bytes32) {
    return "hello world";
  }

  function () {
    throw;
  }
  function kill() {
    selfdestruct(owner);
  }
}
