from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import hashlib

app = Flask(__name__)
CORS(app)  # autorise les requêtes depuis React

USERS_FILE = "users.json"

def load_users():
    if not os.path.exists(USERS_FILE):
        return {}
    with open(USERS_FILE, "r") as f:
        return json.load(f)

def save_users(users):
    with open(USERS_FILE, "w") as f:
        json.dump(users, f, indent=2)

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    users = load_users()

    if email in users:
        return jsonify({"success": False, "message": "Email déjà enregistré."}), 400

    users[email] = hash_password(password)
    save_users(users)

    return jsonify({"success": True, "message": "Compte créé avec succès."})

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    users = load_users()

    if email not in users or users[email] != hash_password(password):
        return jsonify({"success": False, "message": "Email ou mot de passe invalide."}), 401

    return jsonify({"success": True, "message": "Connexion réussie."})

if __name__ == "__main__":
    app.run(port=8000, debug=True)
