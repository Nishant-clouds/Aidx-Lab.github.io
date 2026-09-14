// Dark mode
const darkToggle = document.getElementById('darkToggle');
darkToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const dark = document.body.classList.contains('dark');
    darkToggle.innerHTML = dark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
});

// Mobile menu
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
menuToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(l =>
    l.addEventListener('click', () => navLinks.classList.remove('open')));

// Scroll progress bar
const progress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    progress.style.width = pct + '%';
});

// Active nav highlighting
const sections = document.querySelectorAll('section[id], header[id]');
const navAnchors = navLinks.querySelectorAll('a');
const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navAnchors.forEach(a => {
                a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
            });
        }
    });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach(s => navObserver.observe(s));

// Publication filter
const filterButtons = document.querySelectorAll('#filterBar .filter-btn');
const pubItems = document.querySelectorAll('.pub-item');
filterButtons.forEach(btn => btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const year = btn.dataset.year;
    pubItems.forEach(i => i.classList.toggle('hidden', !(year === 'all' || i.dataset.year === year)));
}));

// Project filter
const projBtns = document.querySelectorAll('#projectFilterBar .filter-btn');
const projCards = document.querySelectorAll('.project-card');
projBtns.forEach(btn => btn.addEventListener('click', () => {
    projBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.cat;
    projCards.forEach(c => c.classList.toggle('hidden', !(cat === 'all' || c.dataset.cat === cat)));
}));

// Scroll reveal
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Animated counters
function animateCount(el) {
    const target = parseInt(el.dataset.target, 10);
    let current = 0;
    const steps = 40;
    const inc = target / steps;
    const timer = setInterval(() => {
        current += inc;
        if (current >= target) { el.textContent = target; clearInterval(timer); }
        else el.textContent = Math.floor(current);
    }, 30);
}
const statObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) { animateCount(e.target); statObserver.unobserve(e.target); }
    });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-number').forEach(el => statObserver.observe(el));

// Back to top
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => backToTop.classList.toggle('show', window.scrollY > 450));
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Research modal
const researchDetails = {
    misinfo: {
        title: "Misinformation Detection",
        body: `<p>We build machine learning models that detect coordinated misinformation campaigns across social media platforms in real time.</p>
               <ul><li>Graph-based detection of bot networks</li>
               <li>Cross-platform narrative tracking</li>
               <li>Real-time fact-check matching</li></ul>
               <p><strong>Related publication:</strong> "Detecting Coordinated Misinformation Campaigns at Scale," EMNLP 2026.</p>`
    },
    toxicity: {
        title: "Toxicity &amp; Abuse Prevention",
        body: `<p>We develop context-aware models that detect harassment and abusive language while minimising false positives against marginalised dialects.</p>
               <ul><li>Context-sensitive toxicity classifiers</li>
               <li>Bias auditing across dialects</li>
               <li>Deployment-ready moderation APIs</li></ul>
               <p><strong>Related publication:</strong> "Cross-Lingual Toxicity Detection in Low-Resource Settings," ACL 2026.</p>`
    },
    lowres: {
        title: "Low-Resource Languages",
        body: `<p>We build NLP datasets and models for languages that lack large existing text corpora, focusing on equitable access to language technology.</p>
               <ul><li>Community-sourced dataset creation</li>
               <li>Transfer learning from high-resource languages</li>
               <li>Open-source model releases</li></ul>
               <p><strong>Related publication:</strong> "Low-Resource NLP for Under-Documented Languages," ACL 2025.</p>`
    }
};
const modal = document.getElementById('researchModal');
const modalContent = document.getElementById('modalContent');
document.querySelectorAll('.research-card').forEach(card =>
    card.addEventListener('click', () => {
        const d = researchDetails[card.dataset.research];
        modalContent.innerHTML = `<h3>${d.title}</h3>${d.body}`;
        modal.classList.add('open');
    }));
document.getElementById('closeModal').addEventListener('click', () => modal.classList.remove('open'));
modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') modal.classList.remove('open'); });
