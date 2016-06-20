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

  event GaveNumber(address indexed sender, bytes32 msg);

  function RandomLighthouse () {
    curTic = 0;
    owned;
  }

  function getUniformPositiveInt () returns(uint32) {
    GaveNumber(msg.sender, "Gave number");
    return uniformPositive;
  }

  function setUniformPositiveInt (uint32 val) forOwner {
    uniformPositive = val;
    curTic += 1;

  }

  function withdraw() {
    if (msg.sender == owner) {
      owner.send(balance/2);
    }
  }
}
