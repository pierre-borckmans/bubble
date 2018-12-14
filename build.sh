rm ../build/app/Bubble/Contents/Resources/app.asar
asar pack . ../build/app/Bubble/Contents/Resources/app.asar
rm -rf ../build/app/Bubble.app
cp -r ../build/app/Bubble ../build/app/Bubble.app
rm -rf /Applications/Bubble.app
cp -rf ../build/app/Bubble.app /Applications