const API_URL = "https://apiedutime.vercel.app/";

function texteEnCouleur(texte) {
    let hash = 0;
    for (let i = 0; i < texte.length; i++) {
        hash = texte.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${Math.abs(hash) % 360}, 65%, 50%)`;
}

//Aide Claude
function numeroSemaine(date) {
    const jeudi = new Date(date);
    jeudi.setDate(jeudi.getDate() + 3 - ((jeudi.getDay() + 6) % 7));
    const premierJanvier = new Date(jeudi.getFullYear(), 0, 1);
    return Math.ceil(((jeudi - premierJanvier) / 86400000 + 1) / 7);
}

async function tableau() {
    // évite de recharger les données
    let donnees;
    const enCache = sessionStorage.getItem("cours");

    if (enCache) {
        donnees = JSON.parse(enCache);
    } else {
        const reponse = await fetch(API_URL);
        donnees = await reponse.json();
        sessionStorage.setItem("cours", JSON.stringify(donnees));
    }
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