document.addEventListener("DOMContentLoaded", function() {
    let appElement = document.getElementById('app');
    let modeLogo = document.getElementById('mode-toggler');
    let stickyModeLogo = document.getElementById('sticky-mode-toggler');
    let icon = modeLogo.querySelector('i');
    let stickyIcon = stickyModeLogo.querySelector('i');

    if (localStorage.getItem('theme')) {
        appElement.classList.remove('theme--light', 'theme--dark');
        appElement.classList.add(localStorage.getItem('theme'));

        if (localStorage.getItem('theme') == 'theme--light') {
            icon.id = 'Light-mode';
            stickyIcon.id = 'Light-mode';
            icon.className = 'bi bi-moon-stars-fill';
            stickyIcon.className = 'bi bi-moon-stars-fill';
        } else if (localStorage.getItem('theme') == 'theme--dark') {
            icon.id = 'Dark-mode';
            stickyIcon.id = 'Dark-mode';
            icon.className = 'bi bi-sun-fill';
            stickyIcon.className = 'bi bi-sun-fill';
        }
    }

    modeLogo.addEventListener('click', function() {
        if (icon.id == 'Light-mode' && stickyIcon.id == 'Light-mode' && appElement.classList.contains('theme--light')) {
            icon.id = 'Dark-mode';
            stickyIcon.id = 'Dark-mode';
            icon.className = 'bi bi-sun-fill';
            stickyIcon.className = 'bi bi-sun-fill';
    
            appElement.classList.remove('theme--light');
            appElement.classList.add('theme--dark');
    
            localStorage.setItem('theme', 'theme--dark');
        } else if (icon.id == 'Dark-mode' && stickyIcon.id == 'Dark-mode' && appElement.classList.contains('theme--dark')) {
            icon.id = 'Light-mode';
            stickyIcon.id = 'Light-mode';
            icon.className = 'bi bi-moon-stars-fill';
            stickyIcon.className = 'bi bi-moon-stars-fill';
    
            appElement.classList.remove('theme--dark');
            appElement.classList.add('theme--light');
    
            localStorage.setItem('theme', 'theme--light');
        }
    })
    
    stickyModeLogo.addEventListener('click', function() {
        if (icon.id == 'Light-mode' && stickyIcon.id == 'Light-mode' && appElement.classList.contains('theme--light')) {
            icon.id = 'Dark-mode';
            stickyIcon.id = 'Dark-mode';
            icon.className = 'bi bi-sun-fill';
            stickyIcon.className = 'bi bi-sun-fill';
    
            appElement.classList.remove('theme--light');
            appElement.classList.add('theme--dark');
    
            localStorage.setItem('theme', 'theme--dark');
        } else if (icon.id == 'Dark-mode' && stickyIcon.id == 'Dark-mode' && appElement.classList.contains('theme--dark')) {
            icon.id = 'Light-mode';
            stickyIcon.id = 'Light-mode';
            icon.className = 'bi bi-moon-stars-fill';
            stickyIcon.className = 'bi bi-moon-stars-fill';
    
            appElement.classList.remove('theme--dark');
            appElement.classList.add('theme--light');
    
            localStorage.setItem('theme', 'theme--light');
        }
    })
});