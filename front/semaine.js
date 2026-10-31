let courSemaine = [];
let decalage = 0;
const EDTJour = document.getElementById('EDTJour');

async function afficherSemaine() {
    const titreSemaine = document.getElementById('titreSemaine');
    const maintenant = new Date();

    const lundi = new Date(maintenant);
    lundi.setDate(lundi.getDate() - ((lundi.getDay() + 6) % 7));
    lundi.setDate(lundi.getDate() + decalage);

    titreSemaine.innerHTML = `Semaine ${numeroSemaine(lundi)}`;

    const vendredi = new Date(lundi);
    vendredi.setDate(vendredi.getDate() + 4);

    const lundiTxt = new Intl.DateTimeFormat('fr-FR', { day: 'numeric' }).format(lundi);
    const vendrediTxt = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long' }).format(vendredi);

    const duree = document.getElementById('duree');
    duree.innerHTML = `${lundiTxt} - ${vendrediTxt}`;

    // Recup les cours de la semaine
    const tousLesCours = await tableau();
    courSemaine = [];

    for(let i=0; i<=4;i++){
        const CPlundi = new Date(lundi);
        CPlundi.setDate(CPlundi.getDate() +i);
        let coursDuJour = [];
        for (let j =0; j<tousLesCours.length; j++){
            if(tousLesCours[j].dateObjetDebut.toDateString() === CPlundi.toDateString()){
                coursDuJour.push(tousLesCours[j]);
            }
        }
        coursDuJour.sort((a, b) => a.dateObjetDebut - b.dateObjetDebut);
        courSemaine.push({
            date: CPlundi,
            cours: coursDuJour
        });
    }

    // Affichage
    const barreJours = document.getElementById('barreJours');
    barreJours.innerHTML = "";

    for (let i = 0; i < courSemaine.length; i++) {
        const jourCourt = new Intl.DateTimeFormat('fr-FR', { weekday: 'short' }).format(courSemaine[i].date).replace('.', '');

        barreJours.innerHTML += `
            <button onclick="afficherJour(${i})">
                <span class="jourCourt">${jourCourt}</span>
                <span class="jourNumero">${courSemaine[i].date.getDate()}</span>
            </button>
        `;
    }

    let jourActuel = (maintenant.getDay() + 6) % 7;
    if (jourActuel > 4 || decalage !== 0) {
        jourActuel = 0;
    }
    afficherJour(jourActuel);
}

function afficherJour(i) {
    const boutons = document.querySelectorAll('#barreJours button');
    for (let k = 0; k < boutons.length; k++) {
        boutons[k].classList.remove('jourActif');
    }
    boutons[i].classList.add('jourActif');

    EDTJour.innerHTML = "";

    if (courSemaine[i].cours.length === 0) {
        EDTJour.innerHTML = `
            <div class="container-EDT">
                <div class="containerSVG">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="m9 15.5 2 2 4-4"/></svg>
                </div>
                <div>
                    <p class="txt">Pas de cours</p>
                    <p class="txt-gray">Aucun cours prévu ce jour</p>
                </div>
            </div>
        `;
        return;
    }

    for (let j = 0; j < courSemaine[i].cours.length; j++) {
        const cours = courSemaine[i].cours[j];

        EDTJour.innerHTML += `
            <div class="container-EDT">
                <div class="containerHeure">
                    <p class="edt-debut">${cours.heure}</p>
                    <p class="edt-fin">${cours.heureFin}</p>
                </div>
                <div class="barreM" style="background-color: ${texteEnCouleur(cours.titre)}"></div>
                <div class="">
                    <p class="edt-titre">${cours.titre}</p>
                    <p class="edt-infos">${cours.TpTdCm} • ${cours.salle} • ${cours.professeur}</p>
                </div>
            </div>
        `;
    }
}

function semainePrecedente() {
    decalage -= 7;
    afficherSemaine();
}

function semaineSuivante() {
    decalage += 7;
    afficherSemaine();
}

afficherSemaine();