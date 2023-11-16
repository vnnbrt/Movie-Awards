// Alerta da página sem dados

function alerta() {
    alert("Esta página ainda não foi criada e não contém dados.");
}

// Função do botão + em cast e crew

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