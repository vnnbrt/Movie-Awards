// Alerta da página sem dados //
function alerta() {
    alert("Esta página ainda não foi criada e não contém dados.");
}

// Menu responsivo //
document.getElementById('mobile-menu').addEventListener('click', function() {
    let navList = document.getElementById('nav-list');
    if (navList.style.display === '' || navList.style.display === 'none') {
      navList.style.display = 'block';
    } else {
      navList.style.display = 'none';
    }
});