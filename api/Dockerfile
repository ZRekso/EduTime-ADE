# Image de base : Python 3.14 en version légère
FROM python:3.14-slim
# Dossier de travail dans le conteneur
WORKDIR /app
# Copie la liste des dépendances
COPY requirements.txt .
# Installe les dépendances (sans garder le cache pour alléger l'image)
RUN pip install --no-cache-dir -r requirements.txt
# Copie le reste du code de l'API
COPY . .
# Lance l'API avec Gunicorn (serveur de production) sur le port 8080
CMD ["gunicorn", "-b", "0.0.0.0:8080", "app:app"]