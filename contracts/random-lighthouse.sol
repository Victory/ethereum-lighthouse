contract abstract {}

contract owned is abstract {
  address owner;
  function owned () {
    owner = msg.sender;
 }
  function changeOwner (address newOwner) forOwner {
    owner = newOwner;
  }
  modifier forOwner (){
    if (msg.sender==owner) _
  }
}

contract RandomLighthouse is owned {
  uint32 uniformPositive;
  uint32 curTic;
  address owner;
  uint balance;

  address[] waitingUniformPositiveInt;

  function RandomLighthouse () {
    curTic = 0;
    owned;
  }

  function subscribeToNextUniformPositiveInt () returns (uint32) {
    waitingUniformPositiveInt.push(msg.sender);
  }

  function getUniformPositiveInt () returns(uint32) {
    return uniformPositive;
  }

  function setUniformPositiveInt (uint32 val) forOwner {
    uniformPositive = val;
    curTic += 1;
  }

  function withdrawl() {
    if (msg.sender != owner) throw;
    owner.send(balance/2);
  }
}