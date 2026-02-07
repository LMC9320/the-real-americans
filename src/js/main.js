/* ============================================
   THE REAL AMERICANS - MVR STUDIOS
   Main JavaScript — GSAP + Lenis
   ============================================ */

import '../styles/main.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

/* ---- Lenis Smooth Scroll ---- */
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

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

/* ---- Loader ---- */
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

/* ---- Navigation ---- */
function initNav() {
  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.nav__link, .mobile-menu__link');
  let lastScrollY = 0;
  let ticking = false;

  // Scroll-based nav styling
  lenis.on('scroll', ({ scroll }) => {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (scroll > 80) {
          nav.classList.add('is-scrolled');
        } else {
          nav.classList.remove('is-scrolled');
        }

        if (scroll > lastScrollY && scroll > 400) {
          nav.classList.add('is-hidden');
        } else {
          nav.classList.remove('is-hidden');
        }

        lastScrollY = scroll;
        ticking = false;
      });
      ticking = true;
    }
  });

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('is-open');
    mobileMenu.classList.toggle('is-open');
    if (mobileMenu.classList.contains('is-open')) {
      lenis.stop();
    } else {
      lenis.start();
    }
  });

  // Nav link clicks
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
  const sections = document.querySelectorAll('section[id]');
  sections.forEach((section) => {
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

/* ---- Hero Animations ---- */
function initHeroAnimations() {
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  tl.to('.hero__badge', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    delay: 0.2,
  })
    .to(
      '.hero__title-line--1',
      {
        opacity: 1,
        y: 0,
        duration: 1,
      },
      '-=0.4'
    )
    .to(
      '.hero__title-line--2',
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
      },
      '-=0.6'
    )
    .to(
      '.hero__subtitle',
      {
        opacity: 1,
        duration: 0.8,
      },
      '-=0.4'
    )
    .to(
      '.hero__cta',
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
      },
      '-=0.4'
    )
    .to(
      '.hero__scroll-indicator',
      {
        opacity: 1,
        duration: 0.6,
      },
      '-=0.2'
    );

  // Parallax on hero elements
  gsap.to('.hero__title-line--1', {
    y: -50,
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
    },
  });

  gsap.to('.hero__title-line--2', {
    y: -80,
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
    },
  });

  gsap.to('.hero__badge', {
    y: -30,
    opacity: 0,
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: '60% top',
      scrub: 1,
    },
  });

  gsap.to('.hero__cta', {
    y: -20,
    opacity: 0,
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: '50% top',
      scrub: 1,
    },
  });

  gsap.to('.hero__dust', {
    y: -100,
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 2,
    },
  });
}

/* ---- Synopsis Animations ---- */
function initSynopsis() {
  const synopsisTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.synopsis',
      start: 'top 70%',
      end: 'top 20%',
      toggleActions: 'play none none reverse',
    },
  });

  synopsisTl
    .from('.synopsis__video-frame', {
      x: -60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
    })
    .from(
      '.synopsis__title',
      {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      },
      '-=0.6'
    )
    .from(
      '.synopsis__description',
      {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      },
      '-=0.5'
    )
    .from(
      '.synopsis__detail',
      {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.15,
        ease: 'power3.out',
      },
      '-=0.4'
    );

  // Trailers reveal
  gsap.from('.synopsis__trailer-card', {
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.synopsis__trailers',
      start: 'top 75%',
      toggleActions: 'play none none reverse',
    },
  });
}

/* ---- Characters Section — GTA 6 Style Horizontal Scroll ---- */
function initCharacters() {
  const carousel = document.querySelector('.characters__carousel');
  const cards = document.querySelectorAll('.character-card');
  const progressBar = document.querySelector('.characters__progress-bar');
  const totalCards = cards.length;

  if (totalCards === 0) return;

  // GSAP horizontal scroll pinned section
  const scrollWidth = carousel.scrollWidth - window.innerWidth;

  const charactersTl = gsap.to(carousel, {
    x: () => -scrollWidth,
    ease: 'none',
    scrollTrigger: {
      trigger: '.characters',
      start: 'top top',
      end: () => `+=${scrollWidth}`,
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const progress = self.progress;
        progressBar.style.width = `${(progress * 100)}%`;

        // Animate cards as they come into view
        cards.forEach((card, i) => {
          const cardProgress = (progress * totalCards) - i;
          if (cardProgress > -0.5 && cardProgress < 1.5) {
            gsap.to(card.querySelector('.character-card__info'), {
              opacity: 1,
              x: 0,
              duration: 0.4,
              ease: 'power2.out',
            });
            gsap.to(card.querySelector('.character-card__image'), {
              scale: 1,
              opacity: 1,
              duration: 0.5,
              ease: 'power2.out',
            });
          } else {
            gsap.to(card.querySelector('.character-card__info'), {
              opacity: 0.3,
              x: cardProgress < 0 ? -30 : 30,
              duration: 0.4,
            });
            gsap.to(card.querySelector('.character-card__image'), {
              scale: 0.9,
              opacity: 0.5,
              duration: 0.4,
            });
          }
        });
      },
    },
  });

  // Individual card parallax within horizontal scroll
  cards.forEach((card) => {
    const image = card.querySelector('.character-card__image-wrapper');
    const info = card.querySelector('.character-card__info');

    // Slight parallax offset between image and text
    gsap.set(info, { opacity: 0.3, x: 30 });
    gsap.set(card.querySelector('.character-card__image'), { scale: 0.9, opacity: 0.5 });
  });

  // Characters header reveal
  gsap.from('.characters__header .section-title', {
    y: 60,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.characters',
      start: 'top 70%',
      toggleActions: 'play none none reverse',
    },
  });

  gsap.from('.characters__subtitle', {
    y: 30,
    opacity: 0,
    duration: 0.8,
    delay: 0.2,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.characters',
      start: 'top 70%',
      toggleActions: 'play none none reverse',
    },
  });
}

/* ---- World Section Animations ---- */
function initWorld() {
  // Header
  gsap.from('.world__header .section-title', {
    y: 60,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.world',
      start: 'top 70%',
      toggleActions: 'play none none reverse',
    },
  });

  gsap.from('.world__subtitle', {
    y: 30,
    opacity: 0,
    duration: 0.8,
    delay: 0.2,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.world',
      start: 'top 70%',
      toggleActions: 'play none none reverse',
    },
  });

  // Location cards with parallax
  const locations = document.querySelectorAll('.world__location');
  locations.forEach((location, i) => {
    const content = location.querySelector('.world__location-content');
    const image = location.querySelector('.world__location-image');
    const isEven = i % 2 === 1;

    gsap.to(location, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: location,
        start: 'top 75%',
        toggleActions: 'play none none reverse',
      },
    });

    // Parallax within each location
    gsap.from(content, {
      x: isEven ? 60 : -60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: location,
        start: 'top 70%',
        toggleActions: 'play none none reverse',
      },
    });

    gsap.from(image, {
      x: isEven ? -60 : 60,
      opacity: 0,
      duration: 1,
      delay: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: location,
        start: 'top 70%',
        toggleActions: 'play none none reverse',
      },
    });

    // Parallax scroll movement
    gsap.to(image, {
      y: -30,
      scrollTrigger: {
        trigger: location,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
      },
    });
  });
}

/* ---- Scroll Story Section — Pinned Panels ---- */
function initScrollStory() {
  const panels = document.querySelectorAll('.scroll-story__panel');
  const totalPanels = panels.length;

  // Pin the section
  ScrollTrigger.create({
    trigger: '.scroll-story',
    start: 'top top',
    end: 'bottom bottom',
    pin: '.scroll-story__pin-wrapper',
    pinSpacing: false,
  });

  // Animate panels based on scroll progress
  panels.forEach((panel, i) => {
    const panelStart = i / totalPanels;
    const panelEnd = (i + 1) / totalPanels;

    ScrollTrigger.create({
      trigger: '.scroll-story',
      start: `${panelStart * 100}% top`,
      end: `${panelEnd * 100}% top`,
      onEnter: () => activatePanel(i),
      onEnterBack: () => activatePanel(i),
      onLeave: () => {
        if (i < totalPanels - 1) deactivatePanel(i);
      },
      onLeaveBack: () => {
        if (i > 0) deactivatePanel(i);
      },
    });
  });

  function activatePanel(index) {
    panels.forEach((p, i) => {
      if (i === index) {
        p.classList.add('is-active');
        animatePanelIn(p);
      } else {
        p.classList.remove('is-active');
      }
    });
  }

  function deactivatePanel(index) {
    panels[index].classList.remove('is-active');
  }

  function animatePanelIn(panel) {
    const tag = panel.querySelector('.scroll-story__panel-tag');
    const titles = panel.querySelectorAll('.scroll-story__panel-title');
    const text = panel.querySelector('.scroll-story__panel-text');
    const cta = panel.querySelector('.scroll-story__cta');
    const logo = panel.querySelector('.scroll-story__final-logo');

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (tag) {
      tl.from(tag, { y: 20, opacity: 0, duration: 0.5 });
    }

    if (logo) {
      tl.from(logo.children, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
      }, tag ? '-=0.2' : 0);
    }

    if (titles.length > 0) {
      tl.from(
        titles,
        {
          y: 40,
          opacity: 0,
          duration: 0.7,
          stagger: 0.2,
        },
        tag ? '-=0.3' : 0
      );
    }

    if (text) {
      tl.from(
        text,
        {
          y: 20,
          opacity: 0,
          duration: 0.6,
        },
        '-=0.3'
      );
    }

    if (cta) {
      tl.from(
        cta,
        {
          y: 20,
          opacity: 0,
          duration: 0.5,
        },
        '-=0.2'
      );
    }
  }

  // Make panel 1 active initially
  panels[0].classList.add('is-active');
}

/* ---- Back to Top Button ---- */
function initBackToTop() {
  const btns = document.querySelectorAll('a[href="#hero"]');
  btns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      lenis.scrollTo('#hero', { offset: 0 });
    });
  });
}

/* ---- Mouse Parallax on Hero ---- */
function initMouseParallax() {
  const hero = document.querySelector('.hero');
  const dust = document.querySelector('.hero__dust');
  const gradient = document.querySelector('.hero__gradient');

  hero.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth - 0.5) * 2;
    const y = (clientY / window.innerHeight - 0.5) * 2;

    gsap.to(dust, {
      x: x * 20,
      y: y * 15,
      duration: 1.5,
      ease: 'power2.out',
    });

    gsap.to(gradient, {
      x: x * -10,
      y: y * -8,
      duration: 2,
      ease: 'power2.out',
    });
  });
}

/* ---- Initialize Everything ---- */
function init() {
  initLoader();
  initNav();
  initMouseParallax();

  // Wait a tick for DOM to settle
  requestAnimationFrame(() => {
    initSynopsis();
    initCharacters();
    initWorld();
    initScrollStory();
    initBackToTop();
  });
}

// Refresh ScrollTrigger on resize
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    ScrollTrigger.refresh();
  }, 250);
});

// GO
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
