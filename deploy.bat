@echo off
rem Script batch pour ajouter, amender et forcer le push des modifications Git

rem Ajouter tous les fichiers modifiés à l'index Git
git add .

rem Amender le dernier commit sans changer le message
git commit --amend --no-edit

rem Forcer le push des modifications amendées
git push -f

rem Pause pour voir le résultat dans la console (optionnel)
pause
