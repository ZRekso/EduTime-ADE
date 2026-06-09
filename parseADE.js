/*
Async permets de mettre en attente tout en continuant d'autre action
ne mets pas tout le programme en pause
*/
async function recupererPlanning() {
    const url = "https://planning-proxy-p139.onrender.com/planning"; // WARNING : LIEN BON juqu'a Septembre (DEVRA ETRE CHANGER)
    try {
        const reponse = await fetch(url);
        const donneeBrute = await reponse.text();
        return donneeBrute
    } catch (erreur) {
        console.error("Impossible", erreur);
    }
}

// recuperer que le professeur dans le tableau TAB 
function filterProfesseur(texte) {
    const txt = texte.trim();
    if (txt === "") return false;
    if (txt.startsWith("#")) return false;
    if (txt.startsWith("Groupe")) return false;
    if (txt.startsWith("B1INFO")) return false;
    if (txt.startsWith("(")) return false;
    if (txt.startsWith("G\r")) return false;
    if (txt.startsWith("A Atteste")) return false;
    return true;
}

function filterGroupe(texte){
    const txt = texte.trim();
    if (!txt.startsWith("Groupe")) return false;
    return true;
}

function filterAnneeBut(texte){
    const txt = texte.trim();
    if (!txt.startsWith("B1INFOS")) return false;
    return true;
}

function filterTdTpCm(texte){
    const txt = texte.trim();
    const type = ""; //todo
    if (!txt.startsWith("B1INFOS")) return false;
    /*
    if(txt.startsWith("B1INFOS1TDC") || txt.startsWith("B1INFOS2TDC")){
        return type = "TD";//todo
    }
    if(txt.startsWith("B1INFOS2CM") || txt.startsWith("B1INFOS1CM")){
        return type = "CM"; //todo
    }
    if(txt.startsWith("B1INFOS2TPC1") || txt.startsWith("B1INFOS1TPC1")){
        return type = "TP" //TODO PB filtre attends vrai ou false 
    }
    */
    return true;
}

async function tableau(){
    const plannings = await recupererPlanning();
    if(plannings == null){
        return  
    }
    /*
    organise le planning (repere les \n pour les retirer et former un tab qui a
    pour chaque indice une ligne)
    */
    const ligne = plannings.split("\n");
    const PlanningActuelle = [];
    evenementActuel = {}; // create OBJ pour stocker les cours par bloque de cour
    for(let i = 0; i<ligne.length; i++){
        if(ligne[i].startsWith("BEGIN:VEVENT")){
            evenementActuel = {};
        }
        if(ligne[i].startsWith("SUMMARY:")){
            const Ressource = ligne[i].replace("SUMMARY:", "");
            evenementActuel.titre = Ressource.trim();
        }
        if(ligne[i].startsWith("LOCATION")){
            const salle = ligne[i].replace("LOCATION:", "");
            evenementActuel.salle = salle.trim();
        }
        if(ligne[i].startsWith("DESCRIPTION:")){
            const descriptionBrut = ligne[i].replace("DESCRIPTION:","");
            const tab = descriptionBrut.split("\\n");
            const professeur = tab.filter(filterProfesseur);
            const tdTpCmFiltre = tab.filter(filterTdTpCm)
            evenementActuel.professeur = professeur.at(-1); // recup length-1 dans le tableau
            const anneeBut = tab.filter(filterAnneeBut);
            const groupe = tab.filter(filterGroupe);
            evenementActuel.anneeBut = anneeBut.at(-1);
            evenementActuel.groupe = groupe;

            //Parcour la suite et reagrde selon les cas 
            let TpTdCm = "";
            for (let i = 0; i < tdTpCmFiltre.length; i++) {
                const ligne = tdTpCmFiltre[i].trim();
            
                if (ligne.startsWith("B1INFOS1TDC") || ligne.startsWith("B1INFOS2TDC")) {
                    TpTdCm = "TD";
                    break;
                }
            
                if (ligne.startsWith("B1INFOS1TPC") || ligne.startsWith("B1INFOS2TPC")) {
                    TpTdCm = "TP";
                    break;
                }
            
                if (ligne.startsWith("B1INFOS1CM") || ligne.startsWith("B1INFOS2CM")) {
                    TpTdCm = "CM";
                    break;
                }
            }
            evenementActuel.TpTdCm = TpTdCm;
            // evenementActuel.description = descriptionBrut;
        }

        //Date Cour debut 
        if(ligne[i].startsWith("DTSTART:")){
            const DTSTART = ligne[i].replace("DTSTART:", "").trim();    
            const annee = DTSTART.substring(0, 4);
            const mois = DTSTART.substring(4, 6);
            const jour = DTSTART.substring(6, 8);
            const heures = parseInt(DTSTART.substring(9, 11));
            const minutes = DTSTART.substring(11, 13);
            const dateUTC = new Date(`${annee}-${mois}-${jour}T${DTSTART.substring(9, 15).replace(/(\d{2})(\d{2})(\d{2})/, '$1:$2:$3')}Z`);
            evenementActuel.dateObjetDebut = dateUTC; 
            evenementActuel.date = dateUTC.toLocaleDateString("fr-FR");   
            evenementActuel.heure = dateUTC.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }); 
        }

        // date cour fin 
        if(ligne[i].startsWith("DTEND:")){
            const DTEND = ligne[i].replace("DTEND:", "").trim();
            const dateUTC = new Date(`${DTEND.substring(0,4)}-${DTEND.substring(4,6)}-${DTEND.substring(6,8)}T${DTEND.substring(9,15).replace(/(\d{2})(\d{2})(\d{2})/, '$1:$2:$3')}Z`);
            evenementActuel.dateObjetFin = dateUTC; 
            evenementActuel.heureFin = dateUTC.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
        }
        
        if(ligne[i].startsWith("END:VEVENT")){
            PlanningActuelle.push(evenementActuel);
        }

    }
    console.log(PlanningActuelle);
    return PlanningActuelle;
}
