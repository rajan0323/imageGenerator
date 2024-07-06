const accessKey = 'KXUXHWj868d0Bju55qNLlABwJYs8CaUkzKjnN6PjHv0'; // Make sure this is a valid Unsplash API key
let currentPage = 1;
let currentQuery = '';
let totalPages = 1;

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const colorFilter = document.getElementById('color-filter');
const orientationFilter = document.getElementById('orientation-filter');
const sortFilter = document.getElementById('sort-filter');
const imagesContainer = document.getElementById('images-container');
const loadMoreButton = document.getElementById('load-more');
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');
const pageInfo = document.getElementById('page-info');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const suggestions = document.getElementById('suggestions');
const modal = document.getElementById('image-modal');
const modalImage = document.getElementById('modal-image');
const caption = document.getElementById('caption');
const closeModal = document.getElementsByClassName('close')[0];

// Function to fetch images using Unsplash API
const fetchImages = async (query, pageNo) => {
    let url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=12&page=${pageNo}&client_id=${accessKey}`;

    const category = categoryFilter.value;
    const color = colorFilter.value;
    const orientation = orientationFilter.value;
    const sort = sortFilter.value;

    if (category) {
        url += `&category=${encodeURIComponent(category)}`;
    }

    if (color) {
        url += `&color=${encodeURIComponent(color)}`;
    }

    if (orientation) {
        url += `&orientation=${encodeURIComponent(orientation)}`;
    }

    if (sort) {
        url += `&order_by=${encodeURIComponent(sort)}`;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (pageNo === 1) {
            imagesContainer.innerHTML = ''; // Clear previous results
        }

        if (data.results.length === 0) {
            imagesContainer.innerHTML = '<h2>No images found.</h2>';
            loadMoreButton.style.display = 'none';
        } else {
            data.results.forEach(photo => {
                const imageElement = document.createElement('div');
                imageElement.classList.add('imageDiv');
                imageElement.innerHTML = `<img src="${photo.urls.regular}" alt="${photo.alt_description}" data-full-url="${photo.urls.full}" data-description="${photo.description || photo.alt_description}"/>`;
                imagesContainer.appendChild(imageElement);
            });

            totalPages = data.total_pages;

            pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

            if (data.total_pages <= pageNo) {
                loadMoreButton.style.display = 'none';
            } else {
                loadMoreButton.style.display = 'block';
            }
        }
    } catch (error) {
        console.error('Error fetching images:', error);
        imagesContainer.innerHTML = '<h2>Failed to fetch images. Please try again.</h2>';
        loadMoreButton.style.display = 'none';
    }
};

// Function to fetch search suggestions
const fetchSuggestions = async (query) => {
    if (query.length < 3) {
        suggestions.innerHTML = '';
        return;
    }

    let url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=5&client_id=${accessKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        suggestions.innerHTML = '';

        if (data.results.length > 0) {
            data.results.forEach(photo => {
                const suggestion = document.createElement('div');
                suggestion.textContent = photo.alt_description;
                suggestion.addEventListener('click', () => {
                    searchInput.value = photo.alt_description;
                    currentQuery = photo.alt_description;
                    currentPage = 1;
                    fetchImages(currentQuery, currentPage);
                    suggestions.innerHTML = '';
                });
                suggestions.appendChild(suggestion);
            });
        }
    } catch (error) {
        console.error('Error fetching suggestions:', error);
    }
};

// Event listener for search form submission
searchForm.addEventListener('submit', e => {
    e.preventDefault();
    const inputText = searchInput.value.trim();
    if (inputText !== '') {
        currentQuery = inputText;
        currentPage = 1; // Reset page number for new search
        fetchImages(currentQuery, currentPage);
    } else {
        imagesContainer.innerHTML = '<h2>Please enter a search query.</h2>';
        loadMoreButton.style.display = 'none';
    }
});

// Event listener for load more button
loadMoreButton.addEventListener('click', () => {
    if (currentQuery !== '') {
        currentPage++;
        fetchImages(currentQuery, currentPage);
    }
});

// Event listener for previous button
prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchImages(currentQuery, currentPage);
    }
});

// Event listener for next button
nextButton.addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        fetchImages(currentQuery, currentPage);
    }
});

// Event listener for search input
searchInput.addEventListener('input', () => {
    const inputText = searchInput.value.trim();
    fetchSuggestions(inputText);
});

// Event listener for dark mode toggle
darkModeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
});

// Event listener for image click to open modal
imagesContainer.addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG') {
        modal.style.display = 'block';
        modalImage.src = e.target.getAttribute('data-full-url');
        caption.textContent = e.target.getAttribute('data-description');
    }
});

// Event listener for closing the modal
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Event listener for closing the modal when clicking outside of the image
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});
