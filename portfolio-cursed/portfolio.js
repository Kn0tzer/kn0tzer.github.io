import { Main } from './Background/src/main.js';

// ===== Initialize Ocean Background =====
(async () => {
    const APP = new Main();
    await APP.Initialize();
    
    const loader = document.getElementById('loading-screen');
    const skipBtn = document.getElementById('skip-loading');
    
    let loaderTimeout = setTimeout(() => {
        if (loader) {
            loader.classList.add('hidden');
        }
    }, 2500);

    if (skipBtn) {
        skipBtn.addEventListener('click', () => {
            clearTimeout(loaderTimeout);
            if (loader) {
                loader.classList.add('hidden');
            }
        });
    }
})();


// ===== Scroll & Navigation =====
const scrollInner = document.getElementById('scroll-inner');
const navDots = document.querySelectorAll('.nav-dot');
const sections = document.querySelectorAll('.snap-section');
const heroLinks = document.getElementById('hero-links');

let currentSection = 0;
let isScrolling = false;

function updateNavDots(index) {
    navDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

function updateHeroLinks(index) {
    if (index > 0) {
        heroLinks.classList.add('hidden');
    } else {
        heroLinks.classList.remove('hidden');
    }
}

function updateVisibleElements(index) {
    // Hero content & scroll indicator
    const heroContent = document.querySelector('.hero-content');
    const scrollInd = document.querySelector('.scroll-indicator');
    if (index > 0) {
        if (heroContent) heroContent.classList.add('fade-out');
        if (scrollInd) scrollInd.classList.add('fade-out');
    } else {
        if (heroContent) heroContent.classList.remove('fade-out');
        if (scrollInd) scrollInd.classList.remove('fade-out');
    }

    // Project cards
    const cards = document.querySelectorAll('.glass-card');
    cards.forEach(card => {
        if (index === 1) {
            card.classList.add('visible');
        } else {
            card.classList.remove('visible');
        }
    });

    // Experience panels
    const panels = document.querySelectorAll('.glass-panel');
    panels.forEach(panel => {
        if (index === 2) {
            panel.classList.add('visible');
        } else {
            panel.classList.remove('visible');
        }
    });
}

function goToSection(index) {
    if (index < 0 || index >= sections.length) return;
    
    currentSection = index;
    scrollInner.style.transform = `translateY(-${index * 100}vh)`;
    
    updateNavDots(currentSection);
    updateHeroLinks(currentSection);
    updateVisibleElements(currentSection);
    
    isScrolling = true;
    setTimeout(() => {
        isScrolling = false;
    }, 1200); // Wait for the 1.2s CSS transition to finish
}

// Intercept Wheel
window.addEventListener('wheel', (e) => {
    if (isScrolling) return;
    if (e.deltaY > 0) {
        goToSection(currentSection + 1);
    } else if (e.deltaY < 0) {
        goToSection(currentSection - 1);
    }
}, { passive: false });

// Intercept Touch
let touchStartY = 0;
window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
}, { passive: false });

window.addEventListener('touchend', (e) => {
    if (isScrolling) return;
    const touchEndY = e.changedTouches[0].clientY;
    const delta = touchStartY - touchEndY;
    
    if (delta > 50) {
        goToSection(currentSection + 1);
    } else if (delta < -50) {
        goToSection(currentSection - 1);
    }
});

// Click nav dots to scroll
navDots.forEach(dot => {
    dot.addEventListener('click', () => {
        const section = parseInt(dot.dataset.section);
        goToSection(section);
    });
});

// ===== Email Copy =====
window.copyEmail = function () {
    const email = "kn3tzer@gmail.com";
    navigator.clipboard.writeText(email).then(() => {
        const toast = document.getElementById('toast');
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
    }).catch((err) => {
        alert("Failed to copy kn3tzer@gmail.com: " + err);
    });
};

// ===== Initial state =====
updateVisibleElements(0);
