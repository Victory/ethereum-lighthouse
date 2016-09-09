module.exports.flow = function (el) {
  // simulate a long running process
  setTimeout(function () {
    // XXX: only works on first call because of method can't be called twice on resolved
    console.log('finished');
    el.done(true);
  }, 3000);

  console.log('running flow');
};