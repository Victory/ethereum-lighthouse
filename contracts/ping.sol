contract Pong {
  function getVal() public returns (int32) {
  }
}

contract Ping is Pong {
  int8 pongVal;
  Pong pong;

  address owner;

  event GotPong(int32);
  event PongAddressSet(address);

  function Ping() {
    owner = msg.sender;
  }

  function setPongAddress (Pong pongAddress) {
    pong = pongAddress;
    PongAddressSet(pongAddress);
  }

  function broadcastPong() {
    GotPong(pong.getVal());
  }

  function kill() {
    selfdestruct(owner);
  }
}