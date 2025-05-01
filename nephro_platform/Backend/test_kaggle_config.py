import os
import json

# Récupérer le dossier de config via la variable d'environnement KAGGLE_CONFIG_DIR,
# ou utiliser par défaut "~/.kaggle"
kaggle_config_dir = os.environ.get("KAGGLE_CONFIG_DIR", os.path.expanduser("~/.kaggle"))
config_path = os.path.join(kaggle_config_dir, "kaggle.json")

print("Chemin utilisé pour kaggle.json :", config_path)

try:
    with open(config_path, "r", encoding="utf-8") as f:
        config = json.load(f)
    print("Contenu du fichier kaggle.json :", config)
    print("Clés présentes :", list(config.keys()))
except Exception as e:
    print("Erreur lors de la lecture du fichier kaggle.json :", e)
