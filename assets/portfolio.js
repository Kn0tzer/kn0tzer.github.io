const EMAIL = "kn3tzer@gmail.com";

function copyEmail() {
    navigator.clipboard.writeText(EMAIL).then(() => {
        const toast = document.getElementById("toast");
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 2500);
    }).catch(() => {
        alert(`Failed to copy ${EMAIL}`);
    });
}

window.copyEmail = copyEmail;

class SectionNavigator {
    constructor() {
        this.scrollInner = document.getElementById("scroll-inner");
        this.navDots = document.querySelectorAll(".nav-dot");
        this.sections = document.querySelectorAll(".snap-section");
        this.heroLinks = document.getElementById("hero-links");
        this.currentSection = 0;
        this.isScrolling = false;

        this.init();
    }

    init() {
        this.navDots.forEach(dot => {
            dot.addEventListener("click", () => {
                this.goToSection(parseInt(dot.dataset.section));
            });
        });

        window.addEventListener("wheel", (e) => {
            if (this.isScrolling) return;
            if (e.deltaY > 0) this.goToSection(this.currentSection + 1);
            else if (e.deltaY < 0) this.goToSection(this.currentSection - 1);
        }, { passive: false });

        let touchStartY = 0;
        window.addEventListener("touchstart", (e) => {
            touchStartY = e.touches[0].clientY;
        }, { passive: false });

        window.addEventListener("touchend", (e) => {
            if (this.isScrolling) return;
            const delta = touchStartY - e.changedTouches[0].clientY;
            if (delta > 50) this.goToSection(this.currentSection + 1);
            else if (delta < -50) this.goToSection(this.currentSection - 1);
        });

        this.updateVisibleElements(0);
    }

    goToSection(index) {
        if (index < 0 || index >= this.sections.length) return;

        this.currentSection = index;
        this.scrollInner.style.transform = `translateY(-${index * 100}vh)`;

        this.updateNavDots(index);
        this.updateHeroLinks(index);
        this.updateVisibleElements(index);

        this.isScrolling = true;
        setTimeout(() => this.isScrolling = false, 1200);
    }

    updateNavDots(index) {
        this.navDots.forEach((dot, i) => {
            dot.classList.toggle("active", i === index);
        });
    }

    updateHeroLinks(index) {
        this.heroLinks.classList.toggle("hidden", index > 0);
    }

    updateVisibleElements(index) {
        const heroContent = document.querySelector(".hero-content");
        const scrollInd = document.querySelector(".scroll-indicator");

        if (heroContent) heroContent.classList.toggle("fade-out", index > 0);
        if (scrollInd) scrollInd.classList.toggle("fade-out", index > 0);

        document.querySelectorAll(".glass-card").forEach(card => {
            card.classList.toggle("visible", index === 1);
        });

        document.querySelectorAll(".glass-panel").forEach(panel => {
            panel.classList.toggle("visible", index === 2);
        });
    }
}

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

async function initCarbonFiber(canvas) {
    const dp = window.devicePixelRatio || 1.0;

    function resize() {
        canvas.width = window.innerWidth * dp;
        canvas.height = window.innerHeight * dp;
    }

    resize();
    window.addEventListener('resize', resize);

    const [normalImg, materialImg] = await Promise.all([
        loadImage('assets/gfx/carbon/normal.png'),
        loadImage('assets/gfx/carbon/material.png')
    ]);

    const lights = normalmap({
        canvas: canvas,
        normalMap: normalImg,
        materialMap: materialImg,
        metalness: 0.5,
        roughness: 0.8,
        baseColor: normalmap.vec3(0.0001, 0.0001, 0.0002),
        singlePass: true,
        repeat: true
    });

    const lightColor = normalmap.vec3(0.2, 0.2, 0.2);
    const lightPos = new Float32Array(3);
    const zOffset = 2;

    function renderLight(x, y) {
        lightPos[0] = x / window.innerWidth;
        lightPos[1] = y / window.innerHeight;
        lightPos[2] = zOffset;
        lights.addPointLight(lightPos, lightColor);
        lights.render();
    }

    document.addEventListener('mousemove', function(e) {
        renderLight(e.clientX, e.clientY);
    });

    document.addEventListener('touchmove', function(e) {
        const t = e.touches[0];
        renderLight(t.clientX, t.clientY);
    }, { passive: true });

    renderLight(window.innerWidth * 0.25, window.innerHeight * 0.1);
}

(async () => {
    const canvas = document.getElementById("carbon-canvas");
    if (canvas) await initCarbonFiber(canvas);

    new SectionNavigator();
})();