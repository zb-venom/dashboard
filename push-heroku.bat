set /p Commit=Commit: 
git add .
git commit -m "%Commit%"
git push heroku master
heroku open