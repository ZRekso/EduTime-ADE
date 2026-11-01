let courSemaine = [];
let flecheDecal = 0;
const aujourdHui = new Date();

function suivant(){
    flecheDecal += 7;
    afficherSemaine();
}

function precedent(){
    flecheDecal -= 7;
    afficherSemaine();
}

async function afficherSemaine() {
    const titreSemaine = document.getElementById('titreSemaine');
    const maintenant = new Date();
    maintenant.setDate(maintenant.getDate() + flecheDecal);

    titreSemaine.innerHTML = `Semaine ${numeroSemaine(maintenant)}`;

    const lundi = new Date(maintenant);
    lundi.setDate(lundi.getDate() - ((lundi.getDay() + 6) % 7));

    const vendredi = new Date(lundi);
    vendredi.setDate(vendredi.getDate() + 4);

    const lundiTxt = new Intl.DateTimeFormat('fr-FR', { day: 'numeric' }).format(lundi);
    const vendrediTxt = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long' }).format(vendredi);

    const duree = document.getElementById('duree');
    duree.innerHTML = `${lundiTxt} - ${vendrediTxt}`;

    // Recup les cours de la semaine
    const tousLesCours = await tableau();
    courSemaine =[];
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
    for(let i=0;i<courSemaine.length; i++){
        const jourAbrege = new Intl.DateTimeFormat('fr-FR', { weekday: 'short' }).format(courSemaine[i].date);
        const resultat = jourAbrege.replace('.', '');
        barreJours.innerHTML += `
            <button onclick="afficherJour(${i})">
                <span class="jour">${resultat}</span>
                <span class="num">${courSemaine[i].date.getDate()}</span>
            </button>
        `;
    }

    let indiceJour = (aujourdHui.getDay() + 6) % 7;
    if(indiceJour > 4 ){
        indiceJour = 0;
    }
    afficherJour(indiceJour);
}

function afficherJour(i){
    const btn = document.querySelectorAll("#barreJours button");
    for(let n=0;n< btn.length;n++){
        btn[n].classList.remove('jourActif')
    }
    btn[i].classList.add('jourActif');

    const EDTJour = document.getElementById("EDTJour");
    EDTJour.innerHTML ="";
        if (courSemaine[i].cours.length > 0) {
            for (let j = 0; j < courSemaine[i].cours.length; j++) {
                const carte = document.createElement("div");
                const cour = courSemaine[i].cours[j]
                carte.innerHTML = `
                    <div class="container-EDT">
                        <div class="containerHeure">
                            <p class="edt-debut">${cour.heure}</p>
                            <p class="edt-fin">${cour.heureFin}</p>
                        </div>
                        <div class="barreM"></div>
                        <div class="">
                            <p class="edt-titre">${cour.titre}</p>
                            <p class="edt-infos">${cour.TpTdCm} • ${cour.salle} • ${cour.professeur}</p>
                        </div>
                        <div></div> <!-- TODO VOIR PAS SUR POUR LE TXT EN COURS-->
                    </div>
                `;
                carte.querySelector(".barreM").style.backgroundColor = texteEnCouleur(cour.titre);

                if (aujourdHui >= cour.dateObjetDebut && aujourdHui <= cour.dateObjetFin) {
                    carte.classList.add("actuel");
                }
                if(aujourdHui > cour.dateObjetFin){
                    carte.querySelector(".container-EDT").style.opacity =  0.33;
                }
                EDTJour.appendChild(carte);
            }
        }
    else{
        EDTJour.innerHTML = `
            <div class="pasDeCours">
                <div class="containerSVG">
                    <svg xmlns="http://www.w3.org/2000/svg" color="#2848c8" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="m9 15.5 2 2 4-4"/></svg>
                </div>
                <div>
                    <p class="txt">Pas de cours </p>
                    <p class="txt-gray">Repose toi bien !</p>
                </div>
            </div>
          `;

    }

    console.log(courSemaine[i]);
}

afficherSemaine();
