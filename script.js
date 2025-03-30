document.addEventListener('DOMContentLoaded', function() {
    // Configuração inicial da seção ativa
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    const sections = document.querySelectorAll('.section');
    
    // Função para extrair o hash da URL
    function getHashFromUrl() {
        return window.location.hash.substring(1);
    }
    
    // Função para mostrar a seção correta
    function setActiveSection() {
        const currentHash = getHashFromUrl();
        let activeSection = 'about'; // Seção padrão
        
        // Verifica se o hash corresponde a uma seção existente
        if (currentHash) {
            const targetSection = document.getElementById(currentHash);
            if (targetSection) {
                activeSection = currentHash;
            }
        }
        
        // Atualiza o menu e a seção ativa
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${activeSection}`) {
                link.classList.add('active');
            }
        });
        
        sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === activeSection) {
                section.classList.add('active');
            }
        });
    }
    
    // Configura os listeners de clique para recarregar a página
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('href').substring(1);
            
            // Atualiza a URL com o hash da seção e recarrega a página
            window.location.hash = sectionId;
            window.location.reload();
        });
    });
    
    // Configura a seção ativa quando a página carrega
    setActiveSection();
    
    // Animação das barras de habilidades (opcional)
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
    
    // Observador para animar habilidades quando a seção for visível
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.target.id === 'skills') {
                animateSkillBars();
            }
        });
    }, { threshold: 0.1 });
    
    // Observa a seção de habilidades
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
        observer.observe(skillsSection);
    }
    
    // Menu mobile toggle (para responsividade)
    const menuToggle = document.createElement('div');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    document.body.appendChild(menuToggle);
    
    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        document.querySelector('.sidebar').classList.toggle('mobile-active');
    });
    
    // Adiciona estilos para o menu mobile
    const mobileStyles = document.createElement('style');
    mobileStyles.textContent = `
        .menu-toggle {
            display: none;
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 1000;
            background: var(--primary);
            color: var(--dark);
            width: 40px;
            height: 40px;
            border-radius: 50%;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }
        
        @media (max-width: 992px) {
            .menu-toggle {
                display: flex;
            }
            
            .sidebar {
                transform: translateX(-100%);
                transition: transform 0.3s ease;
                position: fixed;
                top: 0;
                left: 0;
                height: 100vh;
                z-index: 999;
            }
            
            .sidebar.mobile-active {
                transform: translateX(0);
            }
        }
    `;
    document.head.appendChild(mobileStyles);
});