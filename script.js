class MovieSearchPro {
    constructor() {
        this.OMDB_API_URL = 'https://www.omdbapi.com/';
        this.API_KEY = '17b22614';
        this.ITEMS_PER_PAGE = 24;
        this.currentPage = 1;
        this.allMovies = [];
        this.filteredMovies = [];

        this.initDOMElements();
        this.init();
    }

    initDOMElements() {
        this.searchInput = document.getElementById('searchInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.errorMessage = document.getElementById('errorMessage');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        this.movieContainer = document.getElementById('movieContainer');
        this.searchResults = document.getElementById('searchResults');
        this.welcomeSection = document.getElementById('welcomeSection');
        this.backBtn = document.getElementById('backBtn');
        this.backBtn2 = document.getElementById('backBtn2');

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

        this.toggleFiltersBtn = document.getElementById('toggleFiltersBtn');
        this.filtersContainer = document.getElementById('filtersContainer');
        this.yearFrom = document.getElementById('yearFrom');
        this.yearTo = document.getElementById('yearTo');
        this.yearFromLabel = document.getElementById('yearFromLabel');
        this.yearToLabel = document.getElementById('yearToLabel');
        this.ratingFrom = document.getElementById('ratingFrom');
        this.ratingTo = document.getElementById('ratingTo');
        this.ratingFromLabel = document.getElementById('ratingFromLabel');
        this.ratingToLabel = document.getElementById('ratingToLabel');
        this.typeBtns = document.querySelectorAll('.type-btn');
        this.sortFilter = document.getElementById('sortFilter');
        this.resetFiltersBtn = document.getElementById('resetFiltersBtn');

        this.historyBtn = document.getElementById('historyBtn');
        this.historyDropdown = document.getElementById('historyDropdown');
        this.historyList = document.getElementById('historyList');
        this.clearHistoryBtn = document.getElementById('clearHistoryBtn');

        this.pagination = document.getElementById('pagination');
        this.prevPage = document.getElementById('prevPage');
        this.nextPage = document.getElementById('nextPage');
        this.pageInfo = document.getElementById('pageInfo');

        this.currentFilters = {
            yearFrom: 1900,
            yearTo: 2026,
            ratingFrom: 0,
            ratingTo: 10,
            type: 'all',
            sort: 'relevance'
        };
    }

    init() {
        this.searchBtn.addEventListener('click', () => this.search());
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.search();
        });

        this.backBtn.addEventListener('click', () => this.goBackToSearch());
        this.backBtn2.addEventListener('click', () => this.goBackToSearch());

        this.toggleFiltersBtn.addEventListener('click', () => this.toggleFilters());

        this.yearFrom.addEventListener('input', () => {
            this.updateYearLabels();
            if (this.allMovies.length > 0) {
                this.currentPage = 1;
                this.filterAndSortResults();
            }
        });

        this.yearTo.addEventListener('input', () => {
            this.updateYearLabels();
            if (this.allMovies.length > 0) {
                this.currentPage = 1;
                this.filterAndSortResults();
            }
        });

        this.ratingFrom.addEventListener('input', () => {
            this.updateRatingLabels();
            if (this.allMovies.length > 0) {
                this.currentPage = 1;
                this.filterAndSortResults();
            }
        });

        this.ratingTo.addEventListener('input', () => {
            this.updateRatingLabels();
            if (this.allMovies.length > 0) {
                this.currentPage = 1;
                this.filterAndSortResults();
            }
        });

        this.typeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.setTypeFilter(btn);
                if (this.allMovies.length > 0) {
                    this.currentPage = 1;
                    this.filterAndSortResults();
                }
            });
        });

        this.sortFilter.addEventListener('change', () => this.applySorting());
        this.resetFiltersBtn.addEventListener('click', () => this.resetFilters());

        this.historyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleHistory();
        });

        this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-history')) {
                this.historyDropdown.classList.add('hidden');
            }
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.filters-section')) {
                this.filtersContainer.classList.add('hidden');
            }
        });

        this.prevPage.addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.displaySearchResults(this.filteredMovies);
                window.scrollTo(0, 0);
            }
        });

        this.nextPage.addEventListener('click', () => {
            const totalPages = Math.ceil(this.filteredMovies.length / this.ITEMS_PER_PAGE);
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.displaySearchResults(this.filteredMovies);
                window.scrollTo(0, 0);
            }
        });

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

    updateRatingLabels() {
        this.ratingFromLabel.textContent = parseFloat(this.ratingFrom.value).toFixed(1);
        this.ratingToLabel.textContent = parseFloat(this.ratingTo.value).toFixed(1);
        this.currentFilters.ratingFrom = parseFloat(this.ratingFrom.value);
        this.currentFilters.ratingTo = parseFloat(this.ratingTo.value);
    }

    setTypeFilter(btn) {
        this.typeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilters.type = btn.dataset.type;
    }

    applySorting() {
        this.currentFilters.sort = this.sortFilter.value;
        if (this.allMovies.length > 0) {
            this.currentPage = 1;
            this.filterAndSortResults();
        }
    }

    resetFilters() {
        this.yearFrom.value = 1900;
        this.yearTo.value = 2026;
        this.updateYearLabels();

        this.ratingFrom.value = 0;
        this.ratingTo.value = 10;
        this.updateRatingLabels();

        this.typeBtns.forEach(btn => btn.classList.remove('active'));
        this.typeBtns[0].classList.add('active');
        this.currentFilters.type = 'all';

        this.sortFilter.value = 'relevance';
        this.currentFilters.sort = 'relevance';

        this.currentPage = 1;
        if (this.allMovies.length > 0) {
            this.filterAndSortResults();
        }
    }

    async search() {
        const query = this.searchInput.value.trim();

        if (!query) {
            this.showError('Please enter a movie name');
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
                this.allMovies = data.Search;
                this.currentPage = 1;

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

    async filterAndSortResults() {
        let filtered = [...this.allMovies];

        if (this.currentFilters.type !== 'all') {
            filtered = filtered.filter(movie => {
                const type = movie.Type.toLowerCase();
                return type === this.currentFilters.type;
            });
        }

        filtered = filtered.filter(movie => {
            const year = parseInt(movie.Year);
            return year >= this.currentFilters.yearFrom && year <= this.currentFilters.yearTo;
        });

        if (this.currentFilters.sort === 'rating') {
            for (let movie of filtered) {
                if (!movie.imdbRating) {
                    try {
                        const response = await fetch(
                            `${this.OMDB_API_URL}?apikey=${this.API_KEY}&i=${movie.imdbID}`
                        );
                        const data = await response.json();
                        movie.imdbRating = data.imdbRating !== 'N/A' ? parseFloat(data.imdbRating) : 0;
                    } catch (e) {
                        movie.imdbRating = 0;
                    }
                }
            }

            filtered = filtered.filter(movie => {
                const rating = movie.imdbRating || 0;
                return rating >= this.currentFilters.ratingFrom && rating <= this.currentFilters.ratingTo;
            });
        }

        filtered = this.sortResults(filtered);
        this.filteredMovies = filtered;
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
                sorted.sort((a, b) => (b.imdbRating || 0) - (a.imdbRating || 0));
                break;
            case 'relevance':
            default:
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
        const totalPages = Math.ceil(movies.length / this.ITEMS_PER_PAGE);
        const startIndex = (this.currentPage - 1) * this.ITEMS_PER_PAGE;
        const endIndex = startIndex + this.ITEMS_PER_PAGE;
        const pageMovies = movies.slice(startIndex, endIndex);

        this.resultsList.innerHTML = '';
        this.resultsCount.textContent = `${movies.length} result${movies.length !== 1 ? 's' : ''}`;

        if (pageMovies.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.style.padding = '40px';
            emptyMsg.style.textAlign = 'center';
            emptyMsg.style.color = '#666';
            emptyMsg.style.gridColumn = '1 / -1';
            emptyMsg.textContent = 'No movies match your filters';
            this.resultsList.appendChild(emptyMsg);
        }

        pageMovies.forEach(movie => {
            const card = document.createElement('div');
            card.className = 'result-card';
            card.innerHTML = `
                <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="250"%3E%3Crect fill="%23ddd" width="200" height="250"/%3E%3Ctext x="50%" y="50%" font-size="14" fill="%23999" text-anchor="middle" dominant-baseline="middle"%3ENo Poster%3C/text%3E%3C/svg%3E'}" alt="${movie.Title}" loading="lazy">
                <div class="result-card-info">
                    <div class="result-card-title">${movie.Title}</div>
                    <div class="result-card-year">${movie.Year}</div>
                    <span class="result-card-type">${movie.Type}</span>
                </div>
            `;

            card.addEventListener('click', () => this.showMovieDetails(movie.imdbID));
            this.resultsList.appendChild(card);
        });

        if (movies.length > this.ITEMS_PER_PAGE) {
            this.pagination.classList.remove('hidden');
            this.pageInfo.textContent = `Page ${this.currentPage} of ${totalPages}`;
            this.prevPage.disabled = this.currentPage === 1;
            this.nextPage.disabled = this.currentPage === totalPages;
        } else {
            this.pagination.classList.add('hidden');
        }

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
        this.loadingSpinner.classList.toggle('hidden', !show);
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
            let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
            history = history.filter(q => q !== query);
            history.unshift(query);
            history = history.slice(0, 10);
            localStorage.setItem('searchHistory', JSON.stringify(history));
        } catch (e) {
            console.warn('Could not save search:', e);
        }
    }

    getSearchHistory() {
        try {
            return JSON.parse(localStorage.getItem('searchHistory') || '[]');
        } catch (e) {
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
                li.style.cursor = 'pointer';
                li.addEventListener('click', () => {
                    this.searchInput.value = query;
                    this.historyDropdown.classList.add('hidden');
                    this.search();
                });
                li.addEventListener('mouseover', () => li.style.backgroundColor = '#f0f0f0');
                li.addEventListener('mouseout', () => li.style.backgroundColor = 'transparent');
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

document.addEventListener('DOMContentLoaded', () => {
    new MovieSearchPro();
});
