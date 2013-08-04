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

load_dir assets
