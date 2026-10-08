document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('mobile-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link, .nav-action .button');

    // Otwieranie / Zamykanie z hamburgera
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('is-active');
            navMenu.classList.toggle('is-open');
        });
    }

    // Zwijanie menu po kliknięciu w jakikolwiek link na mobile
    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('is-open')) {
                hamburger.classList.remove('is-active');
                navMenu.classList.remove('is-open');
            }
        });
    });
});
