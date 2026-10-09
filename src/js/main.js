document.addEventListener('DOMContentLoaded', () => {
    const initSliders = () => {
        const cards = document.querySelectorAll('.amenities__card');
        cards.forEach((card) => {
            const track = card.querySelector('.amenities__track');
            const slides = card.querySelectorAll('.amenities__slide');
            const nextBtn = card.querySelector('.amenities__nav--next');
            const prevBtn = card.querySelector('.amenities__nav--prev');
            if (!track || slides.length < 2) return;

            let index = 0;
            const update = () => (track.style.transform = `translateX(-${index * 100}%)`);

            nextBtn.addEventListener('click', () => {
                index = (index + 1) % slides.length;
                update();
            });
            prevBtn.addEventListener('click', () => {
                index = (index - 1 + slides.length) % slides.length;
                update();
            });

            // Autoplay
            setInterval(() => {
                index = (index + 1) % slides.length;
                update();
            }, 5000);
        });
    };
    initSliders();

    //nav
    const hamburger = document.getElementById('mobile-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link, .nav-action .button');
    //booking
    const form = document.getElementById('booking-form');
    if (!form) return;
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
    checkinInput.setAttribute('min', today);
    checkoutInput.setAttribute('min', tomorrow);
    checkinInput.value = today;
    checkoutInput.value = tomorrow;

    //nav
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('is-active');
            navMenu.classList.toggle('is-open');
        });
    }
    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('is-open')) {
                hamburger.classList.remove('is-active');
                navMenu.classList.remove('is-open');
            }
        });
    });

    //booking link
    const updateBookingLink = () => {
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

    [objectSelect, checkoutInput, guestsInput].forEach((input) => {
        input.addEventListener('change', updateBookingLink);
        input.addEventListener('input', updateBookingLink);
    });
});
