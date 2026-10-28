async function afficherSemaine() {
    const tousLesCours = await tableau();

    const lundi = new Date(aujourdHui);
    lundi.setDate(lundi.getDate() - ((lundi.getDay() + 6) % 7));
    const semaine = [];

    for (let i =0; i<4; i++){
        const lundi = new Date(aujourdHui);
        const jour = new Date(lundi);
        jour.setDate(lundi.getDate() + i);
    }
    // TODO
}

afficherSemaine();