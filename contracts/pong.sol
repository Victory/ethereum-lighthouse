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