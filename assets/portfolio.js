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

        const ocean = window.oceanBackground;
        if (ocean?.skyboxRenderer) {
            const dirs = {
                0: [0, 0, -1],
                1: [0, -1, 0],
                2: [0, 0, 1]
            };
            ocean.skyboxRenderer.setTargetSunDirection(dirs[index] || [0, 0, -1]);
        }

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

class LoadingScreen {
    constructor() {
        this.loader = document.getElementById("loading-screen");
        this.skipBtn = document.getElementById("skip-loading");
        this.init();
    }

    init() {
        let timeout = setTimeout(() => this.hide(), 2500);

        this.skipBtn?.addEventListener("click", () => {
            clearTimeout(timeout);
            this.hide();
        });
    }

    hide() {
        this.loader?.classList.add("hidden");
    }
}

async function initOcean(canvas) {
    const { OceanBackground } = await import("./ocean.js");
    const ocean = new OceanBackground(canvas);
    await ocean.init();
    ocean.start();

    window.addEventListener("resize", () => ocean.resize());
    window.oceanBackground = ocean;
}

(async () => {
    const canvas = document.getElementById("ocean-canvas");
    if (canvas) await initOcean(canvas);

    new LoadingScreen();
    new SectionNavigator();
})();