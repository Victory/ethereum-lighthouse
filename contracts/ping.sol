contract Pong {
  int32 curNum = 0;

  event SendingPong(int32);

  function getVal() public returns (int32) {
    curNum = curNum + 1;

    SendingPong(curNum);
    return curNum;
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