contract Pong {
  int32 curNum = 0;

  event SendingPong(int32);

  function getVal() public returns (int32) {
    curNum = curNum + 1;

    SendingPong(curNum);
    return curNum;
  }
}