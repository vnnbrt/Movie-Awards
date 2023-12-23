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
            poster.classList.toggle('watched');
            const eyeIcon = poster.querySelector('.eye-icon');
            eyeIcon.classList.toggle('fa-eye-slash');
        }
    });
}

function showMovieDetails(movie) {
    // Redireciona para a página de detalhes com o ID do filme
    window.location.href = `detalhes.html?id=${movie.id}`;
}

function filterMoviesByTitle(movies, searchTerm) {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const uniqueMovies = new Map();

    for (const movie of movies) {
        const lowerCaseTitle = (movie.title || '').toLowerCase();
        const lowerCaseOriginalTitle = (movie.original_title || '').toLowerCase();

        if (
            (lowerCaseTitle.includes(lowerCaseSearchTerm) || lowerCaseOriginalTitle.includes(lowerCaseSearchTerm)) &&
            !uniqueMovies.has(lowerCaseTitle)
        ) {
            uniqueMovies.set(lowerCaseTitle, movie);
        }
    }

    return Array.from(uniqueMovies.values());
}

document.addEventListener('DOMContentLoaded', async () => {
    const catalogElement = document.getElementById('catalog');

    // Obtém o termo de pesquisa da URL
    const searchParams = new URLSearchParams(window.location.search);
    const searchTerm = searchParams.get('search');

    if (searchTerm !== null) {
        const listIds = ['8283974','8283977','8283978','8283979','8283980','8284065','8284066','8284067','8284068','8284069','8284070','8284071','8284072','8284073','8284074','8284075','8284076','8284077','8284078','8284079','8284080','8284082', '8284083'];
        const allMovies = [];

        // Usando Promise.all para carregar as listas de filmes em paralelo
        await Promise.all(listIds.map(async (listId) => {
            const movies = await fetchMovies(listId);
            allMovies.push(...movies);
        }));

        const filteredMovies = filterMoviesByTitle(allMovies, searchTerm);

        // Limpar o catálogo existente
        catalogElement.innerHTML = '';

        if (filteredMovies.length === 0) {
            // Se não houver resultados, exibe uma mensagem
            const noResultsMessage = document.createElement('p');
            noResultsMessage.innerText = `Nenhum resultado encontrado para: "${searchTerm}"`;
            catalogElement.appendChild(noResultsMessage);
        } else {
            // Criar um novo grid com os resultados da pesquisa
            const searchGridElement = document.createElement('div');
            searchGridElement.classList.add('grid');
            catalogElement.appendChild(searchGridElement);

            const searchTitleElement = document.createElement('h2');
            searchTitleElement.classList.add('list-title');
            searchTitleElement.innerText = `Resultados para: "${searchTerm}"`;
            searchGridElement.appendChild(searchTitleElement);

            const searchPostersElement = document.createElement('div');
            searchPostersElement.classList.add('posters');
            searchGridElement.appendChild(searchPostersElement);

            // Limitar a quantidade de resultados processados (exemplo: 10 resultados)
            const maxResults = 10;
            filteredMovies.slice(0, maxResults).forEach(movie => {
                const posterElement = document.createElement('div');
                posterElement.classList.add('poster');
                searchPostersElement.appendChild(posterElement);

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
                overview.innerText = movie.overview;
                overlay.appendChild(overview);

                const eyeIcon = document.createElement('i');
                eyeIcon.classList.add('eye-icon', 'far', 'fa-eye');
                overlay.appendChild(eyeIcon);

                posterElement.addEventListener('click', () => {
                    showMovieDetails(movie);
                });

                eyeIcon.addEventListener('click', (event) => {
                    event.stopPropagation(); // Impede a propagação do clique
                    markAsWatched(movie.title);
                });
            });
        }
    }
});
