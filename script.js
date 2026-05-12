// OMDB Movie Search Application

class MovieSearch {
    constructor() {
        // Configuration
        this.OMDB_API_URL = 'https://www.omdbapi.com/';
        this.API_KEY = '17b22614'; 

        // DOM Elements
        this.searchInput = document.getElementById('searchInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.errorMessage = document.getElementById('errorMessage');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        this.movieContainer = document.getElementById('movieContainer');
        this.searchResults = document.getElementById('searchResults');
        this.welcomeSection = document.getElementById('welcomeSection');

        // Back buttons
        this.backBtn = document.getElementById('backBtn');
        this.backBtn2 = document.getElementById('backBtn2');

        // Movie details elements
        this.movieTitle = document.getElementById('movieTitle');
        this.movieYear = document.getElementById('movieYear');
        this.movieType = document.getElementById('movieType');
        this.movieGenre = document.getElementById('movieGenre');
        this.movieDirector = document.getElementById('movieDirector');
        this.movieActors = document.getElementById('movieActors');
        this.movieRuntime = document.getElementById('movieRuntime');
        this.moviePlot = document.getElementById('moviePlot');
        this.moviePoster = document.getElementById('moviePoster');
        this.movieRating = document.getElementById('movieRating');
        this.resultsList = document.getElementById('resultsList');

        // Initialize
        this.init();
    }

    init() {
        // Event Listeners
        this.searchBtn.addEventListener('click', () => this.search());
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.search();
        });
        this.backBtn.addEventListener('click', () => this.goBackToSearch());
        this.backBtn2.addEventListener('click', () => this.goBackToSearch());

        // Load last search from localStorage if exists
        this.loadLastSearch();
    }

    async search() {
        const query = this.searchInput.value.trim();

        if (!query) {
            this.showError('Please enter a movie name');
            return;
        }

        if (!this.API_KEY || this.API_KEY === 'YOUR_API_KEY_HERE') {
            this.showError('API key is not configured. Please add your OMDB API key to the script.');
            return;
        }

        try {
            this.clearError();
            this.showLoading(true);

            // Search for movies (s = search)
            const response = await fetch(
                `${this.OMDB_API_URL}?apikey=${this.API_KEY}&s=${encodeURIComponent(query)}&type=movie`
            );

            const data = await response.json();

            if (data.Response === 'True' && data.Search && data.Search.length > 0) {
                // If only one result, show details directly
                if (data.Search.length === 1) {
                    await this.showMovieDetails(data.Search[0].imdbID);
                } else {
                    // Show multiple results
                    this.displaySearchResults(data.Search);
                }

                // Save search to localStorage
                this.saveSearch(query);
            } else {
                this.showError(`No movies found for "${query}". Try a different search.`);
            }
        } catch (error) {
            console.error('Search error:', error);
            this.showError('Error searching for movies. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }

    async showMovieDetails(imdbID) {
        try {
            this.showLoading(true);

            const response = await fetch(
                `${this.OMDB_API_URL}?apikey=${this.API_KEY}&i=${imdbID}&plot=full`
            );

            const data = response.ok ? await response.json() : null;

            if (!data || data.Response === 'False') {
                this.showError('Could not load movie details. Please try again.');
                return;
            }

            // Populate movie details
            this.movieTitle.textContent = data.Title || 'N/A';
            this.movieYear.textContent = data.Year || 'N/A';
            this.movieType.textContent = data.Type || 'N/A';
            this.movieGenre.textContent = data.Genre || 'N/A';
            this.movieDirector.textContent = data.Director || 'N/A';
            this.movieActors.textContent = data.Actors || 'N/A';
            this.movieRuntime.textContent = data.Runtime || 'N/A';
            this.moviePlot.textContent = data.Plot || 'No plot summary available';
            this.movieRating.textContent = data.imdbRating !== 'N/A' ? `${data.imdbRating}/10` : 'N/A';

            // Set poster image
            if (data.Poster && data.Poster !== 'N/A') {
                this.moviePoster.src = data.Poster;
                this.moviePoster.alt = data.Title;
            } else {
                this.moviePoster.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="450"%3E%3Crect fill="%23ddd" width="300" height="450"/%3E%3Ctext x="50%" y="50%" font-size="18" fill="%23999" text-anchor="middle" dominant-baseline="middle"%3ENo Poster Available%3C/text%3E%3C/svg%3E';
                this.moviePoster.alt = 'No Poster Available';
            }

            // Show movie details, hide others
            this.hideAllSections();
            this.movieContainer.classList.remove('hidden');

        } catch (error) {
            console.error('Error loading movie details:', error);
            this.showError('Error loading movie details. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }

    displaySearchResults(movies) {
        this.resultsList.innerHTML = '';

        movies.forEach(movie => {
            const card = document.createElement('div');
            card.className = 'result-card';
            card.innerHTML = `
                <img
                    src="${movie.Poster !== 'N/A' ? movie.Poster : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="250"%3E%3Crect fill="%23ddd" width="200" height="250"/%3E%3Ctext x="50%" y="50%" font-size="14" fill="%23999" text-anchor="middle" dominant-baseline="middle"%3ENo Poster%3C/text%3E%3C/svg%3E'}"
                    alt="${movie.Title}"
                    loading="lazy"
                >
                <div class="result-card-info">
                    <div class="result-card-title">${movie.Title}</div>
                    <div class="result-card-year">${movie.Year}</div>
                    <span class="result-card-type">${movie.Type}</span>
                </div>
            `;

            card.addEventListener('click', () => this.showMovieDetails(movie.imdbID));
            this.resultsList.appendChild(card);
        });

        // Show search results section
        this.hideAllSections();
        this.searchResults.classList.remove('hidden');
    }

    goBackToSearch() {
        this.hideAllSections();
        this.welcomeSection.classList.remove('hidden');
        this.searchInput.focus();
    }

    hideAllSections() {
        this.welcomeSection.classList.add('hidden');
        this.movieContainer.classList.add('hidden');
        this.searchResults.classList.add('hidden');
    }

    showLoading(show) {
        if (show) {
            this.loadingSpinner.classList.remove('hidden');
        } else {
            this.loadingSpinner.classList.add('hidden');
        }
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.classList.add('show');
    }

    clearError() {
        this.errorMessage.textContent = '';
        this.errorMessage.classList.remove('show');
    }

    saveSearch(query) {
        try {
            localStorage.setItem('lastSearch', query);
        } catch (e) {
            console.warn('Could not save search to localStorage:', e);
        }
    }

    loadLastSearch() {
        try {
            const lastSearch = localStorage.getItem('lastSearch');
            if (lastSearch) {
                this.searchInput.value = lastSearch;
            }
        } catch (e) {
            console.warn('Could not load last search:', e);
        }
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new MovieSearch();
});
