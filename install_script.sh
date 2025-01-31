
##store all of our code into a different file
echo ********REACT APP INSTALL SCRIPT*******
mkdir /temporary/
cp -r code/ temporary/
rm -r code/
mkdir code/
cd code/
mkdir react-auth-tutorial/
cd react-auth-tutorial/
##create the necessary app stuff
npm config set legacy-peer-deps true
npx create-react-app new2
cd new2/
echo *******FIREBASE INSTALL*******:
npm install firebase
echo ********ROUTER DOM INSTALL********:
npm install react-router-dom
####Put OUR Code back
cp -r node_modules/ ../../../temporary/react-auth-tutorial/new2/
cp  package.json ../../../temporary/react-auth-tutorial/new2/
cp  package-lock.json ../../../temporary/react-auth-tutorial/new2/
cd ../../../
rm -r code/
mv temporary code
