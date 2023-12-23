const apiKey = '1c6b6173b321fb9096a6d807cfbfa48a';
const searchParams = new URLSearchParams(window.location.search);
const movieId = searchParams.get('id');

async function fetchMovieDetails() {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=pt-BR`);
    const data = await response.json();
    return data;
}

async function fetchMovieCredits() {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}&language=pt-BR`);
    const data = await response.json();
    return data;
}

async function fetchMovieVideos() {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}&language=pt-BR`);
    const data = await response.json();
    return data;
}

async function fetchWatchProviders() {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${apiKey}`);
    const data = await response.json();
    return data;
}

async function fetchMovieImages() {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/images?api_key=${apiKey}`);
    const data = await response.json();
    return data;
}

async function fetchMovieOverview() {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=pt-BR`);
    const data = await response.json();
    return data.overview;
}

function displayMovieDetails(movieDetails) {
    const titlePtBrElement = document.getElementById('title-ptbr');
    const titleOriginalElement = document.getElementById('title-original');
    const releaseYearElement = document.getElementById('release-year');
    const genresElement = document.getElementById('genres');
    const ratingElement = document.getElementById('rating');
    const durationElement = document.getElementById('duration');
    const directorElement = document.getElementById('director');
    const writerElement = document.getElementById('writer');
    const castContainer = document.getElementById('cast');
    const trailerContainer = document.getElementById('trailer');

    titlePtBrElement.innerText = movieDetails.title || 'N/A';
    titleOriginalElement.innerText = `Título original: ${movieDetails.original_title || 'N/A'}`;
    releaseYearElement.innerText = `${movieDetails.release_date ? movieDetails.release_date.substring(0, 4) : 'N/A'}`;
    genresElement.innerText = `${movieDetails.genres ? movieDetails.genres.map(genre => genre.name).join(', ') : 'N/A'}`;
    ratingElement.innerText = `IMDb: ${movieDetails.vote_average.toFixed(1)}/10`;
    durationElement.innerText = `${getFormattedDuration(movieDetails.runtime)}`;
    directorElement.innerText = `Direção: ${movieDetails.credits.crew ? getDirector(movieDetails.credits.crew) : 'N/A'}`;
    writerElement.innerText = `Roteiro: ${movieDetails.credits.crew ? getWriter(movieDetails.credits.crew) : 'N/A'}`;
    
    castContainer.innerText = `Elenco: ${movieDetails.credits.cast ? getCast(movieDetails.credits.cast) : 'N/A'}`;

    const videos = movieDetails.videos.results;

    if (videos && videos.length > 0) {
        const trailerKey = videos.find(video => video.type === 'Trailer' && video.site === 'YouTube');
        if (trailerKey) {
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${trailerKey.key}`;
            trailerContainer.appendChild(iframe);
        } else {
            trailerContainer.innerText = 'Trailer não disponível';
        }
    } else {
        trailerContainer.innerText = 'Trailer não disponível';
    }
}

function getFormattedDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}min`;
}

function getDirector(crew) {
    const director = crew.find(member => member.job === 'Director');
    return director ? director.name : 'N/A';
}

function getWriter(crew) {
    const writer = crew.find(member => member.job === 'Screenplay');
    return writer ? writer.name : 'N/A';
}

function getCast(cast) {
    return cast.slice(0, 4).map(member => member.name).join(', ') || 'N/A';
}

function displayWatchProviders(watchProviders) {
    const brazilProviders = watchProviders.results.BR;

    if (brazilProviders) {
        const watchButton = document.createElement('a');
        watchButton.href = brazilProviders.link;
        watchButton.target = '_blank';
        watchButton.textContent = 'Onde assistir';
        watchButton.classList.add('watch-button');
        
        const trailerContainer = document.getElementById('trailer-container');
        trailerContainer.appendChild(watchButton);
    }
}

function displayMovieOverview(overview) {
    const overviewElement = document.getElementById('movie-overview');
    overviewElement.innerText = overview || 'Sinopse não disponível';
}

function setBackgroundImages(images) {
    const backdropImages = images.backdrops;

    if (backdropImages && backdropImages.length > 0) {
        const firstImage = backdropImages[0];
        const imageUrl = `https://image.tmdb.org/t/p/original${firstImage.file_path}`;

        const backgroundContainer = document.createElement('div');
        backgroundContainer.classList.add('background-container');

        const overlay = document.createElement('div');
        overlay.classList.add('overlay');
        backgroundContainer.appendChild(overlay);

        backgroundContainer.style.backgroundImage = `url(${imageUrl})`;

        console.log('Constructed Image URL:', imageUrl);

        document.body.appendChild(backgroundContainer);
    } else {
        
        console.log('');
    }
}

function displayMoreCast() {
    window.location.href = `https://www.themoviedb.org/movie/${movieId}/cast`;
}

document.addEventListener('DOMContentLoaded', async () => {
    const movieDetails = await fetchMovieDetails();
    const movieCredits = await fetchMovieCredits();
    const movieVideos = await fetchMovieVideos();
    const watchProviders = await fetchWatchProviders();
    const movieImages = await fetchMovieImages();
    const movieOverview = await fetchMovieOverview();

    displayMovieDetails({
        ...movieDetails,
        credits: movieCredits,
        videos: movieVideos,
    });

    displayWatchProviders(watchProviders);
    setBackgroundImages(movieImages);
    displayMovieOverview(movieOverview);

    document.getElementById('btn-more-cast').addEventListener('click', displayMoreCast);
});