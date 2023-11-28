// Alerta da página sem dados //

function alerta() {
    alert("Esta página ainda não foi criada e não contém dados.");
}

// Função do botão + em cast e crew //

function myFunction() {
    let dots = document.getElementById("dots");
    let moreText = document.getElementById("more");
    let btnText = document.getElementById("myBtn");
  
    if (dots.style.display === "none") {
      dots.style.display = "inline";
      btnText.innerHTML = "+"; 
      moreText.style.display = "none";
    } else {
      dots.style.display = "none";
      btnText.innerHTML = "-"; 
      moreText.style.display = "inline";
    }
}

// API filme TETLAMT //

let tituloOriginal = document.getElementById("tituloOriginal");
let notaImdb = document.getElementById("notaImdb");
let anoFilme = document.getElementById("anoFilme");
let genero = document.getElementById("genero");
let duração = document.getElementById("duração");
let sinopseFilme = document.getElementById("sinopseFilme");

fetch("https://www.omdbapi.com/?i=tt6710474&apikey=c0874d8f")
  .then((resp) => resp.json ())
  .then((dados) => {
    console.log((dados));

    tituloOriginal.innerHTML = "Título original: " + dados.Title;
    anoFilme.innerHTML = dados.Year;
    genero.innerHTML = dados.Genre;
    duração.innerHTML = dados.Runtime;
    notaImdb.innerHTML = "Avaliação Imdb: " + dados.imdbRating + "/10"; 
    sinopseFilme.innerHTML = dados.Plot;
    });