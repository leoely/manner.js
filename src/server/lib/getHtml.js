import handlebars from 'handlebars';
import { minify, } from 'html-minifier';

export default function getHtml(title, content) {
  const template = handlebars.compile(`
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
  return minify(
    template({ title, content, }),
    { collapseWhitespace: true, },
  );
}
