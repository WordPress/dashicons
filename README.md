# Dashicons

Dashicons, the WordPress admin icon font. For the official documentation, please refer to the according [WordPress Developer Resource](https://developer.wordpress.org/resource/dashicons/).

For new icon requests, please [create a new issue on this GitHub repository](https://github.com/WordPress/dashicons/issues/new). If you'd like to work an an icon request, [check out our WIP Dashicons style guide](https://make.wordpress.org/design/dashicons-style-guide/).

For any bugs that appear within WordPress core, please [create a new ticket on WordPress Trac](https://core.trac.wordpress.org/newticket). Use the "Administration" component and the "ui" focus when creating the new ticket, and be sure to include "Dashicons" somewhere in the text of the ticket.

Dashicons is licensed under [GPLv2](http://www.gnu.org/licenses/gpl-2.0.html), or any later version with [font exception](http://www.gnu.org/licenses/gpl-faq.html#FontException).

## Building / Installing

To build Dashicons, make sure you have <a href="https://nodejs.org">Node JS</a> installed. The next steps are platform specific. Once all steps for your platform are complete, you can type `npm run build` on the commandline to generate the minified SVG files and sprite.

### Mac

Start by installing <a href="https://brew.sh/">Brew</a>. You may need to use `sudo` for `brew`, depending on your setup.

Then on the commandline:

```
brew install ttfautohint fontforge --with-python
npm install
```

### Linux

On the commandline:

```
sudo apt-get install fontforge ttfautohint
npm install
```

### Windows

On the commandline:

```
npm install
```

Then [install `ttfautohint`](http://www.freetype.org/ttfautohint/#download) (optional).

Then install `fontforge`.
* Download and install [fontforge](http://fontforge.github.io/en-US/downloads/windows/).
* Add `C:\Program Files (x86)\FontForgeBuilds\bin` to your `PATH` environment variable.

## Adding an icon

Once you're installed, to add an icon, save an SVG in the `svg` folder, then run the `npm run build` command on the commandline.
