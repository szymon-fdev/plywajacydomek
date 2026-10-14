document.addEventListener('DOMContentLoaded', () => {
    const setAppHeight = () => {
        const vh = window.innerHeight;
        document.documentElement.style.setProperty('--initial-vh', `${vh}px`);
    };

    setAppHeight();

    window.addEventListener('orientationchange', () => {
        setTimeout(setAppHeight, 150);
    });
    // ==========================================
    // 1. SLIDERY W KARTACH (Amenities)
    // ==========================================
    const initAmenitiesSliders = () => {
        const cards = document.querySelectorAll('.amenities__card');

        cards.forEach((card) => {
            const track = card.querySelector('.amenities__track');
            const slides = card.querySelectorAll('.amenities__slide');
            const nextBtn = card.querySelector('.amenities__nav--next');
            const prevBtn = card.querySelector('.amenities__nav--prev');
            if (!track || slides.length < 2) return;

            let index = 0;
            let timer = null;

            const update = () => (track.style.transform = `translateX(-${index * 100}%)`);

            const nextSlide = () => {
                index = (index + 1) % slides.length;
                update();
            };

            const prevSlide = () => {
                index = (index - 1 + slides.length) % slides.length;
                update();
            };

            const startTimer = () => {
                timer = setInterval(nextSlide, 7000);
            };

            const resetTimer = () => {
                clearInterval(timer);
                startTimer();
            };

            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    nextSlide();
                    resetTimer();
                });
            }

            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    prevSlide();
                    resetTimer();
                });
            }
            startTimer();
        });
    };

    initAmenitiesSliders();

    // ==========================================
    // 2. OPINIE GOŚCI (Testimonials Slider)
    // ==========================================
    const initTestimonials = () => {
        const section = document.querySelector('.testimonials');
        if (!section) return;

        const track = section.querySelector('[data-slider-track]');
        const cards = section.querySelectorAll('.testimonials__card');
        const prevBtn = section.querySelector('[data-slider-prev]');
        const nextBtn = section.querySelector('[data-slider-next]');
        const dots = section.querySelectorAll('[data-slider-dots] .testimonials__dot');

        if (!track || cards.length === 0) return;

        const getStep = () => {
            if (cards.length >= 2) {
                return cards[1].getBoundingClientRect().left - cards[0].getBoundingClientRect().left;
            }
            return cards[0].offsetWidth;
        };

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const step = getStep();
                const isAtEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 15;

                if (isAtEnd) {
                    track.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    track.scrollBy({ left: step, behavior: 'smooth' });
                }
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const step = getStep();
                const isAtStart = track.scrollLeft <= 15;

                if (isAtStart) {
                    track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
                } else {
                    track.scrollBy({ left: -step, behavior: 'smooth' });
                }
            });
        }

        track.addEventListener(
            'scroll',
            () => {
                const step = getStep();
                const activeIndex = Math.round(track.scrollLeft / step);

                dots.forEach((dot, idx) => {
                    dot.classList.toggle('testimonials__dot--active', idx === activeIndex);
                });
            },
            { passive: true },
        );
    };
    initTestimonials();

    // ==========================================
    // 3. LIGHTBOX
    // ==========================================
    if (typeof GLightbox !== 'undefined') {
        GLightbox({
            selector: '.glightbox',
            touchNavigation: true,
            loop: true,
        });
    }

    // ==========================================
    // 4. NAWIGACJA MOBILNA
    // ==========================================
    const hamburger = document.getElementById('mobile-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link, .nav-action .button');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('is-active');
            navMenu.classList.toggle('is-open');
        });
    }

    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            if (navMenu && navMenu.classList.contains('is-open')) {
                hamburger.classList.remove('is-active');
                navMenu.classList.remove('is-open');
            }
        });
    });

    // ==========================================
    // 5. FORMULARZ REZERWACJI (BOOKING)
    // ==========================================
    const form = document.getElementById('booking-form');

    if (form) {
        const objectSelect = document.getElementById('object-select');
        const checkinInput = document.getElementById('checkin');
        const checkoutInput = document.getElementById('checkout');
        const guestsInput = document.getElementById('guests');
        const bookingLink = document.getElementById('booking-link');

        const todayObj = new Date();
        const today = todayObj.toISOString().split('T')[0];
        const tomorrowObj = new Date(todayObj);
        tomorrowObj.setDate(tomorrowObj.getDate() + 1);
        const tomorrow = tomorrowObj.toISOString().split('T')[0];

        if (checkinInput && checkoutInput) {
            checkinInput.setAttribute('min', today);
            checkoutInput.setAttribute('min', tomorrow);
            checkinInput.value = today;
            checkoutInput.value = tomorrow;
        }

        const updateBookingLink = () => {
            if (!objectSelect || !checkinInput || !checkoutInput || !guestsInput || !bookingLink) return;

            const objectVal = objectSelect.value;
            const checkinVal = checkinInput.value;
            const checkoutVal = checkoutInput.value;
            const guestsVal = guestsInput.value;

            const isFormValid = objectVal && checkinVal && checkoutVal && guestsVal && new Date(checkinVal) < new Date(checkoutVal);

            if (isFormValid) {
                bookingLink.classList.remove('button--disabled');

                const baseUrls = {
                    alaska: 'https://www.booking.com/hotel/pl/plywajacy-domek-przywidz.pl.html',
                    brda: 'https://www.booking.com/hotel/pl/plywajaca-brda.pl.html',
                    stodola: 'https://www.booking.com/hotel/pl/szklana-stodola.pl.html',
                };

                const baseUrl = baseUrls[objectVal] || baseUrls['Nazwa Domku 2'];

                const params = new URLSearchParams({
                    aid: '1263239',
                    dest_id: '3882132',
                    dest_type: 'hotel',
                    checkin: checkinVal,
                    checkout: checkoutVal,
                    group_adults: guestsVal,
                    req_adults: guestsVal,
                });

                bookingLink.href = `${baseUrl}?${params.toString()}`;
            } else {
                bookingLink.classList.add('button--disabled');
                bookingLink.href = '#';
            }
        };

        if (checkinInput && checkoutInput) {
            checkinInput.addEventListener('change', (e) => {
                const checkinDate = new Date(e.target.value);
                if (isNaN(checkinDate)) return;

                const minCheckoutDate = new Date(checkinDate);
                minCheckoutDate.setDate(minCheckoutDate.getDate() + 1);

                const minCheckoutStr = minCheckoutDate.toISOString().split('T')[0];
                checkoutInput.setAttribute('min', minCheckoutStr);

                if (checkoutInput.value && new Date(checkoutInput.value) <= checkinDate) {
                    checkoutInput.value = minCheckoutStr;
                }

                updateBookingLink();
            });
        }

        [objectSelect, checkoutInput, guestsInput].forEach((input) => {
            if (input) {
                input.addEventListener('change', updateBookingLink);
                input.addEventListener('input', updateBookingLink);
            }
        });
    }

    // ==========================================
    // 6. NAJCZĘSTSZE PYTANIA (FAQ Accordion)
    // ==========================================
    const initFaq = () => {
        const faqSection = document.querySelector('.faq');
        if (!faqSection) return;

        const items = faqSection.querySelectorAll('.faq__item');

        items.forEach((item) => {
            const trigger = item.querySelector('.faq__trigger');
            if (!trigger) return;

            trigger.addEventListener('click', () => {
                const isOpen = item.classList.contains('is-active');

                items.forEach((otherItem) => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('is-active');
                        const otherTrigger = otherItem.querySelector('.faq__trigger');
                        if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
                    }
                });

                item.classList.toggle('is-active', !isOpen);
                trigger.setAttribute('aria-expanded', String(!isOpen));
            });
        });
    };
    initFaq();
});
