contract abstract {}

contract TestContract is abstract {
  address owner;
  string helloworld = "hello world";

  function TestContract() {
    owner = msg.sender;
  }

  function helloWorld() constant returns (string) {
    return helloworld;
  }

  function () {
    throw;
  }
  function kill() {
    selfdestruct(owner);
  }
}
