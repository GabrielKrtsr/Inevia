document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navbar = document.querySelector('.navbar');
    
    if (mobileMenuBtn && navbar) {
        mobileMenuBtn.addEventListener('click', function() {
            navbar.classList.toggle('active');
            this.querySelector('i').classList.toggle('fa-times');
            this.querySelector('i').classList.toggle('fa-bars');
        });
    }
    


    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.navbar a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navbar.classList.contains('active')) {
                navbar.classList.remove('active');
                mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                mobileMenuBtn.querySelector('i').classList.add('fa-bars');
            }
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    


    
    // Sticky header on scroll
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });
    
    // Initialize header sticky state
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.classList.add('sticky');
    }
    //header
    function adjustHeader() {
        const header = document.querySelector(".header");
        const topBar = document.querySelector(".top-bar");
        if (!header || !topBar) return;

        const topBarHeight = topBar.offsetHeight +5;

        if (window.scrollY === 0) {
            // tout en haut → header en dessous de la top-bar
            header.style.top = topBarHeight + "px";
        } else {
            // dès qu'on descend → header flotte à 20px
            header.style.top = "20px";
        }
        }

        // au chargement + au scroll
        window.addEventListener("load", adjustHeader);
        window.addEventListener("scroll", adjustHeader);
        window.addEventListener("resize", adjustHeader); // au cas où la top-bar change de taille


    // Active link highlighting based on current page
    const currentPage = location.pathname.split('/').pop();
    const navLinksBis = document.querySelectorAll('.navbar a');
    
    navLinksBis.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        
        if (currentPage === linkPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});