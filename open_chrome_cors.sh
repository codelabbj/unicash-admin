#!/bin/bash

# Script pour ouvrir Chrome avec la sécurité web désactivée (CORS bypass)
# ATTENTION : N'utilisez cette instance que pour le développement !

# Création d'un répertoire temporaire pour le profil utilisateur
mkdir -p /tmp/chrome_dev_test

# Lancement de Chrome avec les arguments nécessaires
open -n -a /Applications/Google\ Chrome.app --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security

echo "Chrome a été lancé en mode 'CORS désactivé'."
echo "Vous devriez voir un avertissement en haut de la fenêtre."
