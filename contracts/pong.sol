contract Pong {
  int32 curNum = 0;

  event SendingPong(int32);
  event SendingClock(string);

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
}