contract abstract {}

contract TestContract is abstract {
  address owner;
  int64 num = 0;
  int32 varInt32 = 0;
  uint varUint = 0;

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

  function multiArgs(int32 arg1, uint arg2) {
    varInt32 = arg1;
    varUint = arg2;
  }

  function getVarInt32() returns (int32) {
    return varInt32;
  }

  function getVarUint() returns (uint) {
    return varUint;
  }
}