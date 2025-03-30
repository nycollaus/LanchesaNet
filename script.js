document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Close mobile menu if open
                const mobileMenu = document.querySelector('.mobile-menu');
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    document.querySelector('.menu-toggle').classList.remove('active');
                }
                
                // Scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - 20,
                    behavior: 'smooth'
                });
                
                // Update URL without page jump
                history.pushState(null, null, targetId);
            }
        });
    });
    
    // Section switching
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding section
            const target = this.getAttribute('href');
            document.querySelector(target).classList.add('active');
            
            // Scroll to top of section
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    });
    
    // Activate first section by default
    if (window.location.hash) {
        const hash = window.location.hash;
        const targetLink = document.querySelector(`.sidebar-nav a[href="${hash}"]`);
        if (targetLink) {
            targetLink.click();
        } else {
            document.querySelector('.sidebar-nav a').click();
        }
    } else {
        document.querySelector('.sidebar-nav a').click();
    }
    
    // Animate skill bars when section is visible
    const animateSkillBars = () => {
        const skillBars = document.querySelectorAll('.skill-bar span');
        skillBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        });
    };
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.id === 'skills') {
                    animateSkillBars();
                }
                
                // Add any other section-specific animations here
            }
        });
    }, observerOptions);
    
    // Observe all sections
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Mobile menu toggle (for responsive design)
    const menuToggle = document.createElement('div');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    document.body.appendChild(menuToggle);
    
    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        document.querySelector('.sidebar').classList.toggle('mobile-active');
    });
    
    // Add responsive styles dynamically
    const responsiveStyles = document.createElement('style');
    responsiveStyles.textContent = `
        @media (max-width: 992px) {
            .sidebar {
                transform: translateX(-100%);
                transition: transform 0.3s ease;
                position: fixed;
                top: 0;
                left: 0;
                height: 100vh;
                z-index: 100;
                overflow-y: auto;
            }
            
            .sidebar.mobile-active {
                transform: translateX(0);
            }
            
            .menu-toggle {
                display: flex;
                align-items: center;
                justify-content: center;
                position: fixed;
                top: 20px;
                left: 20px;
                width: 40px;
                height: 40px;
                background: var(--primary);
                color: var(--dark);
                border-radius: 50%;
                z-index: 101;
                cursor: pointer;
                font-size: 1.2rem;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            }
            
            .menu-toggle.active {
                background: var(--dark);
                color: var(--primary);
            }
        }
    `;
    document.head.appendChild(responsiveStyles);
});
