const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf-8');
const endIdx = content.indexOf('</html>');
if (endIdx !== -1) {
    content = content.substring(0, endIdx + 7) + '\n';
}
fs.writeFileSync('index.html', content);
