[![Build Status](https://travis-ci.org/BoyCook/SpaceUI.png?branch=master)](https://travis-ci.org/BoyCook/SpaceUI)
[![Coverage Status](https://coveralls.io/repos/BoyCook/SpaceUI/badge.png)](https://coveralls.io/r/BoyCook/SpaceUI)
[![Code Climate](https://codeclimate.com/repos/525d55d9c7f3a335da039f25/badges/21401df2e908de70bff3/gpa.png)](https://codeclimate.com/repos/525d55d9c7f3a335da039f25/feed)
[![Dependency Status](https://gemnasium.com/BoyCook/SpaceUI.png)](https://gemnasium.com/BoyCook/SpaceUI)

[![NPM](https://nodei.co/npm/space-ui.png?downloads=true)](https://nodei.co/npm/space-ui) 

## About
Space UI is a lightweight responsive UI for [TiddlySpace](http://tiddlyspace.com) built using [tsapp](http://tsapp.tiddlyspace.com)

## Example
http://spaceui.tiddlyspace.com

## Installation to TiddlySpace	
Simply include the spaceui via the space management tool, reachable from `/_space`

## Actions
* `make test` runs the tests
* `tsapp serve` runs the app locally
* `sh load.sh` pushes the app files to tiddlyspace

## Dependencies
http://ksylvest.github.io/jquery-growl

https://github.com/gotwarlost/istanbul/issues/90
https://github.com/gotwarlost/istanbul/issues/44

`travis encrypt MY_SECRET_ENV=super_secret --add env.matrix`
`sudo travis encrypt {var_name}={var_value} --add {varname}`
`sudo travis encrypt TIDDLYSPACE_USERNAME={var_value} --add env.matrix`
`sudo travis encrypt TIDDLYSPACE_PASSWORD={var_value} --add env.matrix`