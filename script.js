// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const navLinks = document.getElementById("navLinks");

mobileMenuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});

document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("active");
    });
});

const dropdownToggle = document.querySelector(".dropdown-toggle");
const dropdown = document.querySelector(".dropdown");

if (dropdownToggle && dropdown) {
    dropdownToggle.addEventListener("click", (e) => {
        e.preventDefault();
        dropdown.classList.toggle("open");
    });
    document.addEventListener("click", (e) => {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove("open");
        }
    });
}
// Scroll Animation
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));

const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hero = document.querySelector(".hero");
const heroContent = document.querySelector(".hero-content");
let ticking = false;

function onScrollParallax() {
    if (ticking || prefersReduced || !hero) return;
    ticking = true;
    requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        const offset = Math.min(Math.max(rect.top, -window.innerHeight), window.innerHeight);
        const translate = offset * -0.05;
        if (heroContent) {
            heroContent.style.transform = `translateY(${translate}px)`;
        }
        ticking = false;
    });
}

window.addEventListener("scroll", onScrollParallax, { passive: true });

const canvas = document.getElementById("particleCanvas");
let ctx = null;
let particles = [];
let animating = false;
let rafId = null;

function initCanvas() {
    if (!canvas || prefersReduced) return;
    ctx = canvas.getContext("2d");
    if (!ctx) return;
    resizeCanvas();
    createParticles();
}

function resizeCanvas() {
    if (!canvas || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    ctx.scale(dpr, dpr);
}

function createParticles() {
    particles = [];
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const baseCount = Math.round(Math.min(Math.max(width * height / 25000, 20), 80));
    const isMobile = window.innerWidth < 480;
    const count = isMobile ? Math.round(baseCount * 0.5) : baseCount;
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            r: Math.random() * 1.8 + 0.6,
            a: Math.random() * 0.4 + 0.2
        });
    }
}

function drawParticles() {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = canvas.clientWidth + 10;
        if (p.x > canvas.clientWidth + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.clientHeight + 10;
        if (p.y > canvas.clientHeight + 10) p.y = -10;
        ctx.globalAlpha = p.a;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "#8b5cf6";
        ctx.fill();
    }
}

function animate() {
    if (!ctx || !animating) return;
    drawParticles();
    rafId = requestAnimationFrame(animate);
}

function startAnimation() {
    if (prefersReduced || !ctx || animating) return;
    animating = true;
    animate();
}

function stopAnimation() {
    animating = false;
    if (rafId) cancelAnimationFrame(rafId);
}

const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            startAnimation();
        } else {
            stopAnimation();
        }
    });
}, { threshold: 0.2 });

window.addEventListener("resize", () => {
    if (!ctx) return;
    resizeCanvas();
    createParticles();
}, { passive: true });

document.addEventListener("DOMContentLoaded", () => {
    initCanvas();
    if (hero) heroObserver.observe(hero);
});
