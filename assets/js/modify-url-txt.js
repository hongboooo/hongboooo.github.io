window.onload = function() {modTxt()};

let brkp = 860;
    
function modTxt() {
    let width = window.innerWidth;
    if (width >= brkp) {
        document.getElementById("email").innerHTML = '<i class="fas fa-fw fa-envelope icon-pad-right" aria-hidden="true"></i>' + "zy_cheng@zju.edu.cn";
        document.getElementById("github").innerHTML = '<i class="fab fa-fw fa-github icon-pad-right" aria-hidden="true"></i>' + "Juniper1106";
        document.getElementById("twitter").innerHTML = '<i class="fab fa-fw fa-x-twitter icon-pad-right" aria-hidden="true"></i>' + "zyCHENG_ELF";
    } else {
        document.getElementById("email").innerHTML = '<i class="fas fa-fw fa-envelope icon-pad-right" aria-hidden="true"></i>';
        document.getElementById("github").innerHTML = '<i class="fab fa-fw fa-github icon-pad-right" aria-hidden="true"></i>';
        document.getElementById("twitter").innerHTML = '<i class="fab fa-fw fa-x-twitter icon-pad-right" aria-hidden="true"></i>';
    }
}

window.addEventListener("resize", function(){
      modTxt();
})