const apiKey = '1c6b6173b321fb9096a6d807cfbfa48a';
const searchParams = new URLSearchParams(window.location.search);
const movieId = searchParams.get('id');

// Consumir API //

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

    await displayNominationsForMovie(movieId);
});

// Consumir JSON data //

async function displayNominationsForMovie(movieId) {
    const nominationsAside = document.getElementById('nominations-aside');
    nominationsAside.innerHTML = ''; 

    const movieNominations = nominationsData.oscar_2023.find(movie => movie.movie_id === movieId);

    if (movieNominations && movieNominations.categorias) {
        for (const category in movieNominations.categorias) {
            const nominees = movieNominations.categorias[category];
            const nominationDiv = createNominationDiv(category, nominees);
            nominationsAside.appendChild(nominationDiv);
        }
    } else {
        const noDataMessage = document.createElement('p');
        noDataMessage.innerText = 'Ainda não constam os dados das indicações';
        nominationsAside.appendChild(noDataMessage);
    }
}

const nominationsData = {
    "oscar_2023": [
        {
          "title": "Aftersun",
          "movie_id": "965150",
          "categorias": {          
            "melhor_ator": [
              "Paul Mescal"
            ]
          }
        },
        {
          "title": "All the Beauty and the Bloodshed",
          "movie_id": "1004663",
          "categorias": {
            "melhor_documentario_em_longa_metragem": [
              "Laura Poitras, Howard Gertler, John Lyons, Nan Goldin e Yoni Golijov"
            ]          
          }
        },
  
        {
          "title": "An Irish Goodbye",
          "movie_id": "889598",
          "categorias": {
            "melhor_curta_metragem_em_live_action": [
              "Tom Berkeley e Ross White (vencedor)"
            ]          
          }
        }, 
        {
          "title": "An Ostrich Told Me the World Is Fake and I Think I Believe It",
          "movie_id": "943776",
          "categorias": {
            "melhor_animação_em_curta_metragem": [
              "Lachlan Pendragon"
            ] 
          }
        },
        {
          "title": "Argentina, 1985",
          "movie_id": "714888",
          "categorias": {
            "melhor_filme_internacional": [
              "Argentina"
            ]          
          }
        },
        {
          "title": "Blonde",
          "movie_id": "301502",
          "categorias": {
            "melhor_atriz": [
              "Ana de Armas"
            ]          
          }
        },  
        {
          "title": "Close",
          "movie_id": "901563",
          "categorias": {
            "melhor_filme_internacional": [
              "Bélgica"
            ]          
          }
        },
        {
          "title": "Elvis",
          "movie_id": "614934",
          "categorias": {
            "melhor_ator": [
              "Austin Butler"
            ],
            "melhor_fotografia": [
              "Mandy Walker"
            ],
            "melhor_figurino": [
              "Catherine Martin"
            ],
            "melhor_edição": [
              "Matt Villa e Jonathan Redmond"
            ],
            "melhor_cabelo_e_maquiagem": [
              "Mark Coulier, Jason Baird e Aldo Signoretti"
            ],
            "melhor_filme": [
              "Baz Luhrmann, Catherine Martin, Gail Berman, Patrick McCormick e Schuyler Weiss"
            ],
            "melhor_design_de_produção": [
              "Catherine Martin e Karen Murphy; Bev Dunn"
            ],
            "melhor_som": [
              "David Lee, Wayne Pashley, Andy Nelson e Michael Keller"
            ]               
          }
        },
        {
          "title": "The Flying Sailor",
          "movie_id": "742872",
          "categorias": {
            "melhor_animação_em_curta_metragem": [
              "Amanda Forbis e Wendy Tilby"
            ]          
          }
        },
        {
          "title": "Le Pupille",
          "movie_id": "974586",
          "categorias": {
            "melhor_curta_metragem_em_live_action": [
              "Alice Rohrwacher e Alfonso Cuarón"
            ]          
          }
        },
        {
          "title": "My Year of Dicks",
          "movie_id": "971188",
          "categorias": {
            "melhor_animação_em_curta_metragem": [
              "Sara Gunnarsdóttir e Pamela Ribon"
            ]          
          }
        },
        {
          "title": "Navalny",
          "movie_id": "926676",
          "categorias": {
            "melhor_documentario_em_longa_metragem": [
              "Daniel Roher, Odessa Rae, Diane Becker, Melanie Miller e Shane Boris"
            ]          
          }
        },
        {
          "title": "Stranger at the Gate",
          "movie_id": "964789",
          "categorias": {
            "melhor_documentario_em_curta_metragem": [
              "Joshua Seftel e Conall Jones"
            ]          
          }
        },
        {
          "title": "Top Gun: Maverick",
          "movie_id": "361743",
          "categorias": {
            "melhor_edição": [
              "Eddie Hamilton"
            ],
            "melhor_canção_original": [
              "Hold My Hand - Lady Gaga e BloodPop"
            ], 
            "melhor_filme": [
              "Tom Cruise, Christopher McQuarrie, David Ellison e Jerry Bruckheimer"
            ], 
            "melhor_som": [
              "Mark Weingarten, James H. Mather, Al Nelson, Chris Burdon e Mark Taylor (vencedor)"
            ],
            "melhores_efeitos_visuais": [
              "Ryan Tudhope, Seth Hill, Bryan Litson e Scott R. Fisher"
            ],
            "melhor_roteiro_adaptado": [
              "Ehren Kruger and Eric Warren Singer e Christopher McQuarrie; Peter Craig e Justin Marks"
            ]         
          }
        },
        {
          "title": "TÁR",
          "movie_id": "817758",
          "categorias": {
            "melhor_atriz": [
              "Cate Blanchett"
            ],
            "melhor_fotografia": [
              "Florian Hoffmeister"
            ],
            "melhor_direção": [
              "Todd Field"
            ],
            "melhor_edição": [
              "Monika Willi"
            ],
            "melhor_filme": [
              "Todd Field, Alexandra Milchan e Scott Lambert"
            ],
            "melhor_roteiro_original": [
              "Todd Field"
            ]      
          }
        },
        {
          "title": "The Whale",
          "movie_id": "785084",
          "categorias": {
            "melhor_ator": [
              "Brendan Fraser (vencedor)"
            ],
            "melhor_atriz_coadjuvante": [
              "Hong Chau"
            ],
            "melhor_cabelo_e_maquiagem": [
              "Adrien Morot, Judy Chin e Annemarie Bradley (vencedor)"
            ]          
          }
        },
        {
          "title": "The Sea Beast",
          "movie_id": "560057",
          "categorias": {
            "melhor_animação_em_longa_metragem": [
              "Chris Williams e Jed Schlanger"
            ]         
          }
        },
        {
          "title": "An Cailín Ciúin",
          "movie_id": "916405",
          "categorias": {
            "melhor_filme_internacional": [
              "Irlanda"
            ]         
          }
        },
        {
          "title": "To Leslie",
          "movie_id": "823147",
          "categorias": {
            "melhor_atriz": [
              "Anrdea Riseborough"
            ]         
          }
        },      
        {
          "title": "Avatar: The Way of Water",
          "movie_id": "76600",
          "categorias": {
            "melhor_filme": [
              "James Cameron e Jon Landau"
            ],
            "melhor_design_de_produção": [
              "Dylan Cole e Ben Procter; Vanessa Cole"
            ],
            "melhor_som": [
              "Julian Howarth, Gwendolyn Yates Whittle, Dick Bernstein, Christopher Boyes, Gary Summers e Michael Hedges"
            ],
            "melhores_efeitos_visuais": [
              "Joe Letteri, Richard Baneham, Eric Saindon and Daniel Barrett (vencedor)"
            ]           
          }
        },
        {
          "title": "Babylon",
          "movie_id": "615777",
          "categorias": {
            "melhor_figurino": [
              "Mary Zophres"
            ],
            "melhor_trilha_sonora": [
              "Justin Hurwitz"
            ],
            "melhor_design_de_produção": [
              "Florencia Martin; Anthony Carlino"
            ]          
          }
        },
        {
          "title": "Bardo, False Chronicle of a Handful of Truths",
          "movie_id": "685691",
          "categorias": {
            "melhor_fotografia": [
              "Darius Khondji"
            ]         
          }
        },
        {
          "title": "The Batman",
          "movie_id": "414906",
          "categorias": {
            "melhor_cabelo_e_maquiagem": [
              "Naomi Donne, Mike Marino e Mike Fontaine"
            ],
            "melhor_som": [
              "Stuart Wilson, William Files, Douglas Murray e Andy Nelson"
            ],
            "melhores_efeitos_visuais": [
              "Dan Lemmon, Russell Earl, Anders Langlands e Dominic Tuohy"
            ]          
          }
        },
        {
          "title": "The Elephant Whisperers",
          "movie_id": "1041580",
          "categorias": {
            "melhor_documentario_em_curta_metragem": [
              "Kartiki Gonsalves e Guneet Monga (vencedor)"
            ]          
          }
        },
        {
          "title": "How Do You Measure A Year?",
          "movie_id": "846854",
          "categorias": {
            "melhor_documentario_em_curta_metragem": [
              "Jay Rosenblatt"
            ]          
          }
        },
        {
          "title": "Tell It Like A Woman",
          "movie_id": "822124",
          "categorias": {
            "melhor_canção_original": [
              "Applause - Diane Warren"
            ]          
          }
        },
        {
          "title": "Women Talking",
          "movie_id": "777245",
          "categorias": {
            "melhor_filme": [
              "Dede Gardner, Jeremy Kleiner e Frances McDormand"
            ],
            "melhor_roteiro_adaptado": [
              "Sarah Polley (vencedor)"
            ]          
          }
        },
        {
          "title": "Women Talking",
          "movie_id": "777245",
          "categorias": {
            "melhor_filme": [
              "Dede Gardner, Jeremy Kleiner e Frances McDormand"
            ],
            "melhor_roteiro_adaptado": [
              "Sarah Polley (vencedor)"
            ]          
          }
        },
        {
          "title": "EO",
          "movie_id": "785398",
          "categorias": {
            "melhor_filme_internacional": [
              "Polônia"
            ]        
          }
        },
        {
          "title": "Puss in Boots The Last Wish",
          "movie_id": "315162",
          "categorias": {
            "melhor_animação_em_longa_metragem": [
              "Joel Crawford e Mark Swift"
            ]        
          }
        },
        {
          "title": "Glass Onion a Knives Out Mystery",
          "movie_id": "661374",
          "categorias": {
            "melhor_roteiro_adaptado": [
              "Rian Johnson"
            ]        
          }
        },
        {
          "title": "Haulout",
          "movie_id": "926993",
          "categorias": {
            "melhor_documentario_em_curta_metragem": [
              "Evgenia Arbugaeva e Maxim Arbugaev"
            ]        
          }
        },
        {
          "title": "Ice Merchants",
          "movie_id": "965171",
          "categorias": {
            "melhor_animação_em_curta_metragem": [
              "João Gonzalez e Bruno Caetano"
            ]        
          }
        },
        {
          "title": "Empire of Light",
          "movie_id": "814757",
          "categorias": {
            "melhor_fotografia": [
              "Roger Deakins"
            ]        
          }
        },
        {
          "title": "Marcel The Shell With Shoes On",
          "movie_id": "869626",
          "categorias": {
            "melhor_animação_em_longa_metragem": [
              "Dean Fleischer Camp, Elisabeth Holm, Andrew Goldman, Caroline Kaplan e Paul Mezey"
            ]        
          }
        },
        {
          "title": "Im Westen Nichts Neues",
          "movie_id": "49046",
          "categorias": {
            "melhor_fotografia": [
              "James Friend (vencedor)"
            ],
            "melhor_filme_internacional": [
              "Alemanha (vencedor)"
            ],
            "melhor_cabelo_e_maquiagem": [
              "Heike Merker e Linda Eisenhamerová"
            ],
            "melhor_trilha_sonora": [
              "Volker Bertelmann (vencedor)"
            ],
            "melhor_filme": [
              "Malte Grunert"
            ],
            "melhor_design_de_produção": [
              "Christian M. Goldbeck; Ernestine Hipper (vencedor)"
            ], 
            "melhor_som": [
              "Viktor Prášil, Frank Kruse, Markus Stemler, Lars Ginzel e Stefan Korte"
            ], 
            "melhores_efeitos_visuais": [
              "Frank Petzold, Viktor Müller, Markus Frank e Kamil Jafar"
            ],
            "melhor_roteiro_adaptado": [
              "Edward Berger, Lesley Paterson e Ian Stokell"
            ]       
          }
        },
        {
          "title": "The Martha Mitchell Effect",
          "movie_id": "914268",
          "categorias": {
            "melhor_documentario_em_curta_metragem": [
              "Anne Alvergue e Beth Levison"
            ]        
          }
        },
        {
          "title": "The Boy The Mole The Fox and The Horse",
          "movie_id": "995133",
          "categorias": {
            "melhor_animação_em_curta_metragem": [
              "Charlie Mackesy e Matthew Freud (vencedor)"
            ]        
          }
        },
        {
          "title": "The Banshees of Inisherin",
          "movie_id": "674324",
          "categorias": {
            "melhor_ator": [
              "Colin Farrel"
            ],
            "melhor_ator_coadjuvante": [
              "Brendan Gleeson",
              "Barry Keoghan"
            ],
            "melhor_atriz_coadjuvante": [
              "Kerry Condon"
            ],
            "melhor_direção": [
              "Martin McDonagh"
            ], 
            "melhor_edição": [
              "Mikkel E.G. Nielsen"
            ], 
            "melhor_trilha_sonora": [
              "Carter Burwell"
            ], 
            "melhor_filme": [
              "Graham Broadbent, Pete Czernin e Martin McDonagh"
            ], 
            "melhor_roteiro_original": [
              "Martin McDonagh"
            ]     
          }
        },
        {
          "title": "The Fabelmans",
          "movie_id": "804095",
          "categorias": {
            "melhor_ator_coadjuvante": [
              "Judd Hirsch"
            ],
            "melhor_atriz_coadjuvante": [
              "Michelle Williams"
            ],
            "melhor_direção": [
              "Steven Spielberg"
            ],
            "melhor_trilha_sonora": [
              "John Williams"
            ],
            "melhor_filme": [
              "Kristie Macosko Krieger, Steven Spielberg e Tony Kushner"
            ],
            "melhor_design_de_produção": [
              "Rick Carter; Karen O'Hara"
            ],
            "melhor_roteiro_original": [
              "Steven Spielberg e Tony Kushner"
            ]         
          }
        },
        {
          "title": "Black Panther: Wakanda Forever",
          "movie_id": "505642",
          "categorias": {
            "melhor_atriz_coadjuvante": [
              "Angela Bassett"
            ], 
            "melhor_figurino": [
              "Ruth Carter (vencedor)"
            ], 
            "melhor_cabelo_e_maquiagem": [
              "Camille Friend e Joel Harlow"
            ], 
            "melhor_canção_original": [
              "Lift Me Up - Rihanna, Ryan Coogler e Ludwig Goransson"
            ], 
            "melhores_efeitos_visuais": [
              "Geoffrey Baumann, Craig Hammack, R. Christopher White e Dan Sudick"
            ]       
          }
        },
        {
          "title": "Causeway",
          "movie_id": "595586",
          "categorias": {
            "melhor_ator_coadjuvante": [
              "Brian Tyree Henry"
            ]                  
          }
        },
        {
          "title": "Guillermo Del Toro's Pinocchio",
          "movie_id": "555604",
          "categorias": {
            "melhor_animação_em_longa_metragem": [
              "Guillermo del Toro, Mark Gustafson, Gary Ungar e Alex Bulkley (vencedor)"
            ]                  
          }
        },
        {
          "title": "Turning Red",
          "movie_id": "508947",
          "categorias": {
            "melhor_animação_em_longa_metragem": [
              "Domee Shi ae Lindsey Collins"
            ]                  
          }
        },
        {
          "title": "RRR",
          "movie_id": "579974",
          "categorias": {
            "melhor_canção_original": [
              "Naatu Naatu - M.M. Keeravaani (vencedor)"
            ]                  
          }
        },
        {
          "title": "Mrs Harris Goes To Paris",
          "movie_id": "579974",
          "categorias": {
            "melhor_figurino": [
              "Jenny Beavan"
            ]                  
          }
        },
        {
          "title": "La Valise Rouge",
          "movie_id": "1032734",
          "categorias": {
            "melhor_curta_metragem_em_live_action": [
              "Cyrus Neshvad"
            ]                  
          }
        },
        {
          "title": "Triangle of Sadness",
          "movie_id": "497828",
          "categorias": {
            "melhor_direção": [
              "Ruben Östlund"
            ],
            "melhor_filme": [
              "Erik Hemmendorff e Philippe Bober"
            ], 
            "melhor_roteiro_original": [
              "Ruben Östlund"
            ]                 
          }
        },
        {
          "title": "Triangle of Sadness",
          "movie_id": "497828",
          "categorias": {
            "melhor_direção": [
              "Ruben Östlund"
            ],
            "melhor_filme": [
              "Erik Hemmendorff e Philippe Bober"
            ], 
            "melhor_roteiro_original": [
              "Ruben Östlund"
            ]                 
          }
        },
        {
          "title": "Everything Everywhere All At Once",
          "movie_id": "545611",
          "categorias": {
            "melhor_ator_coadjuvante": [
              "Ke Huy Quan (vencedor)"
            ],
            "melhor_atriz": [
              "Michelle Yeoh (vencedor)"
            ], 
            "melhor_atriz_coadjuvante": [
              "Jamie Lee Curtis (vencedor)",
              "Stephanie Hsu"
            ],
            "melhor_figurino": [
              "Shirley Kurata"
            ],
            "melhor_direção": [
              "Daniel Kwan e Daniel Scheinert (vencedor)"
            ],
            "melhor_edição": [
              "Paul Rogers (vencedor)"
            ],
            "melhor_trilha_sonora": [
              "Son Lux"
            ], 
            "melhor_canção_original": [
              "This Is A Life - Ryan Lott, David Byrne e Mitski"
            ], 
            "melhor_filme": [
              "Daniel Kwan, Daniel Scheinert e Jonathan Wang (vencedor)"
            ], 
            "melhor_roteiro_original": [
              "Daniel Kwan e Daniel Scheinert (vencedor)"
            ]               
          }
        },
        {
          "title": "All That Breathes",
          "movie_id": "913838",
          "categorias": {
            "melhor_documentario_em_longa_metragem": [
              "Shaunak Sen, Aman Mann e Teddy Leifer"
            ]                
          }
        },      
        {
          "title": "Living",
          "movie_id": "760099",
          "categorias": {
            "melhor_ator": [
              "Bill Nighy"
            ],
            "melhor_roteiro_adaptado": [
              "Kazuo Ishiguro"
            ]                
          }
        },
        {
          "title": "Fire of Love",
          "movie_id": "913823",
          "categorias": {
            "melhor_documentario_em_longa_metragem": [
              "Sara Dosa, Shane Boris e Ina Fichman"
            ]                
          }
        },
        {
          "title": "A House Made of Splinters",
          "movie_id": "913743",
          "categorias": {
            "melhor_documentario_em_longa_metragem": [
              "Simon Lereng Wilmont e Monica Hellström"
            ]                
          }
        }
      ]
  }  

function createNominationDiv(category, nominees) {
    const nominationDiv = document.createElement('div');
    nominationDiv.classList.add('nomination-category');

    const categoryTitle = document.createElement('h3');
    categoryTitle.innerText = category.replace(/_/g, ' '); 
    nominationDiv.appendChild(categoryTitle);

    const nomineesList = document.createElement('ul');
    nomineesList.classList.add('nominees-list');
    nominees.forEach(nominee => {
        const nomineeItem = document.createElement('li');
        nomineeItem.innerText = nominee;

        if (nominee.includes('(vencedor)')) {
            nomineeItem.classList.add('winner');
            categoryTitle.classList.add('winner');
        }

        nomineesList.appendChild(nomineeItem);
    });

    nominationDiv.appendChild(nomineesList);

    return nominationDiv;
}