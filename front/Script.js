const API_URL = "https://apiedutime.vercel.app/";

async function tableau() {
    const reponse = await fetch(API_URL);
    const donnees = await reponse.json();

    const cours = [];
    for (let i = 0; i < donnees.length; i++) {
        const c = donnees[i];
        const debut = new Date(`${c.date}T${c.heure_debut}`);
        const fin = new Date(`${c.date}T${c.heure_fin}`);

        cours.push({
            titre: c.matiere,
            professeur: c.prof || "",
            salle: c.salle || "",
            TpTdCm: c.type_cours || "",
            heure: c.heure_debut.slice(0, 5),      // "08:30:00" -> "08:30"
            heureFin: c.heure_fin.slice(0, 5),
            date: debut.toLocaleDateString("fr-FR"), // "17/10/2026", comme avant
            dateObjetDebut: debut,
            dateObjetFin: fin
        });
    }
    return cours;
}

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
let week = document.querySelector(".week");


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
        // TdTpCm.innerHTML = prochainCours.TpTdCm;



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
    const conteneur = document.querySelector(".emploiDuJour");
    if (CourDeLaJournee) {
        for (let i = 0; i < courDuJour.length; i++) {
            const cours = courDuJour[i];

            const carte = document.createElement("div");
            carte.classList.add("carteCours");

            carte.innerHTML = `
                <div class="cartecontenu">
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

            if (maintenant >= cours.dateObjetDebut && maintenant <= cours.dateObjetFin) {
                carte.querySelector(".cartecontenu").style.backgroundColor = "rgba(148, 147, 147, 0.15)";
            }

            conteneur.appendChild(carte);
        }
    } else {
        week.innerHTML = "Aucun cour aujourd'hui 🎉";
    }
    ADJSpan.innerHTML = "Aujourd'hui";

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
        const minutesDebut = String(debut.getMinutes()).padStart(2, '0');
        const heureDebutFormattee = `${debut.getHours()}:${minutesDebut}`;
        const minutesFin = String(fin.getMinutes()).padStart(2, '0');
        const heureFinFormattee = `${debut.getHours()}:${minutesFin}`;


        heureDebutJournee.innerHTML = heureDebutFormattee;
        heureFinJournee.innerHTML = heureFinFormattee;
        const pourcentage = (maintenant - debut) / (fin - debut) * 100;
        document.querySelector(".barreJournee-remplie").style.width = pourcentage + "%";
    }
    else{
        //TODO
    }




    /*
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
        NbCourRestant.innerHTML = nbCoursRestant;
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
    let msRestantes = 0;
    for (let i = 0; i < tousLesCours.length; i++) {
        const cours = tousLesCours[i];
        if (cours.date === AujourdHui && cours.dateObjetFin > maintenant) {
            // Si le cours a déjà commencé, on ne compte que le temps restant
            msRestantes += cours.dateObjetFin - Math.max(cours.dateObjetDebut, maintenant);
        }
    }
    const minutesRestantes = Math.round(msRestantes / (1000 * 60));
    const heuresRestantes = Math.floor(minutesRestantes / 60);
    const minutesReste = String(minutesRestantes % 60).padStart(2, "0");
    NbHeureRestant.innerHTML = `${heuresRestantes}h${minutesReste}`;
    txtheureRestant.innerHTML = "Heure";

    */
    document.getElementById("infoProchainCour").classList.remove("loading");
    document.getElementById("Stat").classList.remove("loading");
    document.getElementById("conteneurEmploi").classList.remove("loading");

}

afficherInterface();