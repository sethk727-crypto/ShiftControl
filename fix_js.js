const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf-8');

// The messed up part
let regex = /animateValue\(obj, end\) \{\s*\/\/\s*Quick visual update\s*obj\.textContent = '[\s\S]*?const pilotForm/;

let replacementText = `animateValue(obj, end) {
        // Quick visual update
        obj.textContent = '$' + Math.round(end).toLocaleString();
      }

      if (guestCountSlider && billSizeSlider) {
        guestCountSlider.addEventListener('input', calculateProfits);
        billSizeSlider.addEventListener('input', calculateProfits);
        calculateProfits();
      }

      // Form Submission Logic
      const pilotForm`;

// To avoid replace special pattern `$'`, use a function for replacement
content = content.replace(regex, () => replacementText);
fs.writeFileSync('index.html', content);
