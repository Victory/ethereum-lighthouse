contract Pong {
  function getVal() public returns (int32) {
  }
}

contract Ping is Pong {
  int8 pongVal;
  Pong pong;

  event GotPong(int32);

  function setPongAddress (Pong pongAddress) {
    pong = pongAddress;
  }

  function broadcastPong() {
    GotPong(pong.getVal());
  }

  function kill() {
    selfdestruct(owner);
  }
}