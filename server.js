const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.disable('x-powered-by');

app.use(
  express.static(path.join(__dirname), {
    extensions: ['html'],
    setHeaders(res, filePath) {
      // Immutable-ish caching for static assets; HTML always revalidates
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache');
      } else {
        res.setHeader('Cache-Control', 'public, max-age=86400');
      }
    },
  })
);

// security.txt (express.static ignores dotfile paths by default)
app.get(['/.well-known/security.txt', '/security.txt'], (req, res) => {
  res.type('text/plain').sendFile(path.join(__dirname, 'security.txt'));
});

// Branded 404 for any route the static handler didn't resolve
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '404.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`SK ShiftControl serving on port ${port}`);
});
