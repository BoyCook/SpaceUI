#!/bin/bash

function load_dir() {	
	DIR=$1
	LEN=$2
	cd $DIR
	for FILE in *
	do
		if [ -f "$FILE" ]
		then
			tsapp push spaceui $FILE
		fi	
	done
	cd ../
}

function load_explicit() {
	tsapp push spaceui Elusive-Icons.eot
	tsapp push spaceui Elusive-Icons.svg
	tsapp push spaceui Elusive-Icons.ttf
	tsapp push spaceui Elusive-Icons.woff
	tsapp push spaceui elusive-webfont.css
	tsapp push spaceui jquery.growl.css
	tsapp push spaceui index.html
	tsapp push spaceui jquery.growl.js
	tsapp push spaceui html.js
	tsapp push spaceui htmlgenerator.js
	tsapp push spaceui http.js
	tsapp push spaceui filter.js
	tsapp push spaceui space.js
	tsapp push spaceui spaceui.js
	tsapp push spaceui spaceui.css
	tsapp push spaceui uilayout.css	
}

# load_dir assets
load_explicit