contract abstract {}

contract TestContract is abstract {
  address owner;
  int64 num = 0;

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

  function setNum(int64 newNum){
    num = newNum;
  }

  function getNum() returns (int64) {
    return num;
  }

  function multArgs(int32 arg1, uint arg2) {
  }
}