const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf-8');

// Replace tab 1 content text
content = content.replace(
  /<div class="tab-panel active" id="tab-1">[\s\S]*?<div class="tab-demo">/,
  `<div class="tab-panel active" id="tab-1">
            <div class="tab-text">
              <p>
                The system automatically tracks when high-value guests haven't visited in a while and text messages them personalized rewards to bring them back. It brings in thousands in extra revenue completely hands-free.
              </p>
            </div>
            <div class="tab-demo">`
);

// Replace tab 2 content text
content = content.replace(
  /<div class="tab-panel" id="tab-2">[\s\S]*?<div class="tab-demo">/,
  `<div class="tab-panel" id="tab-2">
            <div class="tab-text">
              <p>
                The system automatically scans POS registers and schedules to instantly catch hidden cash shortages, inventory waste, and unapproved overtime before it drains your bank account.
              </p>
            </div>
            <div class="tab-demo">`
);

// Replace tab 3 content text
content = content.replace(
  /<div class="tab-panel" id="tab-3">[\s\S]*?<div class="tab-demo">/,
  `<div class="tab-panel" id="tab-3">
            <div class="tab-text">
              <p>
                Simply speak a 60-second voice note into your phone as you walk to your car at night. The system automatically structures it into a beautiful manager log and emails a crisp financial summary straight to your partners.
              </p>
            </div>
            <div class="tab-demo">`
);

// Remove tab 4, 5, 6
content = content.replace(/<div class="tab-panel" id="tab-4">[\s\S]*?<\/section>/, `</section>`);
// Above replace might be greedy or not greedy, let's just do it cleanly

fs.writeFileSync('index.html', content);
