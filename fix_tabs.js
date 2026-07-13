const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf-8');

// I will just use string splitting and replacing to be safe
let parts = content.split('<!-- REALITY COMPARE GRID -->');
let topPart = parts[0];
let bottomPart = parts[1];

let tab3End = topPart.indexOf('<div class="tab-panel" id="tab-4">');
if (tab3End !== -1) {
    topPart = topPart.substring(0, tab3End) + "        </div>\n      </div>\n    </section>\n\n    ";
} else {
    // If syntax error, it means we replaced too much.
    // Let's restore from git or just fix it.
}

content = topPart + '<!-- REALITY COMPARE GRID -->' + bottomPart;
fs.writeFileSync('index.html', content);
