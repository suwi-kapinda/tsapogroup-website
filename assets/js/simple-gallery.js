// Simple Gallery Loader - Fallback version without Swiper dependency
document.addEventListener('DOMContentLoaded', function() {
    console.log('Simple gallery loader starting...');
    
    // Get company name from URL
    const path = window.location.pathname;
    const filename = path.split('/').pop();
    
    const companyMapping = {
        'byd-zimbabwe.html': 'byd',
        'chinese-parts-solutions.html': 'chinese-parts-solutions',
        'ctrack-zimbabwe.html': 'ctrack',
        'evca-center.html': 'evca-center',
        'grand-auto-premier.html': 'grand-auto',
        'harakati-logistics-zambia.html': 'harakati-zambia',
        'harakati-logistics-zimbabwe.html': 'harakati-zimbabwe',
        'lindezi-travel-tours.html': 'lindezi',
        'lovol-zimbabwe.html': 'lovol',
        'massbreed-investment-zambia.html': 'massbreed-zambia',
        'massbreed-investment-zimbabwe.html': 'massbreed-zimbabwe',
        'reno-systems.html': 'reno-systems',
        'sinotruk-zimbabwe.html': 'sinotruk',
        'supreme-panel-beaters.html': 'supreme-panel-beaters',
        'tsapo-industries-zambia.html': 'tsapo-industries-zambia',
        'tsapo-motors.html': 'tsapo-motors',
        'tsapo-southern-region.html': 'tsapo-southern-region',
        'zerobay-freight-forwarding.html': 'zerobay'
    };
    
    const companyName = companyMapping[filename];
    console.log('Detected company:', companyName);
    
    if (companyName) {
        loadGalleryImages(companyName);
    }
});

async function loadGalleryImages(companyName) {
    try {
        console.log('Loading images for:', companyName);
        const response = await fetch(`./api/image-manager.php?company=${companyName}`);
        const data = await response.json();
        console.log('API response:', data);
        
        if (data.success && data.images.length > 0) {
            displaySimpleGallery(data.images, companyName);
        } else {
            showNoImages();
        }
    } catch (error) {
        console.error('Error loading gallery:', error);
        showError();
    }
}

function displaySimpleGallery(images, companyName) {
    const container = document.querySelector('.swiper-wrapper');
    if (!container) {
        console.error('Gallery container not found');
        return;
    }
    
    console.log('Displaying', images.length, 'images');
    
    container.innerHTML = '';
    
    images.forEach((image, index) => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        slide.innerHTML = `
            <div class="gallery-item" style="border-radius: 15px; overflow: hidden; box-shadow: 0 8px 25px rgba(0,0,0,0.15); cursor: pointer; transition: transform 0.3s ease;" onclick="openImageModal('${image.name}', '${companyName}')">
                <img src="assets/images/gallery/${companyName}/${image.name}" 
                     alt="${companyName}" 
                     style="width: 100%; height: 300px; object-fit: cover;"
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4='">
            </div>
        `;
        container.appendChild(slide);
    });
    
    // Try to initialize Swiper if available
    setTimeout(() => {
        if (typeof Swiper !== 'undefined') {
            console.log('Initializing Swiper...');
            try {
                const swiper = new Swiper('.gallery-swiper', {
                    slidesPerView: 1,
                    spaceBetween: 30,
                    loop: true,
                    autoplay: {
                        delay: 3000,
                        disableOnInteraction: false,
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                    breakpoints: {
                        768: {
                            slidesPerView: 2,
                        },
                        1024: {
                            slidesPerView: 3,
                        }
                    }
                });
                console.log('Swiper initialized successfully');
            } catch (swiperError) {
                console.error('Swiper initialization failed:', swiperError);
            }
        } else {
            console.log('Swiper not available, using static gallery');
        }
    }, 200);
}

function showNoImages() {
    const container = document.querySelector('.swiper-wrapper');
    if (container) {
        container.innerHTML = `
            <div class="swiper-slide">
                <div class="gallery-item" style="border-radius: 15px; overflow: hidden; box-shadow: 0 8px 25px rgba(0,0,0,0.15); display: flex; align-items: center; justify-content: center; background: #f8f9fa;">
                    <div style="text-align: center; color: #666;">
                        <i class="fas fa-images" style="font-size: 48px; margin-bottom: 15px; opacity: 0.5;"></i>
                        <p>No images available</p>
                    </div>
                </div>
            </div>
        `;
    }
}

function showError() {
    const container = document.querySelector('.swiper-wrapper');
    if (container) {
        container.innerHTML = `
            <div class="swiper-slide">
                <div class="gallery-item" style="border-radius: 15px; overflow: hidden; box-shadow: 0 8px 25px rgba(0,0,0,0.15); display: flex; align-items: center; justify-content: center; background: #f8d7da;">
                    <div style="text-align: center; color: #721c24;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 48px; margin-bottom: 15px;"></i>
                        <p>Error loading images</p>
                    </div>
                </div>
            </div>
        `;
    }
}

function openImageModal(imageName, companyName) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('imageModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'imageModal';
        modal.className = 'modal';
        modal.style.cssText = 'display: none; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.8);';
        modal.innerHTML = `
            <div class="modal-content" style="position: relative; max-width: 90%; max-height: 90%; top: 50%; left: 50%; transform: translate(-50%, -50%);">
                <span class="close" style="position: absolute; top: 15px; right: 25px; color: white; font-size: 35px; font-weight: bold; cursor: pointer; z-index: 1001;">&times;</span>
                <img id="modalImage" src="" alt="Preview" style="max-width: 100%; max-height: 100%; border-radius: 8px;">
            </div>
        `;
        document.body.appendChild(modal);
        
        // Add close functionality
        modal.querySelector('.close').onclick = () => modal.style.display = 'none';
        modal.onclick = (e) => {
            if (e.target === modal) modal.style.display = 'none';
        };
    }
    
    // Set image source and show modal
    const modalImg = document.getElementById('modalImage');
    modalImg.src = `assets/images/gallery/${companyName}/${imageName}`;
    modal.style.display = 'block';
}
