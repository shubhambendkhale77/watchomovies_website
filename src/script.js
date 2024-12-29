const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');

// Store API key in an environment variable or secure location
const API_KEY = '42733cd6'; // Replace this with your actual API key

// Load movies from API
async function loadMovies(searchTerm) {
    const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=${API_KEY}`;
    const res = await fetch(URL, { referrerPolicy: "no-referrer" });
    const data = await res.json();
    if (data.Response === "True") {
        displayMovieList(data.Search);
    }
}

function findMovies() {
    const searchTerm = movieSearchBox.value.trim();
    if (searchTerm.length > 0) {
        searchList.classList.remove('hide-search-list');
        loadMovies(searchTerm);
    } else {
        searchList.classList.add('hide-search-list');
    }
}

function displayMovieList(movies) {
    searchList.innerHTML = "";
    movies.forEach(movie => {
        const moviePoster = movie.Poster !== "N/A" ? movie.Poster : "image_not_found.png";
        const movieListItem = document.createElement('div');
        movieListItem.dataset.id = movie.imdbID; // setting movie id in data-id
        movieListItem.classList.add('search-list-item');
        movieListItem.innerHTML = `
        <div class="search-item-thumbnail">
            <img src="${moviePoster}" alt="Movie Poster">
        </div>
        <div class="search-item-info">
            <h3>${movie.Title}</h3>
            <p>${movie.Year}</p>
        </div>`;
        searchList.appendChild(movieListItem);
    });
    loadMovieDetails();
}

function loadMovieDetails() {
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            searchList.classList.add('hide-search-list');
            movieSearchBox.value = "";
            const result = await fetch(`https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=${API_KEY}`);
            const movieDetails = await result.json();
            displayMovieDetails(movieDetails);
        });
    });
}

function displayMovieDetails(details) {
    const moviePoster = details.Poster !== "N/A" ? details.Poster : "image_not_found.png";
    resultGrid.innerHTML = `
    <div class="movie-poster">
        <img src="${moviePoster}" alt="Movie Poster">
    </div>
    <div class="movie-info">
        <h3 class="movie-title">${details.Title}</h3>
        <ul class="movie-misc-info">
            <li class="year">Year: ${details.Year}</li>
            <li class="rated">Ratings: ${details.Rated}</li>
            <li class="released">Released: ${details.Released}</li>
        </ul>
        <p class="genre"><b>Genre:</b> ${details.Genre}</p>
        <p class="writer"><b>Writer:</b> ${details.Writer}</p>
        <p class="actors"><b>Actors:</b> ${details.Actors}</p>
        <p class="plot"><b>Plot:</b> ${details.Plot}</p>
        <p class="language"><b>Language:</b> ${details.Language}</p>
        <p class="awards"><b><i class="fas fa-award"></i></b> ${details.Awards}</p>
    </div>`;
}

window.addEventListener('click', event => {
    if (event.target.className !== "form-control") {
        searchList.classList.add('hide-search-list');
    }
});
