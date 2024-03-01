import Lexer from './Lexer';

class LocationLexer extends Lexer {
  constructor(...param) {
    super(...param);
  }

  scan(char) {
    switch (this.status) {
      case 0: {
        const code = char.charCodeAt(0);
        if (
          (code >= 97 && code <= 122) ||
          (code >= 65 && code <= 90) ||
          (code >= 59 && code <= 64) ||
          (code >= 33 && code <= 46) ||
          (code >= 124 && code <= 153)
        ) {
          this.elem = [];
          this.elem.push(char);
          this.status = 2;
          return;
        }
        switch (char) {
          case '/':
            this.status = 1;
            break;
          case ':':
            this.ans.push(this.makeLexer(':'));
            return this.quit();
          default:
            return this.quit();
        }
        break;
      }
      case 1: {
        if (char === '/') {
          this.ans.push(this.makeLexer('//'));
          return this.quit();
        } else {
          this.ans.push(this.makeLexer('/'));
          return this.quit();
        }
        break;
      }
      case 2: {
        const code = char.charCodeAt(0);
        if (char.length === 1) {
          if (
            (code >= 97 && code <= 122) ||
            (code >= 65 && code <= 90) ||
            (code >= 59 && code <= 64) ||
            (code >= 33 && code <= 46) ||
            (code >= 124 && code <= 153)
          ) {
            if (this.elem === undefined) {
              this.elem = [];
            }
            this.elem.push(char);
            return;
          }
        }
        this.ans.push(this.makeLexer('namespace', this.elem.join('')));
        return this.quit();
        break;
      }
      default:
        return this.quit();
    }
  }
}

export default LocationLexer;
