// Affichage DATE
const aujourdHui = new Date();
const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
let dateFormatee = new Intl.DateTimeFormat('fr-FR', options).format(aujourdHui);
dateFormatee = dateFormatee.charAt(0).toUpperCase() + dateFormatee.slice(1);


// Prochain cour 
let dateADJ = document.querySelector(".txt-dateADJ");
let professeur = document.querySelector(".professeur");
let nomCour = document.querySelector(".nomCour");
let heureDebut = document.querySelector(".heureDebut");
let salle = document.querySelector(".salle");
let TdTpCm = document.querySelector(".TdTpCm");
let txtProchainCour = document.querySelector(".txtProchainCour");
let tempsProchainCour = document.querySelector(".nbTemps");
let tiret = document.querySelector(".tiret");

//stat
let NbCourADJ = document.querySelector(".NbCourADJ");
let CoursAujourdhui = document.querySelector(".txt-CoursAujourdhui");

let NbCourRestant = document.querySelector(".NbCourRestant");
let txtcourRestant = document.querySelector(".txt-courRestant");

let NbHeureRestant = document.querySelector(".NbHeureRestant");
let txtheureRestant = document.querySelector(".txt-heureRestant");

// cour adj
let ADJSpan = document.querySelector(".ADJSpan");


dateADJ.innerHTML = dateFormatee;

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
        nomCour.innerHTML = prochainCours.titre;
        professeur.innerHTML = prochainCours.professeur;
        heureDebut.innerHTML = prochainCours.heure;
        salle.innerHTML = prochainCours.salle;
        TdTpCm.innerHTML = prochainCours.TpTdCm;
    } else {
        nomCour.innerHTML = "Aucun cours à venir !";
        professeur.innerHTML = "";
        heureDebut.innerHTML = "";
        salle.innerHTML = "";
        TdTpCm.innerHTML = "";
    }
    txtProchainCour.innerHTML = "PROCHAIN COUR";
    
    // Emploi du temps de la journée
    for (let i = 0; i < tousLesCours.length; i++) {
        const cours = tousLesCours[i];
        if (cours.dateObjetDebut.toDateString() === aujourdHui.toDateString()) {
            courDuJour.push(cours);
        }
    }
    courDuJour.sort((a, b) => a.dateObjetDebut - b.dateObjetDebut); // Trie les cour par heure 
    const CourDeLaJournee = courDuJour[0];
    const conteneur = document.querySelector(".emploiDuJour");
    if (CourDeLaJournee) {
        for(let i =0;i<courDuJour.length; i++){
            const cours = courDuJour[i];

            const carte = document.createElement("div");
            carte.classList.add("carteCours");

            carte.innerHTML = `
                <div class="carte-contenu">
                    <div class="carte-gauche">
                        <p class="carte-titre">${cours.titre}</p>
                        <p class="carte-heure">${cours.heure} - ${cours.heureFin}</p>
                    </div>
                    <div class="carte-droite">
                        <span class="carte-badge">${cours.TpTdCm}</span>
                        <p class="carte-salle">${cours.salle}</p>
                    </div>
                </div>
                <hr>
            `;  
            conteneur.appendChild(carte);
        }
    } else {
        // TODO
    }
    ADJSpan.innerHTML = "Aujourd'hui";
    txtProchainCour.innerHTML = "PROCHAIN COUR";




    // Stat NB cour journee
    const AujourdHui = new Date().toLocaleDateString("fr-FR"); 
    let nbCoursJournee = 0; 
    for (let i = 0; i < tousLesCours.length; i++) {
        const cours = tousLesCours[i];
        if (cours.date === AujourdHui) {
            nbCoursJournee++;
        }
    }
    if(nbCoursJournee > 0 ){
        NbCourADJ.innerHTML = nbCoursJournee;
    }
    else{
        nbCoursJournee = 0; 
        NbCourADJ.innerHTML = nbCoursJournee;
    }
    CoursAujourdhui.innerHTML = "Cours / ADJ";

    //stat NB cour restant
    const HeureADJs = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }); 
    let nbCoursRestant = 0; 
    for (let i = 0; i < tousLesCours.length; i++) {
        const cours = tousLesCours[i];
        if (cours.date === AujourdHui && cours.heure > HeureADJs) {
            nbCoursRestant++;
        }
    }
    if(nbCoursRestant > 0 ){
        NbCourRestant.innerHTML = nbCoursJournee;
    }
    else{
        nbCoursRestant = 0; 
        NbCourRestant.innerHTML = nbCoursRestant;
    }
    txtcourRestant.innerHTML = "Cours / RST";

    // Temps restant avant le prochain cours
    if (!prochainCours) {
        tempsProchainCour.innerHTML = "--";
    } else {
        const diff = prochainCours.dateObjetDebut - maintenant;

        if (diff <= 0) {
            tempsProchainCour.innerHTML = "En cours";
            tiret.innerHTML = " - ";
        } else {
            const heures = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            if (heures > 0) {
                tempsProchainCour.innerHTML = `${heures}h ${minutes}min`;
                tiret.innerHTML = " - ";
            } else {
                tempsProchainCour.innerHTML = `${minutes} min`;
                tiret.innerHTML = " - ";
            }
        }
    }

    //stat NB Heure restant
    let nbHeureRestant = 0; 
    for (let i = 0; i < tousLesCours.length; i++) {
        const cours = tousLesCours[i];
        if (cours.date === AujourdHui && cours.heure > HeureADJs) {
            nbHeureRestant = nbHeureRestant + (cours.heureFin - cours.heure);   
        }
    }
    if(nbHeureRestant > 0 ){
        NbHeureRestant.innerHTML = nbHeureRestant;
    }
    else{
        nbHeureRestant = 0; 
        NbHeureRestant.innerHTML = nbHeureRestant;
    }
    txtheureRestant.innerHTML = "Heure";

    document.getElementById("infoProchainCour").classList.remove("loading");
    document.getElementById("Stat").classList.remove("loading");
    document.getElementById("conteneurEmploi").classList.remove("loading");


}

afficherInterface();


/*if (cours.dateObjetFin >= maintenant) {
            nbHeureRestant += (cours.dateObjetFin - Math.max(cours.dateObjetDebut, maintenant));
        }
    }
*/





