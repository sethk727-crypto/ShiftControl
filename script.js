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

// 2. NAVBAR BLUR ON SCROLL
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 50) { nav.classList.add('scrolled'); } 
    else { nav.classList.remove('scrolled'); }
});

// 3. MAGNETIC BUTTON PHYSICS
const magneticButtons = document.querySelectorAll('.cta-button');
magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) scale(1.02)`;
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = `translate(0px, 0px) scale(1)`;
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
    e.currentTarget.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
}

// 5. THE MAGIC TRICK: AI SIMULATION ENGINE
const voiceNoteText = '"Uhh yeah, Jake stayed an extra hour closing, register 2 is short 14.50, and we are critically low on napkins for tomorrow..."';
let typeIndex = 0;
const typeTarget = document.getElementById('typed-voice');
const scanLine = document.getElementById('scan-line');
const jsonOutput = document.getElementById('json-output');

function runSimulation() {
    typeTarget.innerHTML = '';
    jsonOutput.classList.remove('visible');
    scanLine.classList.remove('active');
    typeIndex = 0;
    typeWriter();
}

function typeWriter() {
    if (typeIndex < voiceNoteText.length) {
        typeTarget.innerHTML += voiceNoteText.charAt(typeIndex);
        typeIndex++;
        setTimeout(typeWriter, Math.random() * 40 + 20); // Variable typing speed for realism
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
    btn.innerHTML = 'Processing...';
    btn.style.opacity = '0.7';
    
    // Simulate API Call
    setTimeout(() => {
        document.getElementById('success-state').classList.add('active');
    }, 1200);
}
