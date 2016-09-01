contract Pong {
  int32 curNum = 0;
  int32 pushedVal;

  event SendingPong(int32);
  event SendingClock(string);
  event ValPushed(int32);
  event ValPulled(int32);

  function getVal() public returns (int32) {
    curNum = curNum + 1;

    SendingPong(curNum);
    return curNum;
  }

  function getClock() public returns (string) {
    if (curNum % 2 == 0)  {
      SendingClock("mod 2");
      return "mod 2";
    } else {
      SendingClock("NOT mod 2");
      return "NOT mod 2";
    }
  }

  function pushVal(int32 val) {
    pushedVal = val;
    ValPushed(val);
  }

  function pullVal() public returns (int32) {
    ValPulled(pushedVal);
    return pushedVal;
  }
}

contract Ping is Pong {
  int8 pongVal;
  Pong pong;

  address owner;

  event GotPong(int32);
  event PongAddressSet(address);
  event GotPushedVal(int32);

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

  function broadcasePushed() {
    GotPushedVal(pong.pullVal());
  }

  function kill() {
    selfdestruct(owner);
  }
}