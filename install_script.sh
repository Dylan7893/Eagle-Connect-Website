
##store all of our code into a different file
echo ********REACT APP INSTALL SCRIPT*******
mkdir temporary/
cp -r code/react-auth-tutorial/new2/public temporary/
cp -r code/react-auth-tutorial/new2/src temporary/
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
echo ********OTHERS INSTALL********
npm install --save-dev ajv@^7 
####Put OUR Code back
rm -r public/
rm -r src/
cd ..
cd ..
cd ..
mv temporary/public code/react-auth-tutorial/new2/public
mv temporary/src code/react-auth-tutorial/new2/src
