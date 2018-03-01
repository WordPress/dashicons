# Dashicons

Dashicons, the WordPress admin icon font. For the official documentation, please refer to the [WordPress Developer Resource](https://developer.wordpress.org/resource/dashicons/).


### Icon requests

For new icon requests, please [post a request on the WordPress trac ticket pertaining to new Dashicons for the next version of WordPress](https://core.trac.wordpress.org/ticket/41074). If you'd like to work an an icon request, [check out our WIP Dashicons style guide](https://make.wordpress.org/design/dashicons-style-guide/).

You can join Dashicons discussion and get help on the [official WordPress Slack chat](https://make.wordpress.org/chat/). Just register and join the #design-dashicons channel.


### WordPress Bugs

For any bugs that appear within WordPress Core, please [create a new ticket on WordPress Trac](https://core.trac.wordpress.org/newticket). Use the "Administration" component and the "ui" focus when creating the new ticket, and be sure to include "Dashicons" somewhere in the text of the ticket.


## Setup

To build Dashicons, make sure you have <a href="https://nodejs.org">Node JS</a> installed. Then type `npm run build` on the commandline to generate the minified SVG files and sprite.


## Adding an icon

Once you're installed, to add an icon, save an SVG in the `sources/svg` folder, then run the `npm run build` command on the commandline.

If you want to add your icon to the Dashicons library, open a new Pull Request here with the new SVG icon, and wait a review.

If you're adding an icon for [Gutenberg](https://github.com/WordPress/gutenberg/) specifically, add it inside the `sources/svg/gutenberg` folder. It will be processed for everything but the font files.


## License

Dashicons is licensed under [GPLv2](http://www.gnu.org/licenses/gpl-2.0.html), or any later version with [font exception](http://www.gnu.org/licenses/gpl-faq.html#FontException).
