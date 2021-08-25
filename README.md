# $INSTALLER:80

This repository is just an experiment to build a web-based installer on top of
[YaST](https://yast.opensuse.org/) infrastructure. It is composed of two parts:

* An HTTP API (based on [Ruby on Rails](https://rubyonrails.org/)) which expose an small part of
  YaST capabilities.
* A web-based UI (built with [React](https://reactjs.org/) and friends).

At this point in time, it is not able to do anything useful at all. It just displays a partitioning
proposal and a few general options, like product selection and language settings.

![Installation Overview](/screenshot.png?raw=true "Installation Overview")

Of course, if you press the `Install` button, nothing happens :smiley:.

## Starting the Installer

## HTTP API

At this point, the server needs to run as *root* (like YaST does) to be able to do hardware probing
and so on. It is far from ideal, but we will work on that later.

        $ cd server
        $ bundle install
        $ sudo bundle exec rails s

## User Interface

        $ cd web
        $ npm start

Point your browser to https://localhost:3001.
