// OMDB Movie Search Pro - Advanced Edition
// With filters, history, and sorting capabilities

class MovieSearchPro {
    constructor() {
        // Configuration
        this.OMDB_API_URL = 'https://www.omdbapi.com/';
        this.API_KEY = '17b22614';

        // DOM Elements - Search
        this.searchInput = document.getElementById('searchInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.errorMessage = document.getElementById('errorMessage');
        this.loadingSpinner = document.getElementById('loadingSpinner');

        // DOM Elements - Containers
        this.movieContainer = document.getElementById('movieContainer');
        this.searchResults = document.getElementById('searchResults');
        this.welcomeSection = document.getElementById('welcomeSection');

        // Back buttons
        this.backBtn = document.getElementById('backBtn');
        this.backBtn2 = document.getElementById('backBtn2');

        // Movie details
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
        this.resultsCount = document.getElementById('resultsCount');

        // Filters
        this.toggleFiltersBtn = document.getElementById('toggleFiltersBtn');
        this.filtersContainer = document.getElementById('filtersContainer');
        this.yearFrom = document.getElementById('yearFrom');
        this.yearTo = document.getElementById('yearTo');
        this.yearFromLabel = document.getElementById('yearFromLabel');
        this.yearToLabel = document.getElementById('yearToLabel');
        this.typeBtns = document.querySelectorAll('.type-btn');
        this.sortFilter = document.getElementById('sortFilter');
        this.resetFiltersBtn = document.getElementById('resetFiltersBtn');

        // Search History
        this.historyBtn = document.getElementById('historyBtn');
        this.historyDropdown = document.getElementById('historyDropdown');
        this.historyList = document.getElementById('historyList');
        this.clearHistoryBtn = document.getElementById('clearHistoryBtn');

        // Filter state
        this.currentFilters = {
            yearFrom: 1900,
            yearTo: 2026,
            type: 'all',
            sort: 'relevance'
        };

        this.allSearchResults = [];

        // Initialize
        this.init();
    }

    init() {
        // Search events
        this.searchBtn.addEventListener('click', () => this.search());
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.search();
        });

        // Back buttons
        this.backBtn.addEventListener('click', () => this.goBackToSearch());
        this.backBtn2.addEventListener('click', () => this.goBackToSearch());

        // Filters
        this.toggleFiltersBtn.addEventListener('click', () => this.toggleFilters());
        this.yearFrom.addEventListener('input', () => this.updateYearLabels());
        this.yearTo.addEventListener('input', () => this.updateYearLabels());
        this.typeBtns.forEach(btn => {
            btn.addEventListener('click', () => this.setTypeFilter(btn));
        });
        this.sortFilter.addEventListener('change', () => this.applySorting());
        this.resetFiltersBtn.addEventListener('click', () => this.resetFilters());

        // Search History
        this.historyBtn.addEventListener('click', () => this.toggleHistory());
        this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());

        // Close history when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-history')) {
                this.historyDropdown.classList.add('hidden');
            }
        });

        // Close filters when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.filters-panel')) {
                this.filtersContainer.classList.add('hidden');
            }
        });

        // Load last search
        this.loadLastSearch();
        this.renderHistory();
    }

    toggleFilters() {
        this.filtersContainer.classList.toggle('hidden');
    }

    toggleHistory() {
        this.historyDropdown.classList.toggle('hidden');
    }

    updateYearLabels() {
        this.yearFromLabel.textContent = this.yearFrom.value;
        this.yearToLabel.textContent = this.yearTo.value;
        this.currentFilters.yearFrom = parseInt(this.yearFrom.value);
        this.currentFilters.yearTo = parseInt(this.yearTo.value);
    }

    setTypeFilter(btn) {
        this.typeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilters.type = btn.dataset.type;
    }

    applySorting() {
        this.currentFilters.sort = this.sortFilter.value;
        if (this.allSearchResults.length > 0) {
            this.filterAndSortResults();
        }
    }

    resetFilters() {
        this.yearFrom.value = 1900;
        this.yearTo.value = 2026;
        this.updateYearLabels();

        this.typeBtns.forEach(btn => btn.classList.remove('active'));
        this.typeBtns[0].classList.add('active');
        this.currentFilters.type = 'all';

        this.sortFilter.value = 'relevance';
        this.currentFilters.sort = 'relevance';

        if (this.allSearchResults.length > 0) {
            this.filterAndSortResults();
        }
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

            const response = await fetch(
                `${this.OMDB_API_URL}?apikey=${this.API_KEY}&s=${encodeURIComponent(query)}&type=movie`
            );

            const data = await response.json();

            if (data.Response === 'True' && data.Search && data.Search.length > 0) {
                this.allSearchResults = data.Search;

                if (data.Search.length === 1) {
                    await this.showMovieDetails(data.Search[0].imdbID);
                } else {
                    this.filterAndSortResults();
                }

                this.saveSearch(query);
                this.renderHistory();
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

    filterAndSortResults() {
        let filtered = this.allSearchResults;

        // Apply type filter
        if (this.currentFilters.type !== 'all') {
            filtered = filtered.filter(movie => {
                const type = movie.Type.toLowerCase();
                return type === this.currentFilters.type;
            });
        }

        // Apply year filter
        filtered = filtered.filter(movie => {
            const year = parseInt(movie.Year);
            return year >= this.currentFilters.yearFrom && year <= this.currentFilters.yearTo;
        });

        // Apply sorting
        filtered = this.sortResults(filtered);

        this.displaySearchResults(filtered);
    }

    sortResults(results) {
        const sorted = [...results];

        switch (this.currentFilters.sort) {
            case 'year-new':
                sorted.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
                break;
            case 'year-old':
                sorted.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
                break;
            case 'title':
                sorted.sort((a, b) => a.Title.localeCompare(b.Title));
                break;
            case 'rating':
                // Note: search results don't include ratings, so this would need full details
                // For now, we'll keep relevance order
                break;
            case 'relevance':
            default:
                // Keep original order from API (search relevance)
                break;
        }

        return sorted;
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

            this.movieTitle.textContent = data.Title || 'N/A';
            this.movieYear.textContent = data.Year || 'N/A';
            this.movieType.textContent = data.Type || 'N/A';
            this.movieGenre.textContent = data.Genre || 'N/A';
            this.movieDirector.textContent = data.Director || 'N/A';
            this.movieActors.textContent = data.Actors || 'N/A';
            this.movieRuntime.textContent = data.Runtime || 'N/A';
            this.moviePlot.textContent = data.Plot || 'No plot summary available';
            this.movieRating.textContent = data.imdbRating !== 'N/A' ? `${data.imdbRating}/10` : 'N/A';

            if (data.Poster && data.Poster !== 'N/A') {
                this.moviePoster.src = data.Poster;
                this.moviePoster.alt = data.Title;
            } else {
                this.moviePoster.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="450"%3E%3Crect fill="%23ddd" width="300" height="450"/%3E%3Ctext x="50%" y="50%" font-size="18" fill="%23999" text-anchor="middle" dominant-baseline="middle"%3ENo Poster Available%3C/text%3E%3C/svg%3E';
                this.moviePoster.alt = 'No Poster Available';
            }

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
        this.resultsCount.textContent = `${movies.length} result${movies.length !== 1 ? 's' : ''}`;

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

    // Search History
    saveSearch(query) {
        try {
            let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
            history = history.filter(q => q !== query);
            history.unshift(query);
            history = history.slice(0, 10); // Keep last 10 searches
            localStorage.setItem('searchHistory', JSON.stringify(history));
        } catch (e) {
            console.warn('Could not save search to localStorage:', e);
        }
    }

    loadLastSearch() {
        try {
            const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
            if (history.length > 0) {
                this.searchInput.value = history[0];
            }
        } catch (e) {
            console.warn('Could not load last search:', e);
        }
    }

    getSearchHistory() {
        try {
            return JSON.parse(localStorage.getItem('searchHistory') || '[]');
        } catch (e) {
            console.warn('Could not get search history:', e);
            return [];
        }
    }

    renderHistory() {
        const history = this.getSearchHistory();
        this.historyList.innerHTML = '';

        if (history.length === 0) {
            const emptyItem = document.createElement('li');
            emptyItem.textContent = 'No search history';
            emptyItem.style.color = '#999';
            this.historyList.appendChild(emptyItem);
        } else {
            history.forEach(query => {
                const li = document.createElement('li');
                li.textContent = query;
                li.addEventListener('click', () => {
                    this.searchInput.value = query;
                    this.historyDropdown.classList.add('hidden');
                    this.search();
                });
                this.historyList.appendChild(li);
            });
        }
    }

    clearHistory() {
        try {
            localStorage.removeItem('searchHistory');
            this.renderHistory();
        } catch (e) {
            console.warn('Could not clear history:', e);
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new MovieSearchPro();
});
