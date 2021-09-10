# $INSTALLER:80

This repository is just an experiment to build a web-based installer on top of
[YaST](https://yast.opensuse.org/) infrastructure. It is composed of two parts:

* A D-Bus service based on [ruby-dbus][https://github.com/mvidner/ruby-dbus]
  that exposes a tiny fraction of YaST capabilities.
* An HTTP API (based on [Tide][https://github.com/http-rs/tide] and
  [zbus][https://dbus.pages.freedesktop.org/zbus/] that serves as a proxy for
  the web UI.
* A web-based UI built with [React](https://reactjs.org/) and friends.

At this point in time, it is not able to do anything useful at all. It just displays a partitioning
proposal and a few general options, like product selection and language settings.

![Installation Overview](/screenshot.png?raw=true "Installation Overview")

Of course, if you press the `Install` button, nothing happens :smiley:.

## Starting the Installer

## D-Bus service

A small YaST D-Bus service is included in the `dbus/` directory. Beware that it must run as *root*
(like YaST does) to do hardware probing and so on. Additionally, you must tell `dbus` about this
service by just copying `dbus/share/dbus-yast2.conf` to `/etc/dbus-1/system.d/yast2.conf`.

To run the service, type:

        $ cd yastd
        $ sudo ruby bin/yastd

## HTTP API

The HTTP API allows accessing to the YaST D-Bus service. It is written in Rust, so you will need to
install the compiler. To start the server just type:

        $ cd yast-dbus-proxy
        $ cargo run

## User Interface

Now start the web-based user interface:

        $ cd web
        $ npm start

Point your browser to https://localhost:3001 and enjoy!
