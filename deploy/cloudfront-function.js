// CloudFront Function (runtime cloudfront-js-2.0), attached to viewer-request.
//
// Astro builds each page as a folder with an index.html (dist/about/index.html), but
// CloudFront only serves index.html for the site root. This maps clean URLs to those files:
//   /about        -> /about/index.html
//   /about/       -> /about/index.html
//   /projects/x/  -> /projects/x/index.html
// Files with an extension (/_astro/app.css, /favicon.svg, /brochures/x.pdf) pass through.
// Query strings are left alone, so /projects?type=residential keeps working.
//
// Keep this file in sync with the inline copy in cloudfront.yaml.

function handler(event) {
  var request = event.request;
  var uri = request.uri;

  if (uri.endsWith('/')) {
    request.uri = uri + 'index.html';
  } else if (uri.substring(uri.lastIndexOf('/') + 1).indexOf('.') === -1) {
    request.uri = uri + '/index.html';
  }

  return request;
}
