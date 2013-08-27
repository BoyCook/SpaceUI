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

# These should never change
function load_statics_explicit() {
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
}

function load_explicit() {
	tsapp push spaceui index.html
	tsapp push spaceui html.js
	tsapp push spaceui htmlgenerator.js
	tsapp push spaceui http.js
	tsapp push spaceui sort.js
	tsapp push spaceui filter.js
	tsapp push spaceui space.js
	tsapp push spaceui spaceui.js
	tsapp push spaceui spaceui.css
	tsapp push spaceui uilayout.css	
}

# load_dir assets
# load_statics_explicit
load_explicit
