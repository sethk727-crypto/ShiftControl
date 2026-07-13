const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf-8');

// Replace hero section
content = content.replace(
  /<h1>The Midnight Logbook Is Dead\.<\/h1>[\s\S]*?<a href="#signup" class="cta-button"[\s\S]*?>Request a Risk-Free 7-Day Pilot Run<\/a>/,
  `<h1>Stop Letting Administrative Chaos Eat Your Profits.</h1>
          <p>
            We build invisible backend systems that handle your paperwork and plug financial leaks automatically. You know the physical weight of locking the front doors after a brutal shift, only to sit in the back office chasing down missing employee timecards and arguing over register cash differences. We engineered these tools to ensure you make more money while taking back your personal freedom.
          </p>
          <a href="#signup" class="cta-button"
            >Request a Risk-Free 7-Day Pilot Run</a
          >`
);

// Insert Accelerator after hero section
if (!content.includes('<!-- DYNAMIC PROFIT ACCELERATOR -->')) {
  content = content.replace(
    /<\/section>\s*<!-- CONTROL CENTER TABS -->/,
    `</section>

    <!-- DYNAMIC PROFIT ACCELERATOR -->
    <section class="accelerator" id="accelerator">
      <div class="container">
        <h2>The Dynamic Profit Accelerator</h2>
        <div class="dashboard">
          <div class="dashboard-inputs">
             <label>Current Weekly Guest Count: <span id="guestCountVal">2500</span></label>
             <input type="range" id="guestCount" min="500" max="5000" step="50" value="2500">
             
             <label>Average Guest Bill Size: $<span id="billSizeVal">45</span></label>
             <input type="range" id="billSize" min="15" max="100" step="1" value="45">
          </div>
          <div class="dashboard-outputs">
             <div class="dash-card">
               <div class="dash-label">Missed Income Captured</div>
               <div class="dash-value text-neon" id="missedIncome">$0</div>
             </div>
             <div class="dash-card">
               <div class="dash-label">Wasted Labor Dollars Saved</div>
               <div class="dash-value text-neon" id="laborSaved">$0</div>
             </div>
             <div class="dash-card highlight">
               <div class="dash-label">Total Capital Reclaimed</div>
               <div class="dash-value text-neon" id="totalReclaimed">$0</div>
             </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CONTROL CENTER TABS -->`
  );
}

// Replace Tabs
content = content.replace(
  /<div class="tabs-nav">[\s\S]*?<div class="tab-content-container">/,
  `<div class="tabs-nav">
          <button class="tab-btn active" data-target="tab-1">
            [01 // Automated Marketing]
          </button>
          <button class="tab-btn" data-target="tab-2">
            [02 // Margin Protection]
          </button>
          <button class="tab-btn" data-target="tab-3">
            [03 // Hands-Free Closeouts]
          </button>
        </div>

        <div class="tab-content-container">`
);

fs.writeFileSync('index.html', content);
