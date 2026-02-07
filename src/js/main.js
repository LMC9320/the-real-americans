/* ============================================
   THE REAL AMERICANS - MVR STUDIOS
   GTA 6 Inspired — GSAP + Lenis
   Scroll-Scrub Video + Character Image Fly-in
   ============================================ */

import '../styles/main.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

/* ============================================
   LENIS SMOOTH SCROLL
   ============================================ */
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  gestureOrientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 2,
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

/* ============================================
   LOADER
   ============================================ */
function initLoader() {
  const loader = document.getElementById('loader');
  const progress = loader.querySelector('.loader__progress');
  let loadProgress = 0;

  const interval = setInterval(() => {
    loadProgress += Math.random() * 15 + 5;
    if (loadProgress >= 100) {
      loadProgress = 100;
      clearInterval(interval);
      progress.style.width = '100%';
      setTimeout(() => {
        loader.classList.add('is-hidden');
        initHeroAnimations();
      }, 400);
    } else {
      progress.style.width = `${loadProgress}%`;
    }
  }, 120);
}

/* ============================================
   NAVIGATION
   ============================================ */
function initNav() {
  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.nav__link, .mobile-menu__link');
  let lastScrollY = 0;
  let ticking = false;

  lenis.on('scroll', ({ scroll }) => {
    if (!ticking) {
      requestAnimationFrame(() => {
        nav.classList.toggle('is-scrolled', scroll > 80);
        nav.classList.toggle('is-hidden', scroll > lastScrollY && scroll > 400);
        lastScrollY = scroll;
        ticking = false;
      });
      ticking = true;
    }
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('is-open');
    mobileMenu.classList.toggle('is-open');
    mobileMenu.classList.contains('is-open') ? lenis.stop() : lenis.start();
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        hamburger.classList.remove('is-open');
        mobileMenu.classList.remove('is-open');
        lenis.start();
        lenis.scrollTo(target, { offset: -70 });
      }
    });
  });

  // Active section tracking
  document.querySelectorAll('section[id]').forEach((section) => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => setActiveNav(section.id),
      onEnterBack: () => setActiveNav(section.id),
    });
  });

  function setActiveNav(id) {
    navLinks.forEach((link) => {
      link.classList.toggle('is-active', link.dataset.section === id);
    });
  }
}

/* ============================================
   HERO ANIMATIONS
   ============================================ */
function initHeroAnimations() {
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  tl.to('.hero__badge', { opacity: 1, y: 0, duration: 0.8, delay: 0.2 })
    .to('.hero__title-line--1', { opacity: 1, y: 0, duration: 1 }, '-=0.4')
    .to('.hero__title-line--2', { opacity: 1, y: 0, duration: 1.2 }, '-=0.6')
    .to('.hero__subtitle', { opacity: 1, duration: 0.8 }, '-=0.4')
    .to('.hero__cta', { opacity: 1, y: 0, duration: 0.8 }, '-=0.4')
    .to('.hero__scroll-indicator', { opacity: 1, duration: 0.6 }, '-=0.2');

  // Hero parallax on scroll
  gsap.to('.hero__title-line--1', {
    y: -50,
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
  });
  gsap.to('.hero__title-line--2', {
    y: -80,
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
  });
  gsap.to('.hero__badge', {
    y: -30, opacity: 0,
    scrollTrigger: { trigger: '.hero', start: 'top top', end: '60% top', scrub: 1 },
  });
  gsap.to('.hero__cta', {
    y: -20, opacity: 0,
    scrollTrigger: { trigger: '.hero', start: 'top top', end: '50% top', scrub: 1 },
  });
  gsap.to('.hero__dust', {
    y: -100,
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 2 },
  });
}

/* ============================================
   MOUSE PARALLAX ON HERO
   ============================================ */
function initMouseParallax() {
  const hero = document.querySelector('.hero');
  const dust = document.querySelector('.hero__dust');
  const gradient = document.querySelector('.hero__gradient');

  hero.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    gsap.to(dust, { x: x * 20, y: y * 15, duration: 1.5, ease: 'power2.out' });
    gsap.to(gradient, { x: x * -10, y: y * -8, duration: 2, ease: 'power2.out' });
  });
}

/* ============================================
   VIDEO SCRUB — GTA 6 STYLE
   Pinned section, scroll maps to video.currentTime
   Falls back to text scenes when no video source
   ============================================ */
function initVideoScrub() {
  const video = document.querySelector('.video-scrub__video');
  const container = document.querySelector('.video-scrub__container');
  const fallback = document.querySelector('.video-scrub__fallback');
  const scenes = document.querySelectorAll('.video-scrub__scene');
  const ringFill = document.querySelector('.video-scrub__ring-fill');
  const ringText = document.querySelector('.video-scrub__progress-text');
  const circumference = 2 * Math.PI * 45; // r=45

  const hasVideo = video && video.querySelector('source');

  // Create the main scroll-scrub timeline
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.video-scrub',
      start: 'top top',
      end: '+=200%',         // 200vh of scroll distance
      scrub: true,
      pin: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        const p = self.progress;
        // Update progress ring
        if (ringFill) {
          ringFill.style.strokeDashoffset = circumference - (p * circumference);
        }
        if (ringText) {
          ringText.textContent = `${Math.round(p * 100)}%`;
        }
      },
    },
  });

  if (hasVideo) {
    // Real video scrub: map scroll to currentTime
    video.classList.add('is-ready');
    if (fallback) fallback.style.display = 'none';

    video.addEventListener('loadedmetadata', () => {
      tl.to(video, {
        currentTime: video.duration,
        duration: 3,
        ease: 'power1.inOut',
      });
    });
  } else {
    // Fallback: animate through text scenes
    if (video) video.style.display = 'none';

    const totalScenes = scenes.length;
    if (totalScenes > 0) {
      scenes[0].classList.add('is-active');

      // Scene 1: visible from 0% to 33%
      tl.to({}, { duration: 1 }); // hold scene 1

      // Crossfade to scene 2 at 33%
      tl.call(() => {
        scenes.forEach((s) => s.classList.remove('is-active'));
        scenes[1].classList.add('is-active');
      });
      tl.from(scenes[1], { opacity: 0, scale: 0.95, duration: 0.5 });
      tl.to({}, { duration: 0.8 }); // hold scene 2

      // Crossfade to scene 3 at 66%
      if (scenes[2]) {
        tl.call(() => {
          scenes.forEach((s) => s.classList.remove('is-active'));
          scenes[2].classList.add('is-active');
        });
        tl.from(scenes[2], { opacity: 0, scale: 0.95, duration: 0.5 });
        tl.to({}, { duration: 0.8 }); // hold scene 3
      }
    }
  }

  // Fade hero as video section enters
  tl.to('.hero', { opacity: 0, duration: 0.5, ease: 'power1.inOut' }, 0);
}

/* ============================================
   SYNOPSIS ANIMATIONS
   ============================================ */
function initSynopsis() {
  // Pull synopsis up slightly to overlap
  gsap.set('.synopsis', { marginTop: '-10vh' });

  const synopsisTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.synopsis',
      start: 'top 70%',
      end: 'top 20%',
      toggleActions: 'play none none reverse',
    },
  });

  synopsisTl
    .from('.synopsis__title', { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out' })
    .from('.synopsis__description', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
    .from('.synopsis__detail', { y: 20, opacity: 0, duration: 0.5, stagger: 0.15, ease: 'power3.out' }, '-=0.4')
    .from('.synopsis__video-frame', { x: 60, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.8');
}

/* ============================================
   CHARACTERS — GTA 6 STYLE
   Image fly-ins + parallax on img-box
   ============================================ */
function initCharacters() {
  // Characters intro header
  gsap.from('.characters-intro__title', {
    y: 60, opacity: 0, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '.characters-intro', start: 'top 75%', toggleActions: 'play none none reverse' },
  });
  gsap.from('.characters-intro__sub', {
    y: 30, opacity: 0, duration: 0.8, delay: 0.15, ease: 'power3.out',
    scrollTrigger: { trigger: '.characters-intro', start: 'top 75%', toggleActions: 'play none none reverse' },
  });

  // Each character section
  const charSections = document.querySelectorAll('.char-section');

  charSections.forEach((section) => {
    const text = section.querySelector('.char-section__text');
    const imgBox = section.querySelector('.char-section__images');
    const flyInImages = section.querySelectorAll('[class*="img--from-"]');
    const role = section.querySelector('.char-section__role');
    const name = section.querySelector('.char-section__name');
    const bio = section.querySelector('.char-section__bio');
    const animNote = section.querySelector('.char-section__anim-note');

    // === Text reveal timeline ===
    const textTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        end: 'top 25%',
        toggleActions: 'play none none reverse',
      },
    });

    if (role) textTl.from(role, { y: 20, opacity: 0, duration: 0.5, ease: 'power3.out' });
    if (name) textTl.from(name, { y: 40, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.3');
    if (bio) textTl.from(bio, { y: 30, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4');
    if (animNote) textTl.from(animNote, { y: 20, opacity: 0, duration: 0.5, ease: 'power3.out' }, '-=0.3');

    // === Image fly-ins (scrubbed to scroll) ===
    flyInImages.forEach((img) => {
      gsap.to(img, {
        x: 0,
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          end: 'center center',
          scrub: 1,
        },
      });
    });

    // === Parallax on img-box (GTA 6 pattern) ===
    if (imgBox) {
      gsap.to(imgBox, {
        y: -300,
        scrollTrigger: {
          trigger: section,
          start: 'top center',
          end: '80% center',
          scrub: 2,
        },
      });
    }

    // === Background glow pulse on enter ===
    const bg = section.querySelector('.char-section__bg');
    if (bg) {
      gsap.to(bg, {
        opacity: 0.12,
        duration: 0.6,
        scrollTrigger: {
          trigger: section,
          start: 'top 60%',
          end: 'bottom 40%',
          toggleActions: 'play reverse play reverse',
        },
      });
    }
  });
}

/* ============================================
   WORLD SECTION
   ============================================ */
function initWorld() {
  gsap.from('.world__header .section-title', {
    y: 60, opacity: 0, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '.world', start: 'top 70%', toggleActions: 'play none none reverse' },
  });
  gsap.from('.world__subtitle', {
    y: 30, opacity: 0, duration: 0.8, delay: 0.2, ease: 'power3.out',
    scrollTrigger: { trigger: '.world', start: 'top 70%', toggleActions: 'play none none reverse' },
  });

  document.querySelectorAll('.world__location').forEach((location, i) => {
    const content = location.querySelector('.world__location-content');
    const image = location.querySelector('.world__location-image');
    const isEven = i % 2 === 1;

    gsap.to(location, {
      opacity: 1, y: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: location, start: 'top 75%', toggleActions: 'play none none reverse' },
    });
    gsap.from(content, {
      x: isEven ? 60 : -60, opacity: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: location, start: 'top 70%', toggleActions: 'play none none reverse' },
    });
    gsap.from(image, {
      x: isEven ? -60 : 60, opacity: 0, duration: 1, delay: 0.15, ease: 'power3.out',
      scrollTrigger: { trigger: location, start: 'top 70%', toggleActions: 'play none none reverse' },
    });
    gsap.to(image, {
      y: -30,
      scrollTrigger: { trigger: location, start: 'top bottom', end: 'bottom top', scrub: 1.5 },
    });
  });
}

/* ============================================
   FINAL CTA
   ============================================ */
function initFinalCTA() {
  const cta = document.querySelector('.final-cta');
  if (!cta) return;

  gsap.from('.final-cta__line1', {
    y: 40, opacity: 0, duration: 0.8, ease: 'power3.out',
    scrollTrigger: { trigger: cta, start: 'top 70%', toggleActions: 'play none none reverse' },
  });
  gsap.from('.final-cta__line2', {
    y: 60, opacity: 0, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: cta, start: 'top 70%', toggleActions: 'play none none reverse' },
  });
  gsap.from('.final-cta__tagline', {
    y: 20, opacity: 0, duration: 0.6, delay: 0.3, ease: 'power3.out',
    scrollTrigger: { trigger: cta, start: 'top 70%', toggleActions: 'play none none reverse' },
  });
  gsap.from('.final-cta__btn', {
    y: 20, opacity: 0, duration: 0.5, delay: 0.5, ease: 'power3.out',
    scrollTrigger: { trigger: cta, start: 'top 70%', toggleActions: 'play none none reverse' },
  });
}

/* ============================================
   BACK TO TOP
   ============================================ */
function initBackToTop() {
  document.querySelectorAll('a[href="#hero"]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      lenis.scrollTo('#hero', { offset: 0 });
    });
  });
}

/* ============================================
   INIT
   ============================================ */
function init() {
  initLoader();
  initNav();
  initMouseParallax();

  requestAnimationFrame(() => {
    initVideoScrub();
    initSynopsis();
    initCharacters();
    initWorld();
    initFinalCTA();
    initBackToTop();
  });
}

// Refresh ScrollTrigger on resize
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => ScrollTrigger.refresh(), 250);
});

// GO
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
