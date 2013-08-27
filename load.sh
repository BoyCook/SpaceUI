#!/bin/bash

function load_dir() {	
	DIR=$1
	LEN=$2
	cd $DIR
	for FILE in *
	do
		if [ -f "$FILE" ]
		then
			tsapp push_hard spaceui $FILE
		fi	
	done
	cd ../
}

function load_explicit() {
	tsapp push_hard spaceui Elusive-Icons.eot
	tsapp push_hard spaceui Elusive-Icons.svg
	tsapp push_hard spaceui Elusive-Icons.ttf
	tsapp push_hard spaceui Elusive-Icons.woff
	tsapp push_hard spaceui elusive-webfont.css
	tsapp push_hard spaceui jquery.growl.css
	tsapp push_hard spaceui jquery.growl.js
	tsapp push_hard spaceui backbone.js
	tsapp push_hard spaceui backbone-min.js
	tsapp push_hard spaceui backbone-min.map
	tsapp push_hard spaceui underscore-min.js
	tsapp push_hard spaceui underscore-min.map	
	tsapp push_hard spaceui index.html
	tsapp push_hard spaceui html.js
	tsapp push_hard spaceui htmlgenerator.js
	tsapp push_hard spaceui http.js
	tsapp push_hard spaceui sort.js
	tsapp push_hard spaceui filter.js
	tsapp push_hard spaceui space.js
	tsapp push_hard spaceui spaceui.js
	tsapp push_hard spaceui spaceui.css
	tsapp push_hard spaceui uilayout.css	
}

# load_dir assets
load_explicit