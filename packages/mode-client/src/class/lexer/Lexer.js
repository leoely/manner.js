class Lexer {
  constructor(highLight, ans, j) {
    this.highLight = highLight;
    this.ans = ans;
    this.j = j;
    this.status = 0;
  }

  setIndex(i) {
    this.i = i;
  }

  makeLexer(type, elem) {
    let ans;
    if (elem !== undefined) {
      ans = { type, elem, };
    } else {
      ans = { type, };
    }
    return ans;
  }

  quit() {
    if (this.i !== undefined) {
      this.highLight.ins[this.i] = undefined;
    }
    return false;
  }
}

export default Lexer;
