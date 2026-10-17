from flask import Flask, jsonify
from supabase import create_client
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()
supabase = create_client(os.environ["SUPABASE_URL"], os.environ["SUPABASE_SECRET_KEY"])

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