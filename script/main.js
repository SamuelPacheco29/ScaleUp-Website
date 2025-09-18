(function() {
    // =========== 3D TILT EFFECT ===========
    var tiltCard = document.querySelector('.tilt-card');
    if (tiltCard) {
        var maxRotate = 12; // grados máximos de inclinación (reducido para suavidad)
        var scaleOnHover = 1.03; // escala más sutil
        var resetTimeout;
        var isHovering = false;

        function handleMove(event) {
            if (!isHovering) return;
            
            var rect = tiltCard.getBoundingClientRect();
            var centerX = rect.left + rect.width / 2;
            var centerY = rect.top + rect.height / 2;
            var x = (event.clientX - centerX) / (rect.width / 2);
            var y = (event.clientY - centerY) / (rect.height / 2);

            // Suavizar el movimiento con una función de atenuación
            var rotateY = x * maxRotate * 0.9; // izquierda/derecha (más suave)
            var rotateX = -y * maxRotate * 0.9; // arriba/abajo (más suave)

            tiltCard.style.transform = 'rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale(' + scaleOnHover + ')';
        }

        function handleEnter() {
            isHovering = true;
            clearTimeout(resetTimeout);
            tiltCard.style.transition = 'transform 120ms ease-out';
        }

        function handleLeave() {
            tiltCard.style.transition = 'transform 250ms ease';
            tiltCard.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
        }

        tiltCard.addEventListener('mousemove', handleMove);
        tiltCard.addEventListener('mouseenter', handleEnter);
        tiltCard.addEventListener('mouseleave', handleLeave);

        // Seguridad: restablecer en scroll/resize para evitar transformaciones extrañas
        window.addEventListener('scroll', handleLeave, { passive: true });
        window.addEventListener('resize', handleLeave);
    }

    // =========== NAVIGATION DOTS ===========
    var dots = document.querySelectorAll('.dot');
    var sections = document.querySelectorAll('section[id]');
    var header = document.querySelector('.main-header');

    // Función para actualizar el dot activo
    function updateActiveDot() {
        var scrollPos = window.scrollY + window.innerHeight / 2;
        
        sections.forEach(function(section) {
            var sectionTop = section.offsetTop;
            var sectionBottom = sectionTop + section.offsetHeight;
            var sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                // Remover clase active de todos los dots
                dots.forEach(function(dot) {
                    dot.classList.remove('active');
                });
                
                // Agregar clase active al dot correspondiente
                var activeDot = document.querySelector('.dot[data-section="' + sectionId + '"]');
                if (activeDot) {
                    activeDot.classList.add('active');
                }
            }
        });
    }

    // Función para hacer scroll suave a una sección
    function scrollToSection(sectionId) {
        var targetSection = document.getElementById(sectionId);
        if (targetSection) {
            var targetPosition = targetSection.offsetTop;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    // Event listeners para los dots
    dots.forEach(function(dot) {
        dot.addEventListener('click', function() {
            var sectionId = this.getAttribute('data-section');
            scrollToSection(sectionId);
        });
    });

    // =========== HEADER FIXED (NO SCROLL EFFECTS) ===========
    // El header se mantiene fijo sin cambios de scroll

    // =========== HAMBURGER MENU ===========
    var hamburger = document.querySelector('.hamburger');
    var navMenu = document.querySelector('.nav-menu');

    function toggleMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    }

    function closeMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }

    // Event listeners para el menú hamburguesa
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', toggleMenu);
        
        // Cerrar menú al hacer click en un enlace
        var navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(function(link) {
            link.addEventListener('click', closeMenu);
        });
        
        // Cerrar menú al hacer click fuera
        document.addEventListener('click', function(event) {
            if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
                closeMenu();
            }
        });
    }

    // Event listeners
    window.addEventListener('scroll', function() {
        updateActiveDot();
    }, { passive: true });

    // Inicializar estado inicial
    updateActiveDot();
})();

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.querySelectorAll('.fade-in-on-scroll').forEach(el => {
    observer.observe(el);
});

// Mouse tracking for cards (3D tilt effect)
document.querySelectorAll('.value-card, .method-step').forEach(card => {
    card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// Smooth reveal animations on scroll
const revealElements = document.querySelectorAll('.value-card, .method-step');

function checkReveal() {
    revealElements.forEach((element, index) => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.style.animationDelay = `${index * 0.1}s`;
            element.classList.add('animate');
        }
    });
}

window.addEventListener('scroll', checkReveal);
checkReveal(); // Check on load

// Add floating particles effect (optional - can be removed if too heavy)
function createFloatingParticles() {
    const particleContainer = document.createElement('div');
    particleContainer.style.position = 'fixed';
    particleContainer.style.top = '0';
    particleContainer.style.left = '0';
    particleContainer.style.width = '100%';
    particleContainer.style.height = '100%';
    particleContainer.style.pointerEvents = 'none';
    particleContainer.style.zIndex = '-1';
    particleContainer.style.opacity = '0.6';
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 4 + 'px';
        particle.style.height = particle.style.width;
        particle.style.backgroundColor = 'rgba(10, 88, 202, 0.1)';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `float ${Math.random() * 10 + 10}s linear infinite`;
        
        particleContainer.appendChild(particle);
    }
    
    document.body.appendChild(particleContainer);
}
