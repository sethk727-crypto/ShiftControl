const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf-8');

const jsCode = `
      // Dynamic Profit Accelerator Logic
      const guestCountSlider = document.getElementById('guestCount');
      const billSizeSlider = document.getElementById('billSize');
      const guestCountVal = document.getElementById('guestCountVal');
      const billSizeVal = document.getElementById('billSizeVal');
      const missedIncomeEl = document.getElementById('missedIncome');
      const laborSavedEl = document.getElementById('laborSaved');
      const totalReclaimedEl = document.getElementById('totalReclaimed');

      function calculateProfits() {
        if(!guestCountSlider) return;
        const guests = parseInt(guestCountSlider.value);
        const billSize = parseInt(billSizeSlider.value);

        guestCountVal.textContent = guests.toLocaleString();
        billSizeVal.textContent = billSize;

        // Arbitrary business logic for the sake of the demo
        const weeklyRev = guests * billSize;
        const missedIncome = weeklyRev * 0.18; // ~18% bump from retention
        const laborSaved = guests * 0.5; // ~$0.50 saved per guest in error catching

        const totalReclaimed = missedIncome + laborSaved;

        animateValue(missedIncomeEl, missedIncome);
        animateValue(laborSavedEl, laborSaved);
        animateValue(totalReclaimedEl, totalReclaimed);
      }

      function animateValue(obj, end) {
        // Quick visual update
        obj.textContent = '$' + Math.round(end).toLocaleString();
      }

      if (guestCountSlider && billSizeSlider) {
        guestCountSlider.addEventListener('input', calculateProfits);
        billSizeSlider.addEventListener('input', calculateProfits);
        calculateProfits();
      }
`;

content = content.replace('// Form Submission Logic', jsCode + '\n      // Form Submission Logic');
fs.writeFileSync('index.html', content);
