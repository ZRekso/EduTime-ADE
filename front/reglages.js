// Apparence de l'app
const btnclair = document.getElementById('btn-clair');
const btnsombre = document.getElementById('btn-sombre');
const htmlElement = document.documentElement;

if (btnclair && btnsombre) {
    btnclair.addEventListener('click', () => {
        htmlElement.setAttribute('data-theme', 'clair');
        localStorage.setItem('theme', 'clair');
        document.getElementById("clair").classList.add("modeChoisi");
        document.getElementById("cercleClair").classList.add("modeChosiCercle");

        document.getElementById("sombre").classList.remove("modeChoisi");
        document.getElementById("cercleSombre").classList.remove("modeChosiCercle");
    });
    btnsombre.addEventListener('click', () => {
        htmlElement.setAttribute('data-theme', 'sombre');
        localStorage.setItem('theme', 'sombre');
        document.getElementById("clair").classList.remove("modeChoisi");
        document.getElementById("cercleClair").classList.remove("modeChosiCercle");

        document.getElementById("sombre").classList.add("modeChoisi");
        document.getElementById("cercleSombre").classList.add("modeChosiCercle");
    });

    const themeEnregistre = localStorage.getItem('theme');
    if (themeEnregistre === 'sombre') {
        document.getElementById("sombre").classList.add("modeChoisi");
        document.getElementById("cercleSombre").classList.add("modeChosiCercle");
    } else {
        document.getElementById("clair").classList.add("modeChoisi");
        document.getElementById("cercleClair").classList.add("modeChosiCercle");
    }
}