from flask import Flask, jsonify
from supabase import create_client
from flask_cors import CORS


supabase_config = {
    "url": "https://jgqyvsjgwpuicfzwdnsd.supabase.co",
    "key": "sb_publishable_uGfXito86wCjr_6kRw2LVA_44Q6HkhO"  # Clé publique
}

supabase = create_client(supabase_config["url"], supabase_config["key"])
app = Flask(__name__)
CORS(app) # autorise le front à appeler l'api (autre port)

@app.route('/')
def api():
    tous_les_cours = []
    reponse = supabase.table("API").select("*", count="exact", head=True).execute()
    nb_cours = reponse.count
    i = 0                                   # Compteur
    while i < nb_cours:
        reponse = supabase.table("API").select("*").range(i, i + 999).execute()
        tous_les_cours.extend(reponse.data)
        i += 1000
    return jsonify(tous_les_cours)

@app.route("/health")
def health():
    return {"status": "ok"}, 200

if __name__ == "__main__":
    app.run(debug=True)