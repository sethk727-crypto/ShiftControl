// 1. SCROLL REVEAL OBSERVER (KINESTHETIC PACING)
const revealElements = document.querySelectorAll('.reveal');
const revealOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };

const revealOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
    });
}, revealOptions);

revealElements.forEach(el => revealOnScroll.observe(el));

// 2. NAVBAR BLUR ON SCROLL (Optimized with requestAnimationFrame consideration)
let lastScrollY = window.scrollY;
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 50) { 
        nav.classList.add('scrolled'); 
    } else { 
        nav.classList.remove('scrolled'); 
    }
    lastScrollY = window.scrollY;
}, { passive: true }); // Passive listener for better scroll performance

// 3. MAGNETIC BUTTON PHYSICS (Stutter-Free & GPU Accelerated)
const magneticButtons = document.querySelectorAll('.cta-button');
magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        // Remove snap-back transition while moving to prevent stutter
        btn.classList.remove('magnetic-snap'); 
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        // translate3d forces hardware acceleration
        btn.style.transform = `translate3d(${x * 0.2}px, ${y * 0.2}px, 0) scale(1.02)`;
    });
    btn.addEventListener('mouseleave', () => {
        // Re-add the transition class for a smooth return to origin
        btn.classList.add('magnetic-snap');
        btn.style.transform = `translate3d(0px, 0px, 0) scale(1)`;
    });
});

// 4. 3D CARD HOVER TRACKING (DYNAMIC LIGHTING)
function handleHover(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
}
function resetHover(e) {
    e.currentTarget.style.transform = 'translate3d(0, 0, 0) rotateX(0) rotateY(0)';
}

// 5. THE MAGIC TRICK: AI SIMULATION ENGINE (Reflow Optimized)
const voiceNoteText = '"Uhh yeah, Jake stayed an extra hour closing, register 2 is short 14.50, and we are critically low on napkins for tomorrow..."';
let typeIndex = 0;
const typeTarget = document.getElementById('typed-voice');
const scanLine = document.getElementById('scan-line');
const jsonOutput = document.getElementById('json-output');

function runSimulation() {
    typeTarget.textContent = ''; // textContent is faster and safer than innerHTML
    jsonOutput.classList.remove('visible');
    scanLine.classList.remove('active');
    typeIndex = 0;
    typeWriter();
}

function typeWriter() {
    if (typeIndex < voiceNoteText.length) {
        typeTarget.textContent += voiceNoteText.charAt(typeIndex);
        typeIndex++;
        setTimeout(typeWriter, Math.random() * 35 + 15); // Slightly tightened pacing
    } else {
        setTimeout(() => {
            scanLine.classList.add('active'); // Trigger NLP scan line
            setTimeout(() => {
                jsonOutput.classList.add('visible'); // Reveal structured JSON
                setTimeout(runSimulation, 6000); // Loop simulation
            }, 1000);
        }, 500);
    }
}
// Start simulation after a brief delay
setTimeout(runSimulation, 1500);

// 6. FRICTIONLESS FORM SUBMISSION STATE
function submitForm(e) {
    e.preventDefault();
    const form = document.getElementById('lead-form');
    const btn = form.querySelector('.cta-button');
    const originalText = btn.innerHTML;
    
    btn.innerHTML = 'Processing...';
    btn.style.opacity = '0.7';
    btn.style.pointerEvents = 'none'; // Prevent double-clicking
    
    // Simulate API Call
    setTimeout(() => {
        document.getElementById('success-state').classList.add('active');
        btn.innerHTML = originalText;
        btn.style.opacity = '1';
        btn.style.pointerEvents = 'all';
    }, 1200);
}
