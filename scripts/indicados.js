// Navegação dos anos //
const yearList = document.getElementById('year-list');
const leftArrow = document.querySelector('.arrow-left');
const rightArrow = document.querySelector('.arrow-right');
const allYears = document.querySelectorAll('.year');

function changeYear(selectedYear) {    
    allYears.forEach(year => year.classList.remove('selected'));
    
    const selectedYearElement = document.querySelector(`.year[data-year="${selectedYear}"]`);
    if (selectedYearElement) {
        selectedYearElement.classList.add('selected');
    }
    
    const catalogElement = document.getElementById('catalog');
    catalogElement.innerHTML = '';

    switch (selectedYear) {
        case '2023':
            createMovieGrid('Melhor Filme', '8283974', 10);
            createMovieGrid('Melhor Direção', '8283977', 10);
            createMovieGrid('Melhor Ator', '8283978', 10);
            createMovieGrid('Melhor Atriz', '8283979', 10);
            createMovieGrid('Melhor Ator Coadjuvante', '8283980', 10);
            createMovieGrid('Melhor Atriz Coadjuvante', '8284065', 10);
            createMovieGrid('Melhor Filme Internacional', '8284066', 10);
            createMovieGrid('Melhor Roteiro Original', '8284067', 10);
            createMovieGrid('Melhor Roteiro Adaptado', '8284068', 10);
            createMovieGrid('Melhor Fotografia', '8284069', 10);
            createMovieGrid('Melhor Trilha Sonora', '8284070', 10);
            createMovieGrid('Melhor Canção Original', '8284071', 10);
            createMovieGrid('Melhor Edição', '8284072', 10);
            createMovieGrid('Melhor Figurino', '8284073', 10);
            createMovieGrid('Melhor Design de Produção', '8284074', 10);
            createMovieGrid('Melhor Maquiagem e Cabelo', '8284075', 10);
            createMovieGrid('Melhor Som', '8284076', 10);
            createMovieGrid('Melhores Efeitos Visuais', '8284077', 10);
            createMovieGrid('Melhor Animação em Longa Metragem', '8284078', 10);
            createMovieGrid('Melhor Animação em Curta Metragem', '8284079', 10);
            createMovieGrid('Melhor Curta Metragem em Live Action', '8284080', 10);
            createMovieGrid('Melhor Documentário em Longa Metragem', '8284082', 10);
            createMovieGrid('Melhor Documentário em Curta Metragem', '8284083', 10);
            break;
        case '2022':
            createMovieGrid('Sua Lista de 2022', 'ID_DA_SUA_LISTA_DE_2022', 10);
            // Criar as outras listas
            break;
        // Adicionar os outros anos
        default:
            null;
    }
}

function scrollYears(direction) {
    yearList.scrollLeft += direction * 100;
    updateArrows();
}

function highlightSelectedYear() {
    const currentUrl = window.location.href;

    allYears.forEach(yearElement => {
        const yearLink = yearElement.getAttribute('href');

        if (currentUrl.includes(yearLink)) {
            const selectedYear = yearElement.getAttribute('data-year');
            changeYear(selectedYear);
        }
    });
}

function updateArrows() {
    leftArrow.style.display = yearList.scrollLeft > 0 ? 'block' : 'none';
    rightArrow.style.display = yearList.scrollLeft < yearList.scrollWidth - yearList.clientWidth ? 'block' : 'none';

    if (yearList.clientWidth >= yearList.scrollWidth) {
        leftArrow.style.display = 'none';
        rightArrow.style.display = 'none';
    }
}

window.addEventListener('load', updateArrows);
window.addEventListener('resize', updateArrows);

// Lista de Indicados //
const apiKey = '1c6b6173b321fb9096a6d807cfbfa48a';

async function fetchMovies(listId) {
    const response = await fetch(`https://api.themoviedb.org/4/list/${listId}?api_key=${apiKey}&language=pt-BR`);
    const data = await response.json();
    return data.results;
}

function markAsWatched(title) {
    const posters = document.querySelectorAll('.poster');

    posters.forEach(poster => {
        const posterTitle = poster.querySelector('h3').innerText;

        if (posterTitle === title) {
            const isWatched = JSON.parse(localStorage.getItem(title)) || false;
            localStorage.setItem(title, JSON.stringify(!isWatched));

            poster.classList.toggle('watched', !isWatched);
            const eyeIcon = poster.querySelector('.eye-icon');
            eyeIcon.classList.toggle('fa-eye-slash', !isWatched);
        }
    });
}

function showMovieDetails(movie) {
    window.location.href = `detalhes.html?id=${movie.id}`;
}

function createMovieGrid(listTitle, listId, maxPosters = 5) {
    const catalogElement = document.getElementById('catalog');

    const gridElement = document.createElement('div');
    gridElement.classList.add('grid');
    catalogElement.appendChild(gridElement);

    const listTitleElement = document.createElement('h2');
    listTitleElement.classList.add('list-title');
    listTitleElement.innerText = listTitle;
    gridElement.appendChild(listTitleElement);

    const postersElement = document.createElement('div');
    postersElement.classList.add('posters');
    gridElement.appendChild(postersElement);

    fetchMovies(listId)
        .then(movies => {
            movies.slice(0, maxPosters).forEach(movie => {
                const posterElement = document.createElement('div');
                posterElement.classList.add('poster');
                postersElement.appendChild(posterElement);

                const img = document.createElement('img');
                img.src = `https://image.tmdb.org/t/p/w300${movie.poster_path}`;
                posterElement.appendChild(img);

                const overlay = document.createElement('div');
                overlay.classList.add('overlay');
                posterElement.appendChild(overlay);

                const title = document.createElement('h3');
                title.innerText = movie.title;
                overlay.appendChild(title);

                const overview = document.createElement('p');
                const maxOverviewLength = 150;

                if (movie.overview.length > maxOverviewLength) {
                    overview.innerText = movie.overview.substring(0, maxOverviewLength) + '...';
                } else {
                    overview.innerText = movie.overview;
                }

                overlay.appendChild(overview);

                const eyeIcon = document.createElement('i');
                eyeIcon.classList.add('eye-icon', 'far', 'fa-eye');
                overlay.appendChild(eyeIcon);

                const isWatched = JSON.parse(localStorage.getItem(movie.title)) || false;
                posterElement.classList.toggle('watched', isWatched);
                eyeIcon.classList.toggle('fa-eye-slash', isWatched);

                posterElement.addEventListener('click', () => {
                    showMovieDetails(movie);
                });

                eyeIcon.addEventListener('click', (event) => {
                    event.stopPropagation();
                    markAsWatched(movie.title);
                });
            });
        })
        .catch(error => console.error('Error fetching movies:', error));
}

function filterMoviesByTitle(movies, searchTerm) {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const uniqueMovies = new Map();

    for (const movie of movies) {
        const lowerCaseTitle = movie.title.toLowerCase();

        if (lowerCaseTitle.includes(lowerCaseSearchTerm) && !uniqueMovies.has(lowerCaseTitle)) {
            uniqueMovies.set(lowerCaseTitle, movie);
        }
    }

    return Array.from(uniqueMovies.values());
}

document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.querySelector('.search-form');

    searchForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const searchInput = document.getElementById('search-input');
        const searchTerm = searchInput.value.trim();

        if (searchTerm !== '') {
            window.location.href = `resultados.html?search=${encodeURIComponent(searchTerm)}`;
        }
    });

    const selectedYear = getSelectedYear();
    changeYear(selectedYear);
});

function getSelectedYear() {
    const selectedYearElement = document.querySelector('.year.selected');
    return selectedYearElement ? selectedYearElement.getAttribute('data-year') : null;
}