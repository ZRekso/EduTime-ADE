// Affichage DATE
const aujourdHui = new Date();
const options = { weekday: 'long', day: 'numeric', month: 'long'};
let dateFront = new Intl.DateTimeFormat('fr-FR', options).format(aujourdHui);
dateFront = dateFront.charAt(0).toUpperCase() + dateFront.slice(1);

// Prochain cour
let dateADJ = document.querySelector(".txt-dateADJ");
let professeur = document.querySelector(".professeur");
let nomCour = document.querySelector(".nomCour");
let heureDebut = document.querySelector(".heureDebut");
let heureFin = document.querySelector(".heureFin");
let status = document.querySelector(".status")
let barreFin = document.querySelector(".barreFin");
let barreDebut = document.querySelector(".barreDebut");

let nbCourADJ = document.querySelector(".nbCourADJ");

let salle = document.querySelector(".salle");
let TdTpCm = document.querySelector(".TdTpCm");
let txtProchainCour = document.querySelector(".txtProchainCour");
let tempsProchainCour = document.querySelector(".nbTemps");

dateADJ.innerHTML = dateFront;

async function afficherInterface() {
    const tousLesCours = await tableau();
    const courDuJour = [];
    const maintenant = new Date();
    const coursFutursEtActuels = [];
    for (let i = 0; i < tousLesCours.length; i++) {
        const cours = tousLesCours[i];
        if (cours.dateObjetFin > maintenant) {
            coursFutursEtActuels.push(cours);
        }
    }


    coursFutursEtActuels.sort((a, b) => a.dateObjetDebut - b.dateObjetDebut);
    const prochainCours = coursFutursEtActuels[0];
    if (prochainCours) {
        if (maintenant >= prochainCours.dateObjetDebut){
            txtProchainCour.innerHTML = "<span id='cercleEtatE'></span> EN COURS"; // revoir le cerlce plus tard TODO            document.getElementById("hrProchain").classList.remove("remove");
            document.getElementById("hrProchain").classList.add("remove");
            document.getElementById("removeHD").classList.add("remove");
            document.getElementById("removeHF").classList.add("remove");
            document.getElementById("removeT").classList.add("remove");
            document.getElementById("removeS").classList.add("remove");
            document.getElementById("containerStatusNbTemps").classList.remove("profnbTemps")

            // Barre de durée du cour
            const pourcentage = (maintenant - prochainCours.dateObjetDebut) / (prochainCours.dateObjetFin - prochainCours.dateObjetDebut) * 100;
            document.querySelector(".barre-remplie").style.width = pourcentage + "%";

        }
        else{
            txtProchainCour.innerHTML = "<span id='cercleEtatP'></span> PROCHAIN COURS";
            document.getElementById("containerStatusNbTemps").classList.add("profnbTemps")
            document.getElementById("containerStatusNbTemps").classList.remove("remove")
            document.getElementById("hrProchain").classList.remove("remove");
            document.getElementById("removeBarre").classList.add("remove");
            document.getElementById("removeHBarre").classList.add("remove");
            status.innerHTML = "Commence dans"
            const diff = prochainCours.dateObjetDebut - maintenant;
            const heures = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            if (heures > 0) {
                tempsProchainCour.innerHTML = `${heures}h ${minutes} min`;
            } else {
                tempsProchainCour.innerHTML = `${minutes} min`;
            }
        }
        nomCour.innerHTML = prochainCours.titre;
        professeur.innerHTML = prochainCours.professeur;
        heureDebut.innerHTML = prochainCours.heure;
        heureFin.innerHTML = prochainCours.heureFin;
        barreDebut.innerHTML = prochainCours.heure;
        barreFin.innerHTML = prochainCours.heureFin;
        salle.innerHTML = prochainCours.salle;
        heureDebut.innerHTML = prochainCours.heure;
        heureFin.innerHTML = prochainCours.heureFin;
    } else {
        nomCour.innerHTML = "Aucun cours à venir !";
        professeur.innerHTML = "";
        heureDebut.innerHTML = "";
        heureFin.innerHTML = "";
        salle.innerHTML = "";
        TdTpCm.innerHTML = "";
    }

    // Emploi du temps de la journée
    for (let i = 0; i < tousLesCours.length; i++) {
        const cours = tousLesCours[i];
        if (cours.dateObjetDebut.toDateString() === aujourdHui.toDateString()) {
            courDuJour.push(cours);
        }
    }
    courDuJour.sort((a, b) => a.dateObjetDebut - b.dateObjetDebut);
    const CourDeLaJournee = courDuJour[0];

    const AujourdHui = new Date().toLocaleDateString("fr-FR");
    let nbCoursJournee = 0;
    for (let i = 0; i < tousLesCours.length; i++) {
        const cours = tousLesCours[i];
        if (cours.date === AujourdHui) {
            nbCoursJournee++;
        }
    }
    if(nbCoursJournee > 0 ){
        nbCourADJ.innerHTML = nbCoursJournee + " cours";
    }
    else{
        nbCoursJournee = 0;
        nbCourADJ.innerHTML = nbCoursJournee + " cours";
    }


    if (courDuJour.length > 0) {
        let heureDebutJournee = document.querySelector(".heureDebutJournee");
        let heureFinJournee = document.querySelector(".heureFinJournee");
        const debut = courDuJour[0].dateObjetDebut;
        const fin = courDuJour[courDuJour.length - 1].dateObjetFin;

        // TODO Voir si ya pas un bug ou si le tableau est bien trié car pas les bonnes heures
        const heureDebutFormattee = courDuJour[0].heure;
        const heureFinFormattee = courDuJour[courDuJour.length - 1].heureFin;

        heureDebutJournee.innerHTML = heureDebutFormattee;
        heureFinJournee.innerHTML = heureFinFormattee;
        const pourcentage = (maintenant - debut) / (fin - debut) * 100;
        if(pourcentage > 100){
            document.querySelector(".barreJournee-remplie").style.width = 100 + "%";
        }
        else if(pourcentage < 0){
            document.querySelector(".barreJournee-remplie").style.width = 0 + "%";
        }
        else{
            document.querySelector(".barreJournee-remplie").style.width = pourcentage + "%";
        }
        const sectionEDT = document.getElementById("EDTJour");
        if (CourDeLaJournee) {
            for (let i = 0; i < courDuJour.length; i++) {
                const cours = courDuJour[i];
                const carte = document.createElement("div");

                carte.innerHTML = `
                    <div class="container-EDT">
                        <div class="containerHeure">
                            <p class="edt-debut">${cours.heure}</p>
                            <p class="edt-fin">${cours.heureFin}</p>
                        </div>
                        <div class="barreM"></div>
                        <div class="">
                            <p class="edt-titre">${cours.titre}</p>
                            <p class="edt-infos">${cours.TpTdCm} • ${cours.salle} • ${cours.professeur}</p>
                        </div>
                        <div></div> <!-- TODO VOIR PAS SUR POUR LE TXT EN COURS-->
                    </div>
                `;
                carte.querySelector(".barreM").style.backgroundColor = texteEnCouleur(cours.titre);

                if (maintenant >= cours.dateObjetDebut && maintenant <= cours.dateObjetFin) {
                    carte.classList.add("actuel");
                }
                if(maintenant > cours.dateObjetFin){
                    carte.querySelector(".container-EDT").style.opacity =  0.33;
                }
                sectionEDT.appendChild(carte);
            }
        }
    }
    else{
        document.getElementById("removeBarreJournee").classList.add("remove");
        document.getElementById("removeContainerHeure").classList.add("remove");
        document.getElementById("removeContainerI").classList.add("remove");
        document.getElementById("EDTJour").classList.add("remove");
        console.log("test")
        document.getElementById("txt-EDT").classList.add("remove");
        const sectionJour = document.getElementById('jour');
        document.getElementById("jour").classList.add("reprise");
        sectionJour.innerHTML = `
            <div class="containerSVG">
                <svg xmlns="http://www.w3.org/2000/svg" color="#2848c8" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="m9 15.5 2 2 4-4"/></svg>
            </div>
            <div>
                <p class="txt">Pas de cours aujourd'hui</p>
                <p class="txt-gray">Reprise le ${prochainCours.date} à ${prochainCours.heure}</p>
            </div>
          `;
    }

    document.getElementById("infoProchainCour").classList.remove("loading");
    document.getElementById("jour").classList.remove("loading");
    document.getElementById("EDTJour").classList.remove("loading");
    document.getElementById("txt-EDT").classList.remove("loading");
}

afficherInterface();