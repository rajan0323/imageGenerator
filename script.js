const accessKey = 'KXUXHWj868d0Bju55qNLlABwJYs8CaUkzKjnN6PjHv0';
const searchForm = document.querySelector('form');
const searchContainer = document.querySelector('.images-container');
const searchInput = document.querySelector('.Search-input');
const loadMoreButton = document.querySelector('.load-more');

let currentPage = 1;
let currentQuery = '';

// Function to fetch images using Unsplash API
const fetchImages = async (query, pageNo) => {
    if (pageNo === 1) {
        searchContainer.innerHTML = '<h2>Loading...</h2>'; // Display loading message
    }
    const url = `https://api.unsplash.com/search/photos?query=${query}&per_page=28&page=${pageNo}&client_id=${accessKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (pageNo === 1) {
            searchContainer.innerHTML = ''; // Clear previous results for new search
        }

        if (data.results.length === 0) {
            searchContainer.innerHTML = '<h2>No images found.</h2>';
            loadMoreButton.style.display = 'none'; // Hide load more button if no images found
        } else {
            data.results.forEach(photo => {
                const imageElement = document.createElement('div');
                imageElement.classList.add('imageDiv');
                imageElement.innerHTML = `<img src="${photo.urls.regular}" alt="${photo.alt_description}"/>`;
                
                // Creating overlay
                const overlayElement = document.createElement('div');
                overlayElement.classList.add('overlay');
                const overlayText = document.createElement('h3');
                overlayText.innerText = photo.alt_description || 'No description available'; // Example overlay text
                overlayElement.appendChild(overlayText);
                imageElement.appendChild(overlayElement);
                
                searchContainer.appendChild(imageElement);
            });

            if (data.total_pages <= pageNo) {
                loadMoreButton.style.display = 'none'; // Hide load more button if no more pages
            } else {
                loadMoreButton.style.display = 'block'; // Show load more button if there are more pages
            }
        }
    } catch (error) {
        searchContainer.innerHTML = '<h2>Failed to fetch images. Please try again.</h2>';
        console.error('Error fetching images:', error);
        loadMoreButton.style.display = 'none'; // Hide load more button if an error occurs
    }
}

// Adding event listener to search form
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputText = searchInput.value.trim();
    if (inputText !== '') {
        currentQuery = inputText;
        currentPage = 1; // Reset page number for new search
        fetchImages(currentQuery, currentPage);
    } else {
        searchContainer.innerHTML = '<h2>Please enter a search query.</h2>';
        loadMoreButton.style.display = 'none'; // Hide load more button if no query
    }
});

// Adding event listener to load more button
loadMoreButton.addEventListener('click', () => {
    if (currentQuery !== '') {
        currentPage += 1; // Increment page number
        fetchImages(currentQuery, currentPage);
    }
});
