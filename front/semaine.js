async function afficherSemaine() {
    const titreSemaine = document.getElementById('titreSemaine');
    const maintenant = new Date();

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
    let courSemaine = [];

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

    console.log(courSemaine);
}

afficherSemaine();