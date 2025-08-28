// Social Share Bar Implementation
(function() {
    'use strict';

    // Configuration
    const config = {
        title: document.title,
        url: window.location.href,
        description: document.querySelector('meta[name="description"]')?.content || 'Discover the complete 99 nights in the forest script',
        image: document.querySelector('meta[property="og:image"]')?.content || ''
    };

    // Social media platforms configuration
    const platforms = {
        facebook: {
            name: 'Facebook',
            icon: 'f',
            url: 'https://www.facebook.com/sharer/sharer.php?u=',
            color: '#3b5998'
        },
        twitter: {
            name: 'Twitter',
            icon: 'T',
            url: 'https://twitter.com/intent/tweet?url=',
            color: '#1da1f2'
        },
        linkedin: {
            name: 'LinkedIn',
            icon: 'in',
            url: 'https://www.linkedin.com/sharing/share-offsite/?url=',
            color: '#0077b5'
        },
        pinterest: {
            name: 'Pinterest',
            icon: 'P',
            url: 'https://pinterest.com/pin/create/button/?url=',
            color: '#bd081c'
        }
    };

    // Create social share bar
    function createShareBar() {
        const shareBar = document.createElement('div');
        shareBar.className = 'social-share-bar';
        shareBar.setAttribute('aria-label', 'Social sharing buttons');

        Object.keys(platforms).forEach(platform => {
            const button = createShareButton(platform, platforms[platform]);
            shareBar.appendChild(button);
        });

        return shareBar;
    }

    // Create individual share button
    function createShareButton(platform, config) {
        const button = document.createElement('a');
        button.href = getShareUrl(platform, config);
        button.className = `social-share-btn ${platform}`;
        button.innerHTML = config.icon;
        button.title = `Share on ${config.name}`;
        button.setAttribute('aria-label', `Share on ${config.name}`);
        button.setAttribute('target', '_blank');
        button.setAttribute('rel', 'noopener noreferrer');

        // Add click event
        button.addEventListener('click', function(e) {
            e.preventDefault();
            openShareWindow(this.href, config.name);
            
            // Analytics tracking (if needed)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'share', {
                    'method': platform,
                    'content_type': 'webpage',
                    'content_id': window.location.pathname
                });
            }
        });

        return button;
    }

    // Generate share URL for each platform
    function getShareUrl(platform, platformConfig) {
        const encodedUrl = encodeURIComponent(config.url);
        const encodedTitle = encodeURIComponent(config.title);
        const encodedDescription = encodeURIComponent(config.description);

        switch(platform) {
            case 'facebook':
                return `${platformConfig.url}${encodedUrl}`;
            case 'twitter':
                return `${platformConfig.url}${encodedUrl}&text=${encodedTitle}`;
            case 'linkedin':
                return `${platformConfig.url}${encodedUrl}`;
            case 'pinterest':
                return `${platformConfig.url}${encodedUrl}&description=${encodedDescription}`;
            default:
                return platformConfig.url + encodedUrl;
        }
    }

    // Open share window
    function openShareWindow(url, platform) {
        const windowFeatures = 'width=600,height=400,scrollbars=yes,resizable=yes';
        const newWindow = window.open(url, `share-${platform}`, windowFeatures);
        
        if (newWindow) {
            newWindow.focus();
        }
    }

    // Handle visibility based on scroll position
    function handleScrollVisibility() {
        const shareBar = document.querySelector('.social-share-bar');
        if (!shareBar) return;

        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // Show/hide based on scroll position
        if (scrollTop > 200 && scrollTop < documentHeight - windowHeight - 100) {
            shareBar.style.opacity = '1';
            shareBar.style.visibility = 'visible';
        } else {
            shareBar.style.opacity = '0';
            shareBar.style.visibility = 'hidden';
        }
    }

    // Add smooth transitions
    function addTransitions() {
        const style = document.createElement('style');
        style.textContent = `
            .social-share-bar {
                transition: opacity 0.3s ease, visibility 0.3s ease;
                opacity: 0;
                visibility: hidden;
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize the social share functionality
    function init() {
        // Only initialize if not on mobile initially
        if (window.innerWidth > 768) {
            addTransitions();
            
            const shareBar = createShareBar();
            document.body.appendChild(shareBar);
            
            // Add scroll event listener
            window.addEventListener('scroll', handleScrollVisibility);
            
            // Handle window resize
            window.addEventListener('resize', function() {
                const shareBar = document.querySelector('.social-share-bar');
                if (window.innerWidth <= 768 && shareBar) {
                    shareBar.style.opacity = '1';
                    shareBar.style.visibility = 'visible';
                }
            });
        }
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose to global scope if needed
    window.SocialShare = {
        init: init,
        createShareBar: createShareBar
    };

})(); 