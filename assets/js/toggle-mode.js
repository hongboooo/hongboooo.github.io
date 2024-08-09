window.onload = function() {toggleMode();};

function toggleMode() {
    let modeLogo = document.getElementById('mode-toggler');
    let icon = modeLogo.querySelector('i');
    let appElement = document.getElementById('app');

    if (icon.id == 'Light-mode' && appElement.classList.contains('theme--light')) {
        icon.id = 'Dark-mode';
        icon.className = 'bi bi-sun-fill';
        appElement.classList.remove('theme--light');
        appElement.classList.add('theme--dark');
    } else if (icon.id == 'Dark-mode' && appElement.classList.contains('theme--dark')) {
        icon.id = 'Light-mode';
        icon.className = 'bi bi-moon-stars-fill';
        appElement.classList.remove('theme--dark');
        appElement.classList.add('theme--light');
    }
    
    let stickyModeLogo = document.getElementById('sticky-mode-toggler');
    if (stickyModeLogo.innerHTML == '<i id="Light-mode" class="bi bi-moon-stars-fill"></i>') {
        stickyModeLogo.innerHTML = '<i id="Dark-mode" class="bi bi-sun-fill"></i>';
    } else {
        stickyModeLogo.innerHTML = '<i id="Light-mode" class="bi bi-moon-stars-fill"></i>';
    }
}