import requests
from icalendar import Calendar
from zoneinfo import ZoneInfo
from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()
supabase = create_client(os.environ["SUPABASE_URL"], os.environ["SUPABASE_SECRET_KEY"])



fuseau_heure = ZoneInfo("Europe/Paris")

ical_config = {
    "url": "https://ade-consult.univ-artois.fr/jsp/custom/modules/plannings/KYNobQnv.shu"
}

reponse_ical = requests.get(ical_config["url"])
calendrier_ical = Calendar.from_ical(reponse_ical.text)

def ligne_prof(ligne):
    texte = ligne.strip()
    if (texte.startswith("Groupe") or texte.startswith("B1INFO") or texte.startswith("A Attester") or texte.startswith("(") or texte == ""):
        return False
    return True

def ligne_code(ligne):  # BUT 1 / 2 /3
    texte = ligne.strip()
    if texte.startswith("B1INFO"):
        return True
    return False

def type_but(code):
    if code is None:
        return None
    if "B1INFO" in code:
        return "BUT1"

def ligne_groupe(ligne):
    texte = ligne.strip()
    if texte.startswith("Groupe"):
        return True
    return False

def type_cours(code):
    if code is None:
        return None
    if "TD" in code:
        return 'TD'
    if 'TP' in code:
        return 'TP'
    if 'CM' in code:
        return 'CM'

for composant in calendrier_ical.walk():
    if composant.name == "VEVENT":
        uid = str(composant.get('UID'))
        ligne = composant.get('DESCRIPTION').split('\n')

        prof = None
        for item in ligne:
            if ligne_prof(item):
                prof = item
                break

        code = None
        for item in ligne:
            if ligne_code(item):
                code = item
                break

        groupe = None
        for item in ligne:
            if ligne_groupe(item):
                if groupe is None:
                    groupe = item.strip()
                else:
                    groupe = groupe + ", " + item.strip()

        heure_debut = composant.get('DTSTART').dt.astimezone(fuseau_heure)
        heure_fin = composant.get('DTEND').dt.astimezone(fuseau_heure)

        supabase.table("API").upsert({
            "uid": uid,
            "matiere": composant.get('SUMMARY'),
            "prof": prof,
            "salle": composant.get('LOCATION'),
            "date": str(heure_debut.date()),
            "heure_debut": str(heure_debut.time()),
            "heure_fin": str(heure_fin.time()),
            "groupe": groupe,
            "code": code,
            "type_cours": type_cours(code)
        }, on_conflict="uid").execute()