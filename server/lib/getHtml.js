"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getHtml;
var _handlebars = _interopRequireDefault(require("handlebars"));
var _htmlMinifier = require("html-minifier");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function getHtml(title, content) {
  const template = _handlebars.default.compile(`
    <!doctype html>
    <html lang="en">
    <head>
    <meta charset="utf-8" />
    <title>{{title}}</title>
    <meta name="description" content="{{content}}" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    </head>
    <body>
    <main id="root"></main>
    <script src="main.bundle.js"></script>
    </body>
    </html>
  `);
  return (0, _htmlMinifier.minify)(template({
    title,
    content
  }), {
    collapseWhitespace: true
  });
}