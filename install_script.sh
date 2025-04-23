
##store all of our code into a different file
echo ********REACT APP INSTALL SCRIPT*******
mkdir temporary/
cp -r code/eagle_connect_app/public temporary/
cp -r code/eagle_connect_app/src temporary/
rm -r code/
mkdir code/
cd code/
##create the necessary app stuff
npm config set legacy-peer-deps true
npx create-react-app eagle_connect_app
cd eagle_connect_app/
echo *******FIREBASE INSTALL*******:
npm install firebase
echo ********ROUTER DOM INSTALL********:
npm install react-router-dom
echo ********OTHERS INSTALL********
npm install --save-dev ajv@^7 
npm install reactjs-popup
npm install react-firebase-hooks
npm install bad-words
####Put OUR Code back
rm -r public/
rm -r src/
cd ..
cd ..
mv temporary/public code/eagle_connect_app/public
mv temporary/src code/eagle_connect_app/src
rm -r temporary/