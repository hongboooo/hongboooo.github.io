window.onload = function() {toggleMode()};

function toggleMode() {
    let modeLogo = document.getElementById('mode-toggler');
    if (modeLogo.innerHTML == '<i id="Light-mode" class="bi bi-moon-stars-fill"></i>') {
        modeLogo.innerHTML = '<i id="Dark-mode" class="bi bi-sun-fill"></i>';
    } else {
        modeLogo.innerHTML = '<i id="Light-mode" class="bi bi-moon-stars-fill"></i>';
    }
    
    let stickyModeLogo = document.getElementById('sticky-mode-toggler');
    if (stickyModeLogo.innerHTML == '<i id="Light-mode" class="bi bi-moon-stars-fill"></i>') {
        stickyModeLogo.innerHTML = '<i id="Dark-mode" class="bi bi-sun-fill"></i>';
    } else {
        stickyModeLogo.innerHTML = '<i id="Light-mode" class="bi bi-moon-stars-fill"></i>';
    }
}