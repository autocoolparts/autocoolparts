// AutoCoolParts Interactive Website
class AutoCoolPartsApp {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 8;
        this.isTransitioning = false;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.galleryIndex = 0;
        this.galleryImages = [];
                this.galleryTimer = null;
        this.currentShowcaseVideo = 0;
        this.currentCarouselVideo = 0;
                this.musicEnabled = false;  // Disabled by default - requires user interaction
        this.backgroundMusic = null;
        this.musicStartTime = Date.now();
        this.musicCurrentTime = 0;
        this.musicPaused = false;
        this.musicAutoStarted = false;
        this.musicPausedForVideo = false;
        this.userHasInteracted = false;
        this.musicPromptDismissed = false;
        // Define segments to avoid (promotion parts on slides 2, 4, 5)
        this.promotionSegments = [
            { slide: 1, start: 25, end: 45 },    // Slide 2 (index 1): Skip 25-45 seconds
            { slide: 3, start: 65, end: 85 },    // Slide 4 (index 3): Skip 65-85 seconds
            { slide: 4, start: 105, end: 125 }   // Slide 5 (index 4): Skip 105-125 seconds
        ];
        this.goodMusicSegments = [
            { start: 0, end: 25 },      // Clean segment 1: 0-25 seconds
            { start: 45, end: 65 },     // Clean segment 2: 45-65 seconds
            { start: 85, end: 105 },    // Clean segment 3: 85-105 seconds
            { start: 125, end: 180 }    // Clean segment 4: 125-180 seconds (or end of track)
        ];
        this.showcaseVideos = [
            {
                src: 'public/videos/electric_ac_installed/7b814567-5dda-43dd-9064-bffd2addebcf.MP4',
                title: 'Professional Installation'
            },
            {
                src: 'public/videos/electric_ac_installed/d0138c0809244f9c85070a7669c4e478.MOV',
                title: 'Vehicle Integration'
            },
            {
                src: 'public/videos/electric_ac_installed/VIDEO-2025-05-29-10-44-18.mp4',
                title: 'Compact Solutions'
            }
        ];

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startLoadingAnimation();
        this.setupVideoControls();
        this.setupImageGallery();
        this.setupLazyLoading();
        this.setupBackgroundMusic();
        this.updateProgress();
        this.startAutoGallery();
        this.updateVideoShowcaseVisibility();

        // Set up automatic music prompt after 2.5 seconds
        this.setupAutomaticMusicPrompt();
    }

        startLoadingAnimation() {
        const loadingScreen = document.getElementById('loadingScreen');

        // Preload critical resources
        this.preloadCriticalAssets().then(() => {
            loadingScreen.classList.add('hidden');
            this.showWelcomeAnimation();
        });
    }

    preloadCriticalAssets() {
        return new Promise((resolve) => {
            const criticalAssets = [
                'public/videos/electric_ac_installed/urbania_lounger.mp4'
            ];

            let loadedCount = 0;
            const totalAssets = criticalAssets.length;

            if (totalAssets === 0) {
                resolve();
                return;
            }

            criticalAssets.forEach(asset => {
                if (asset.includes('.mp4')) {
                    const video = document.createElement('video');
                    video.preload = 'metadata';
                    video.onloadedmetadata = () => {
                        loadedCount++;
                        if (loadedCount === totalAssets) resolve();
                    };
                    video.onerror = () => {
                        loadedCount++;
                        if (loadedCount === totalAssets) resolve();
                    };
                    video.src = asset;
                } else {
                    const img = new Image();
                    img.onload = () => {
                        loadedCount++;
                        if (loadedCount === totalAssets) resolve();
                    };
                    img.onerror = () => {
                        loadedCount++;
                        if (loadedCount === totalAssets) resolve();
                    };
                    img.src = asset;
                }
            });

            // Fallback timeout
            setTimeout(() => {
                resolve();
            }, 1500);
        });
    }

    showWelcomeAnimation() {
        const firstSlide = document.querySelector('.slide[data-slide="0"]');
        firstSlide.style.transform = 'scale(1.1)';

        setTimeout(() => {
            firstSlide.style.transform = 'scale(1)';
        }, 800);
    }

    setupEventListeners() {
        // Navigation buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        prevBtn.addEventListener('click', () => this.previousSlide());
        nextBtn.addEventListener('click', () => this.nextSlide());

        // Progress dots
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });

        // Touch gestures
        const container = document.querySelector('.container');
        container.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        container.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));

                                                // Info modal
        const infoBtns = document.querySelectorAll('.info-btn-small');
        const modalOverlay = document.getElementById('modalOverlay');
        const closeModal = document.getElementById('closeModal');

        infoBtns.forEach(btn => {
            btn.addEventListener('click', () => this.openModal());
        });
        closeModal.addEventListener('click', () => this.closeModal());
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) this.closeModal();
        });

        // Modal tabs
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });

        // Floating action button
        const contactFab = document.getElementById('contactFab');
        contactFab.addEventListener('click', () => this.initiateContact());

        // Video showcase modal
        const videoShowcaseBtn = document.getElementById('videoShowcaseBtn');
        const videoShowcaseModal = document.getElementById('videoShowcaseModal');
        const closeShowcaseBtn = document.getElementById('closeShowcaseBtn');

        videoShowcaseBtn.addEventListener('click', () => this.openVideoShowcase());
        closeShowcaseBtn.addEventListener('click', () => this.closeVideoShowcase());
        videoShowcaseModal.addEventListener('click', (e) => {
            if (e.target === videoShowcaseModal) this.closeVideoShowcase();
        });

        // Video showcase controls
        const showcasePrevBtn = document.getElementById('showcasePrevBtn');
        const showcaseNextBtn = document.getElementById('showcaseNextBtn');
        showcasePrevBtn.addEventListener('click', () => this.previousShowcaseVideo());
        showcaseNextBtn.addEventListener('click', () => this.nextShowcaseVideo());

        // Thumbnail clicks
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', () => this.selectShowcaseVideo(index));
        });

        // Video carousel controls
        const carouselPrev = document.getElementById('carouselPrev');
        const carouselNext = document.getElementById('carouselNext');
        const carouselDots = document.querySelectorAll('.carousel-dot');

        if (carouselPrev) carouselPrev.addEventListener('click', () => this.previousCarouselVideo());
        if (carouselNext) carouselNext.addEventListener('click', () => this.nextCarouselVideo());

        carouselDots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.selectCarouselVideo(index));
        });

        // Add click handlers to carousel videos for manual play/pause
        this.setupCarouselVideoControls();

        // Music control
        const musicControlBtn = document.getElementById('musicControlBtn');
        if (musicControlBtn) {
            musicControlBtn.addEventListener('click', () => this.toggleMusic());
        }

        // Intersection Observer for video autoplay
        this.setupVideoObserver();

        // Resize handler
        window.addEventListener('resize', () => this.handleResize());
    }

    setupVideoControls() {
        const muteToggles = document.querySelectorAll('.mute-toggle');

        muteToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                const video = e.target.closest('.slide').querySelector('.product-video');
                const icon = toggle.querySelector('i');

                if (video.muted) {
                    video.muted = false;
                    icon.className = 'fas fa-volume-up';
                    this.showVolumeIndicator('unmuted');
                } else {
                    video.muted = true;
                    icon.className = 'fas fa-volume-mute';
                    this.showVolumeIndicator('muted');
                }
            });
        });
    }

    showVolumeIndicator(state) {
        const indicator = document.createElement('div');
        indicator.className = 'volume-indicator';
        indicator.innerHTML = state === 'muted' ?
            '<i class="fas fa-volume-mute"></i> Muted' :
            '<i class="fas fa-volume-up"></i> Unmuted';

        indicator.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 1rem 2rem;
            border-radius: 25px;
            z-index: 10000;
            font-weight: 600;
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            gap: 0.5rem;
            animation: fadeInOut 2s ease;
        `;

        document.body.appendChild(indicator);

        setTimeout(() => {
            indicator.remove();
        }, 2000);
    }

    setupImageGallery() {
        // No longer needed as slide 3 now uses video instead of image gallery
        this.galleryImages = [];
    }

    setupLazyLoading() {
        // Intersection Observer for lazy loading
        const lazyImageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        lazyImageObserver.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: '50px 0px'
        });

        // Lazy load images
        const lazyImages = document.querySelectorAll('.lazy');
        lazyImages.forEach(img => {
            lazyImageObserver.observe(img);
        });

        // Lazy load videos when slide becomes active
        const lazyVideoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const slide = entry.target;
                    const video = slide.querySelector('video[data-src]');
                    if (video && video.dataset.src) {
                        const source = video.querySelector('source');
                        if (source && source.dataset.src) {
                            source.src = source.dataset.src;
                            video.src = video.dataset.src;
                            video.load();
                            delete video.dataset.src;
                            delete source.dataset.src;
                        }
                    }
                }
            });
        }, {
            threshold: 0.25
        });

        // Observe all slides for video lazy loading
        document.querySelectorAll('.slide').forEach(slide => {
            lazyVideoObserver.observe(slide);
        });
    }

    startAutoGallery() {
        // No auto gallery needed since slide 3 now uses video
        this.galleryTimer = null;
    }

    nextGalleryImage() {
        // No longer needed - slide 3 now uses video instead of gallery
    }

    setupVideoObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const video = entry.target.querySelector('.product-video');
                if (video) {
                    if (entry.isIntersecting) {
                        video.play().catch(e => console.log('Video autoplay failed:', e));
                    } else {
                        video.pause();
                    }
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.slide').forEach(slide => {
            observer.observe(slide);
        });
    }

    handleTouchStart(e) {
        this.touchStartX = e.changedTouches[0].screenX;
    }

    handleTouchEnd(e) {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.previousSlide();
            }
        }
    }

    handleKeyPress(e) {
        switch(e.key) {
            case 'ArrowLeft':
                this.previousSlide();
                break;
            case 'ArrowRight':
                this.nextSlide();
                break;
            case ' ':
                e.preventDefault();
                this.nextSlide();
                break;
            case 'Escape':
                this.closeModal();
                break;
        }
    }

    nextSlide() {
        if (this.isTransitioning || this.currentSlide >= this.totalSlides - 1) return;
        this.goToSlide(this.currentSlide + 1);
    }

    previousSlide() {
        if (this.isTransitioning || this.currentSlide <= 0) return;
        this.goToSlide(this.currentSlide - 1);
    }

    goToSlide(index) {
        if (this.isTransitioning || index === this.currentSlide) return;

        this.isTransitioning = true;

        // Update current slide
        const currentSlideEl = document.querySelector('.slide.active');
        const nextSlideEl = document.querySelector(`.slide[data-slide="${index}"]`);

        // Add transition effects
        this.addSlideTransition(currentSlideEl, nextSlideEl, index > this.currentSlide);

        this.currentSlide = index;
        this.updateProgress();
        this.updateNavigationButtons();
        this.updateVideoShowcaseVisibility();
        this.updateBackgroundMusic();
        this.handleSlideMusic();

        // Reset transition lock
        setTimeout(() => {
            this.isTransitioning = false;
        }, 500);
    }

        addSlideTransition(currentSlide, nextSlide, isNext) {
        // Remove active class from current slide
        currentSlide.classList.remove('active');

        // Add transition classes for smooth animation
        if (isNext) {
            currentSlide.classList.add('prev');
            nextSlide.classList.remove('prev', 'next');
        } else {
            currentSlide.classList.add('next');
            nextSlide.classList.remove('prev', 'next');
        }

        // Activate next slide
        setTimeout(() => {
            nextSlide.classList.add('active');

            // Ensure media is visible and plays
            const video = nextSlide.querySelector('.product-video');
            const images = nextSlide.querySelectorAll('.gallery-image');
            const carousel = nextSlide.querySelector('.video-carousel');

            if (video) {
                video.style.opacity = '1';
                video.style.visibility = 'visible';
                video.currentTime = 0;
                video.play().catch(e => console.log('Video autoplay failed:', e));
            }

            if (images.length > 0) {
                images.forEach(img => {
                    img.style.opacity = '1';
                    img.style.visibility = 'visible';
                });
            }

            // Initialize carousel if present
            if (carousel) {
                this.currentCarouselVideo = 0;
                this.updateCarouselVideo();
            }
        }, 100);

        // Clean up transition classes
        setTimeout(() => {
            currentSlide.classList.remove('prev', 'next');
        }, 500);
    }

    updateProgress() {
        const progressBar = document.getElementById('progressBar');
        const dots = document.querySelectorAll('.dot');

        // Update progress bar
        const progress = ((this.currentSlide + 1) / this.totalSlides) * 100;
        progressBar.style.setProperty('--progress', `${progress}%`);
        progressBar.querySelector('::after') ?
            progressBar.style.setProperty('width', `${progress}%`) :
            progressBar.style.background = `linear-gradient(to right, var(--accent-blue) ${progress}%, var(--bg-tertiary) ${progress}%)`;

        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }

        updateNavigationButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        prevBtn.disabled = this.currentSlide === 0;
        nextBtn.disabled = this.currentSlide === this.totalSlides - 1;
    }

    updateVideoShowcaseVisibility() {
        const videoShowcaseContainer = document.getElementById('videoShowcaseContainer');

        if (videoShowcaseContainer) {
            // Show "More Videos" button only on slide 6 (index 6, which is second-to-last)
            if (this.currentSlide === 6) {
                // Add a small delay for smooth slide-up animation effect
                setTimeout(() => {
                    videoShowcaseContainer.classList.add('visible');
                }, 300);
            } else {
                videoShowcaseContainer.classList.remove('visible');
            }
        }
    }

    openModal() {
        const modalOverlay = document.getElementById('modalOverlay');
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Add entrance animation
        const modalContent = modalOverlay.querySelector('.modal-content');
        modalContent.style.animation = 'modalSlideIn 0.3s ease';
    }

    closeModal() {
        const modalOverlay = document.getElementById('modalOverlay');
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === tabName);
        });

        // Add tab transition effect
        const activeContent = document.getElementById(tabName);
        activeContent.style.animation = 'fadeIn 0.3s ease';
    }

    initiateContact() {
        // Add ripple effect to FAB
        const fab = document.getElementById('contactFab');
        this.addRippleEffect(fab);

        // Show contact options
        this.showContactOptions();
    }

    addRippleEffect(element) {
        const ripple = document.createElement('div');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);

        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            animation: ripple 0.6s ease;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: ${size}px;
            height: ${size}px;
            pointer-events: none;
        `;

        element.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    showContactOptions() {
        const options = document.createElement('div');
        options.className = 'contact-options';
        options.innerHTML = `
            <div class="contact-overlay">
                <div class="contact-menu">
                    <h3>Contact Us</h3>
                    <div class="contact-buttons">
                        <a href="tel:9814723517" class="contact-option call">
                            <i class="fas fa-phone"></i>
                            <span>Call Now</span>
                        </a>
                        <a href="https://wa.me/916239444069" class="contact-option whatsapp" target="_blank">
                            <i class="fab fa-whatsapp"></i>
                            <span>WhatsApp</span>
                        </a>
                        <button class="contact-option close" onclick="this.closest('.contact-options').remove()">
                            <i class="fas fa-times"></i>
                            <span>Close</span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        options.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(20px);
            z-index: 3000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
        `;

        document.body.appendChild(options);
    }

    handleResize() {
        // Recalculate dimensions and positions
        this.updateProgress();
    }

        openVideoShowcase() {
        const modal = document.getElementById('videoShowcaseModal');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Pause background music when video showcase modal opens
        this.pauseMusicForVideo();
        console.log('Music paused - Video showcase opened');

        // Load first video
        this.currentShowcaseVideo = 0;
        this.updateShowcaseVideo();
    }

        closeVideoShowcase() {
        const modal = document.getElementById('videoShowcaseModal');
        modal.classList.remove('active');
        document.body.style.overflow = '';

        // Pause video
        const video = document.getElementById('showcaseVideo');
        video.pause();

        // Resume background music when video showcase modal closes
        this.resumeMusicAfterVideo();
        console.log('Music resumed - Video showcase closed');
    }

    updateShowcaseVideo() {
        const video = document.getElementById('showcaseVideo');
        const videoTitle = document.getElementById('videoTitle');
        const videoCounter = document.getElementById('videoCounter');
        const thumbnails = document.querySelectorAll('.thumbnail');

        const currentVideo = this.showcaseVideos[this.currentShowcaseVideo];

        // Update video source
        video.src = currentVideo.src;
        video.load();

        // Update UI
        videoTitle.textContent = currentVideo.title;
        videoCounter.textContent = `${this.currentShowcaseVideo + 1} / ${this.showcaseVideos.length}`;

        // Update thumbnails
        thumbnails.forEach((thumb, index) => {
            thumb.classList.toggle('active', index === this.currentShowcaseVideo);
        });
    }

    previousShowcaseVideo() {
        this.currentShowcaseVideo = this.currentShowcaseVideo > 0 ?
            this.currentShowcaseVideo - 1 :
            this.showcaseVideos.length - 1;
        this.updateShowcaseVideo();
    }

    nextShowcaseVideo() {
        this.currentShowcaseVideo = (this.currentShowcaseVideo + 1) % this.showcaseVideos.length;
        this.updateShowcaseVideo();
    }

    selectShowcaseVideo(index) {
        this.currentShowcaseVideo = index;
        this.updateShowcaseVideo();
    }

    // Video Carousel Methods
    previousCarouselVideo() {
        this.currentCarouselVideo = this.currentCarouselVideo > 0 ?
            this.currentCarouselVideo - 1 : 2;
        this.updateCarouselVideo();
    }

    nextCarouselVideo() {
        this.currentCarouselVideo = (this.currentCarouselVideo + 1) % 3;
        this.updateCarouselVideo();
    }

    selectCarouselVideo(index) {
        this.currentCarouselVideo = index;
        this.updateCarouselVideo();
    }

        // Background Music Methods
    setupBackgroundMusic() {
        this.backgroundMusic = document.getElementById('backgroundMusic');

        if (this.backgroundMusic) {
            this.backgroundMusic.volume = 0.3; // Set volume to 30%
            this.backgroundMusic.loop = false; // We'll handle looping manually
            this.backgroundMusic.muted = true; // Start muted to comply with autoplay policies
            this.backgroundMusic.preload = 'auto'; // Preload the audio

            this.backgroundMusic.addEventListener('loadedmetadata', () => {
                console.log('Music loaded, duration:', this.backgroundMusic.duration);
                this.musicReady = true;
            });

            this.backgroundMusic.addEventListener('timeupdate', () => {
                this.handleMusicTimeUpdate();
            });

            this.backgroundMusic.addEventListener('ended', () => {
                if (this.musicEnabled && !this.musicPaused) {
                    // Loop back to first good segment
                    this.backgroundMusic.currentTime = this.goodMusicSegments[0].start;
                    this.backgroundMusic.play().catch(e => console.log('Music loop failed:', e));
                }
            });

            // Music prompt will be shown automatically after 10 seconds
        }
    }

    toggleMusic() {
        const musicBtn = document.getElementById('musicControlBtn');
        const icon = musicBtn.querySelector('i');

        if (!this.backgroundMusic) return;

        if (this.musicEnabled && !this.backgroundMusic.paused) {
            // Stop music
            this.backgroundMusic.pause();
            this.musicEnabled = false;
            this.musicPaused = true;
            musicBtn.classList.remove('playing');
            icon.className = 'fas fa-music';
            console.log('Music paused by user');
        } else {
            // Start music
            this.musicEnabled = true;
            this.musicPaused = false;
            this.userHasInteracted = true;
            musicBtn.classList.add('playing');
            icon.className = 'fas fa-pause';

            // Start from first good segment
            this.backgroundMusic.currentTime = this.goodMusicSegments[0].start;
            this.backgroundMusic.muted = false;

            this.backgroundMusic.play().then(() => {
                console.log('Music started successfully');
                this.musicAutoStarted = true;
            }).catch(e => {
                console.log('Music start failed:', e);
                // Revert UI if failed
                this.musicEnabled = false;
                musicBtn.classList.remove('playing');
                icon.className = 'fas fa-music';
            });
        }
    }

    updateBackgroundMusic() {
        // Check if we're on a slide with promotions and need to skip
        if (this.musicEnabled && this.backgroundMusic && !this.backgroundMusic.paused) {
            this.checkForPromotionSkip();
        }
    }

        setupAutomaticMusicPrompt() {
        // Show music prompt automatically after 2.5 seconds
        setTimeout(() => {
            if (!this.musicEnabled && !this.musicPromptDismissed) {
                this.showMusicPrompt();
                console.log('Music prompt shown automatically after 2.5 seconds');
            }
        }, 2500); // 2.5 seconds

        // Also set up user interaction detection as backup
        // If user interacts before 2.5 seconds, show prompt immediately
        const earlyInteractionHandler = () => {
            this.userHasInteracted = true;
            // Remove listeners after first interaction
            ['click', 'touchstart', 'keydown'].forEach(event => {
                document.removeEventListener(event, earlyInteractionHandler);
            });

            // Show music prompt immediately if not already shown
            if (!this.musicEnabled && !this.musicPromptDismissed) {
                setTimeout(() => {
                    this.showMusicPrompt();
                    console.log('Music prompt shown early due to user interaction');
                }, 500);
            }
        };

        // Add interaction listeners for early prompt
        ['click', 'touchstart', 'keydown'].forEach(event => {
            document.addEventListener(event, earlyInteractionHandler, { once: true, passive: true });
        });
    }



    handleMusicTimeUpdate() {
        if (!this.backgroundMusic || !this.musicEnabled) return;

        const currentTime = this.backgroundMusic.currentTime;

        // Check if we've hit a promotion segment and need to skip
        for (const promotion of this.promotionSegments) {
            if (currentTime >= promotion.start && currentTime < promotion.end) {
                // Skip to the end of this promotion
                this.backgroundMusic.currentTime = promotion.end;
                console.log(`Skipped promotion from ${promotion.start}s to ${promotion.end}s`);
                break;
            }
        }
    }

    checkForPromotionSkip() {
        // This method is called when switching slides to ensure we're not in a promotion
        const currentTime = this.backgroundMusic.currentTime;

        for (const promotion of this.promotionSegments) {
            if (currentTime >= promotion.start && currentTime < promotion.end) {
                // Skip to the end of this promotion
                this.backgroundMusic.currentTime = promotion.end;
                break;
            }
        }
    }

    showMusicPrompt() {
        // Don't show prompt if music is already enabled or user has dismissed it
        if (this.musicEnabled || this.musicPromptDismissed) return;

        const prompt = document.createElement('div');
        prompt.className = 'music-prompt';
        prompt.innerHTML = `
            <div class="music-prompt-content">
                <i class="fas fa-music"></i>
                <p>Enjoy background music while browsing?</p>
                <div class="music-prompt-buttons">
                    <button class="music-enable-btn">Yes, Enable Music</button>
                    <button class="music-dismiss-btn">No Thanks</button>
                </div>
            </div>
        `;

        prompt.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.95);
            color: white;
            padding: 2rem;
            border-radius: 15px;
            text-align: center;
            z-index: 10000;
            backdrop-filter: blur(20px);
            border: 1px solid rgba(0, 212, 255, 0.3);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8);
            animation: fadeIn 0.3s ease;
        `;

        // Add button styles
        const styleTag = document.createElement('style');
        styleTag.textContent = `
            .music-prompt-buttons {
                display: flex;
                gap: 1rem;
                margin-top: 1.5rem;
                justify-content: center;
            }
            .music-enable-btn, .music-dismiss-btn {
                padding: 0.8rem 1.5rem;
                border: none;
                border-radius: 25px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                font-family: inherit;
            }
            .music-enable-btn {
                background: linear-gradient(135deg, #00d4ff 0%, #00ffa6 100%);
                color: #0a0a0a;
            }
            .music-enable-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 20px rgba(0, 212, 255, 0.3);
            }
            .music-dismiss-btn {
                background: rgba(255, 255, 255, 0.1);
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.3);
            }
            .music-dismiss-btn:hover {
                background: rgba(255, 255, 255, 0.2);
            }
        `;
        document.head.appendChild(styleTag);

        document.body.appendChild(prompt);

        const enableBtn = prompt.querySelector('.music-enable-btn');
        const dismissBtn = prompt.querySelector('.music-dismiss-btn');

        enableBtn.addEventListener('click', () => {
            this.enableMusic();
            prompt.remove();
            styleTag.remove();
        });

        dismissBtn.addEventListener('click', () => {
            this.musicPromptDismissed = true;
            prompt.remove();
            styleTag.remove();
        });

        // Auto-remove after 8 seconds
        setTimeout(() => {
            if (prompt.parentNode) {
                this.musicPromptDismissed = true;
                prompt.remove();
                styleTag.remove();
            }
        }, 8000);
    }

    enableMusic() {
        if (!this.backgroundMusic) return;

        this.musicEnabled = true;
        this.musicPaused = false;
        this.userHasInteracted = true;

        // Update UI
        const musicBtn = document.getElementById('musicControlBtn');
        if (musicBtn) {
            musicBtn.classList.add('playing');
            const icon = musicBtn.querySelector('i');
            if (icon) icon.className = 'fas fa-pause';
        }

        // Start music from first good segment
        this.backgroundMusic.currentTime = this.goodMusicSegments[0].start;
        this.backgroundMusic.muted = false;

        this.backgroundMusic.play().then(() => {
            console.log('Background music enabled and started');
            this.musicAutoStarted = true;
        }).catch(e => {
            console.log('Failed to start music:', e);
            // Revert if failed
            this.musicEnabled = false;
            if (musicBtn) {
                musicBtn.classList.remove('playing');
                const icon = musicBtn.querySelector('i');
                if (icon) icon.className = 'fas fa-music';
            }
        });
    }

    // Music control for video playback
    pauseMusicForVideo() {
        if (this.backgroundMusic && this.musicEnabled && this.musicAutoStarted && !this.backgroundMusic.paused) {
            this.backgroundMusic.pause();
            this.musicPausedForVideo = true;
            console.log('Background music paused for video playback');
        }
    }

    resumeMusicAfterVideo() {
        if (this.backgroundMusic && this.musicEnabled && this.musicPausedForVideo) {
            this.backgroundMusic.play().catch(e => {
                console.log('Failed to resume background music:', e);
            });
            this.musicPausedForVideo = false;
            console.log('Background music resumed after video');
        }
    }

    handleSlideMusic() {
        // Resume music if it was paused for video and we're not on video carousel slide
        // and the video showcase modal is not open
        const modal = document.getElementById('videoShowcaseModal');
        const isModalOpen = modal && modal.classList.contains('active');

        if (this.currentSlide !== 6 && this.musicPausedForVideo && !isModalOpen) {
            // Pause any playing carousel videos
            const carouselVideos = document.querySelectorAll('.carousel-video');
            carouselVideos.forEach(video => {
                video.pause();
            });

            // Resume background music
            this.resumeMusicAfterVideo();
            console.log('Music resumed - Moved away from video carousel slide');
        }
    }

        setupCarouselVideoControls() {
        const carouselVideos = document.querySelectorAll('.carousel-video');

        carouselVideos.forEach(video => {
            // Add click handler for manual play/pause
            video.addEventListener('click', () => {
                if (video.paused) {
                    // Pause other carousel videos
                    carouselVideos.forEach(otherVideo => {
                        if (otherVideo !== video) {
                            otherVideo.pause();
                        }
                    });

                    // Pause background music when user manually plays video
                    this.pauseMusicForVideo();
                    console.log('Music paused - User clicked carousel video');

                    video.play().catch(e => console.log('Carousel video play failed:', e));
                } else {
                    video.pause();
                    // Resume music when user manually pauses video
                    this.resumeMusicAfterVideo();
                    console.log('Music resumed - User paused carousel video');
                }
            });

            // Resume music when video ends naturally
            video.addEventListener('ended', () => {
                this.resumeMusicAfterVideo();
                console.log('Music resumed - Carousel video ended');
            });
        });
    }

    updateCarouselVideo() {
        const videos = document.querySelectorAll('.carousel-video');
        const dots = document.querySelectorAll('.carousel-dot');

        // Update video visibility
        videos.forEach((video, index) => {
            if (index === this.currentCarouselVideo) {
                video.classList.add('active');
                // Load video source if not already loaded
                if (video.dataset.src && !video.src) {
                    const source = video.querySelector('source');
                    if (source && source.dataset.src) {
                        source.src = source.dataset.src;
                        video.src = video.dataset.src;
                        video.load();
                        delete video.dataset.src;
                        delete source.dataset.src;
                    }
                }

                // Don't auto-play carousel videos or pause music automatically
                // User must click play button to start video and pause music
                video.pause(); // Ensure video is paused by default

            } else {
                video.classList.remove('active');
                video.pause();
            }
        });

        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentCarouselVideo);
        });
    }

    // Performance monitoring
    trackPerformance(action, data = {}) {
        if ('performance' in window) {
            const timestamp = performance.now();
            console.log(`Performance: ${action}`, {
                timestamp,
                slide: this.currentSlide,
                ...data
            });
        }
    }
}

// CSS animations for JavaScript
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }

    @keyframes modalSlideIn {
        from { opacity: 0; transform: translate(-50%, -60%) scale(0.8); }
        to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }

    @keyframes ripple {
        from { width: 0; height: 0; opacity: 0.8; }
        to { width: 100px; height: 100px; opacity: 0; }
    }

    @keyframes fadeInOut {
        0% { opacity: 0; }
        50% { opacity: 1; }
        100% { opacity: 0; }
    }

    .contact-options .contact-overlay {
        background: var(--bg-secondary);
        border-radius: 20px;
        padding: 2rem;
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: var(--shadow-card);
        max-width: 400px;
        width: 90vw;
    }

    .contact-options h3 {
        text-align: center;
        margin-bottom: 2rem;
        font-size: 1.5rem;
        font-weight: 700;
    }

    .contact-buttons {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .contact-option {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        padding: 1rem 1.5rem;
        border-radius: 50px;
        text-decoration: none;
        font-weight: 600;
        transition: all 0.3s ease;
        border: none;
        cursor: pointer;
        font-size: 1rem;
        font-family: inherit;
    }

    .contact-option i {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
    }

    .contact-option.call {
        background: var(--gradient-cta);
        color: var(--bg-primary);
    }

    .contact-option.whatsapp {
        background: #25D366;
        color: white;
    }

    .contact-option.close {
        background: rgba(255, 255, 255, 0.1);
        color: var(--text-primary);
    }

    .contact-option:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-float);
    }

    .volume-indicator {
        animation: fadeInOut 2s ease;
    }

    /* Touch feedback */
    .slide {
        touch-action: pan-y;
        user-select: none;
    }

    /* Improved accessibility */
    .nav-btn:focus,
    .deep-dive-btn:focus,
    .fab:focus {
        outline: 2px solid var(--accent-blue);
        outline-offset: 2px;
    }

    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
        .slide,
        .modal-content,
        .contact-options {
            animation: none !important;
            transition: none !important;
        }
    }

    /* High contrast mode support */
    @media (prefers-contrast: high) {
        :root {
            --bg-primary: #000000;
            --text-primary: #ffffff;
            --accent-blue: #00ffff;
        }
    }
`;

document.head.appendChild(dynamicStyles);

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AutoCoolPartsApp();
});

// Service Worker for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Progressive Web App manifest
const manifestData = {
    name: "AutoCoolParts - Electric AC Solutions",
    short_name: "AutoCoolParts",
    description: "Premium electric AC parts and installation services",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#00d4ff",
    icons: [
        {
            src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDE5MiAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjE5MiIgaGVpZ2h0PSIxOTIiIGZpbGw9IiMwYTBhMGEiLz48cGF0aCBkPSJNOTYgNDBMMTI4IDcySDY0TDk2IDQwWiIgZmlsbD0iIzAwZDRmZiIvPjwvc3ZnPg==",
            sizes: "192x192",
            type: "image/svg+xml"
        }
    ]
};

// Create manifest blob and link
const manifestBlob = new Blob([JSON.stringify(manifestData)], {type: 'application/json'});
const manifestURL = URL.createObjectURL(manifestBlob);
const manifestLink = document.createElement('link');
manifestLink.rel = 'manifest';
manifestLink.href = manifestURL;
document.head.appendChild(manifestLink);

// Analytics and performance tracking
class PerformanceTracker {
    constructor() {
        this.metrics = {};
        this.init();
    }

    init() {
        this.trackPageLoad();
        this.trackUserInteractions();
    }

    trackPageLoad() {
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            this.metrics.pageLoad = {
                domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
                firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime,
                firstContentfulPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime
            };

            console.log('Performance Metrics:', this.metrics.pageLoad);
        });
    }

    trackUserInteractions() {
        let interactionCount = 0;
        ['click', 'touchstart', 'keydown'].forEach(event => {
            document.addEventListener(event, () => {
                interactionCount++;
                this.metrics.interactions = interactionCount;
            });
        });
    }

    getMetrics() {
        return this.metrics;
    }
}

// Initialize performance tracking
const performanceTracker = new PerformanceTracker();

// Error handling and logging
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    // In production, send to analytics service
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    // In production, send to analytics service
});

// Export for potential external use
window.AutoCoolPartsApp = AutoCoolPartsApp;
window.PerformanceTracker = PerformanceTracker;
