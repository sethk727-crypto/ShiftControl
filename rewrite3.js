const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf-8');

// Replace Compare Section
content = content.replace(
  /<section class="compare-section" id="compare">[\s\S]*?<\/section>/,
  `<section class="compare-section" id="compare">
      <div class="container">
        <h2>The Upgrade</h2>
        <div class="compare-grid">
          <div class="compare-col">
            <div class="compare-header">The Cash Leak Nightmare</div>
            <ul class="compare-list">
              <li>Missing employee timecards</li>
              <li>Fighting register variances</li>
              <li>Lost repeat guests</li>
              <li>Exhausting late-night administrative work</li>
            </ul>
          </div>
          <div class="compare-col highlight">
            <div class="compare-header">The ShiftControl Reality</div>
            <ul class="compare-list">
              <li>Automated Roster Syncing</li>
              <li>Instant Leak Detection</li>
              <li>Behavior-Triggered Loyalty Loops</li>
              <li>Voice-to-Text Closeouts</li>
            </ul>
          </div>
        </div>
      </div>
    </section>`
);

// Replace About Section
content = content.replace(
  /<section class="about-section" id="about">[\s\S]*?<\/section>/,
  `<section class="about-section" id="about">
      <div class="container">
        <div class="about-content">
          <h2>Engineered by Operators. Built for Freedom.</h2>
          <p>
            We didn't learn the hospitality business in a boardroom. We spent years working on the chaotic, busy floors of live bars, restaurants, and venues. We know exactly how brutal it is to sit down to a mountain of administrative paperwork at 2:00 AM after an exhausting 14-hour shift.
          </p>
          <p>
            We aren't tech nerds—we're operators who built a system to buy business owners their lives back. We built this system because we know firsthand the pain of watching hard-earned profit slip through the cracks of a fragmented business. ShiftControl was engineered to ensure independent operators make more money while taking back their personal freedom.
          </p>
        </div>
      </div>
    </section>`
);

// Replace Signup Section
content = content.replace(
  /<section class="signup-section" id="signup">[\s\S]*?<\/section>/,
  `<section class="signup-section" id="signup">
      <div class="container">
        <h2>Ready to reclaim your time?</h2>

        <div class="form-wrapper">
          <div class="form-success" id="success-message">
            <div class="success-icon">✓</div>
            <h3 style="margin-bottom: 10px">Protocol Initiated.</h3>
            <p style="color: var(--text-muted)">
              Our lead architect will text you shortly.
            </p>
          </div>

          <form id="pilot-form">
            <div class="input-group">
              <input type="text" placeholder="Your Name" required />
            </div>
            <div class="input-group">
              <input
                type="text"
                placeholder="Venue Name (e.g., Champs)"
                required
              />
            </div>
            <div class="input-group">
              <input type="tel" placeholder="Mobile Number" required />
            </div>
            <button type="submit" class="cta-button" style="width: 100%">
              Initiate Protocol
            </button>
          </form>

          <div class="guardrail">
            Zero setup fees. Zero system risk. If the system doesn't buy you back five hours of your life and uncover hidden revenue this week, we turn it off and it costs you nothing.
          </div>
        </div>
      </div>
    </section>`
);

fs.writeFileSync('index.html', content);
