// Not tested yet, but this is a custom navigation bar component for the Photos web app. It provides a responsive navigation bar with links to different pages of the app, including Home, Albums, Map, Add Photo, and QR Code. The component uses Shadow DOM to encapsulate its styles and structure.
const template = document.createElement('template');

template.innerHTML = `
<style>
    .ph-nav-container {
        display: flex;
        justify-content: flex-start;
        gap: 16px;
        align-items: center;
        padding: 12px 20px;
        background-color: #f8f9fa;
        border-bottom: 1px solid #dadce0;
        flex-wrap: wrap;
    }

    .ph-nav-brand {
        font-family: Fraunces, sans-serif;
        font-size: 20px;
        font-weight: 500;
        color: #101010;
        text-decoration: none;
        margin-right: auto;
        letter-spacing: -0.035em;
    }

    .ph-nav-brand:hover {
        color: #5f6368;
    }

    .ph-nav-links {
        display: flex;
        gap: 8px;
        align-items: center;
        flex-wrap: wrap;
    }

    .ph-nav-link {
        padding: 8px 16px;
        color: #101010;
        text-decoration: none;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        transition: all 150ms ease-in-out;
        white-space: nowrap;
    }

    .ph-nav-link:hover {
        background-color: #e8eaed;
        color: #101010;
    }

    .ph-nav-link.active {
        background-color: #101010;
        color: #ffffff;
    }

    .ph-nav-divider {
        width: 1px;
        height: 20px;
        background-color: #dadce0;
        margin: 0 8px;
    }

    @media (max-width: 768px) {
        .ph-nav-container {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
        }

        .ph-nav-brand {
            margin-right: 0;
        }

        .ph-nav-links {
            width: 100%;
            gap: 4px;
        }

        .ph-nav-link {
            padding: 6px 12px;
            font-size: 13px;
        }

        .ph-nav-divider {
            display: none;
        }
    }
</style>

<nav class="ph-nav-container">
    <a href="../index.html" class="ph-nav-brand">Photos</a>
    <div class="ph-nav-links">
        <a href="../index.html" class="ph-nav-link" data-page="index">Home</a>
        <a href="../album.html" class="ph-nav-link" data-page="album">Albums</a>
        <a href="../photosmap.html" class="ph-nav-link" data-page="photosmap">Map</a>
        <span class="ph-nav-divider"></span>
        <a href="../add/index.html" class="ph-nav-link" data-page="add">Add Photo</a>
        <a href="../qrcode.html" class="ph-nav-link" data-page="qrcode">QR Code</a>
    </div>
</nav>
`;

customElements.define('ph-navigation', class Navigation extends HTMLElement {
    constructor() {
        super();
        const root = this.attachShadow({ mode: 'open' });
        root.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        this.setActivePage();
        this.setupNavigation();
    }

    setActivePage() {
        const currentPath = window.location.pathname;
        const links = this.shadowRoot.querySelectorAll('.ph-nav-link');
        
        links.forEach(link => {
            const href = link.getAttribute('href');
            const linkPath = this.normalizePath(href);
            const currentPagePath = this.normalizePath(currentPath);
            
            if (linkPath === currentPagePath || currentPagePath.includes(linkPath)) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    setupNavigation() {
        const links = this.shadowRoot.querySelectorAll('.ph-nav-link, .ph-nav-brand');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                // Allow normal link behavior
                e.preventDefault();
                const href = link.getAttribute('href');
                if (href) {
                    window.location.href = href;
                }
            });
        });
    }

    normalizePath(path) {
        // Remove trailing slashes and normalize path
        return path.replace(/\/+$/, '').toLowerCase();
    }

    addLink(label, href, position = 'end') {
        const linksContainer = this.shadowRoot.querySelector('.ph-nav-links');
        if (!linksContainer) return;

        const link = document.createElement('a');
        link.className = 'ph-nav-link';
        link.setAttribute('href', href);
        link.textContent = label;
        link.setAttribute('data-page', label.toLowerCase().replace(/\s+/g, '-'));

        if (position === 'end') {
            linksContainer.appendChild(link);
        } else {
            linksContainer.insertBefore(link, linksContainer.firstChild);
        }

        link.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = href;
        });
    }

    removeLink(dataPage) {
        const link = this.shadowRoot.querySelector(`[data-page="${dataPage}"]`);
        if (link) {
            link.remove();
        }
    }

    setBrand(text) {
        const brand = this.shadowRoot.querySelector('.ph-nav-brand');
        if (brand) {
            brand.textContent = text;
        }
    }
});
