/*
 * Export Dashicons
 */

'use strict';

var multiline = require( 'multiline' ),
	xml2js = require( 'xml2js' );

var KEBAB_REGEX = /\-(\w)/g;

/**
 * Transforms kebab case names to camel case
 * @param name        ex: foo-bar-baz
 * @returns {String}  ex: fooBarBaz
 */
function kebabToCamelCase( name ) {
	return name.replace( KEBAB_REGEX, function replacer( match, capture ) {
		return capture.toUpperCase();
	} );
}

module.exports = function( grunt ) {

	require( 'load-grunt-tasks' )( grunt );

	// Project configuration.
	grunt.initConfig({

		// clean up tmp dirs
		clean: [ 'svg-min-react' ],

		// Minify SVGs from svg directory, output to svg-min
		svgmin: {
			dist: {
				files: [{
					attrs: 'fill',
					expand: true,
					cwd: 'svg',
					src: ['*.svg'],
					dest: 'svg-min/',
					ext: '.svg'
				}]
			},
			options: {
				plugins: [
					{ removeAttrs: { attrs: ['fill', 'width', 'height'] } },
					{ removeViewBox: false },
					{ removeEmptyAttrs: false },
					{ removeTitle: true } // addtitle will add it back in later
				]
			}
		},

		// Create single SVG sprite for use outside of React environments, output to svg-sprite
		svgstore: {
			withCustomTemplate:{
				options: {
					prefix : '', // Unused by us, but svgstore demands this variable
					svg: { // will add and overide the the default xmlns="http://www.w3.org/2000/svg" attribute to the resulting SVG
						viewBox : '0 0 20 20',
						xmlns: 'http://www.w3.org/2000/svg'
					},

					cleanup : ['style', 'fill', 'id'],

					includedemo : multiline.stripIndent(function(){/*
					<!DOCTYPE html>
					<html>
					<head>
					<title>Dashicons</title>
					<meta name="robots" content="noindex">
					<style type="text/css">
					html {
						background: #fff;
						font: 10pt/1 -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen-Sans", "Ubuntu", "Cantarell", "Helvetica Neue", sans-serif;
						color: #999;
					}

					a:link, a:visited {
						color: #999;
					}

					a:active {
						color: #1fc1ad;
					}

					h1 {
						text-align: center;
						font-size: 24pt;
					}

					body > p {
						text-align: center;
						margin-bottom: 2em;
					}

					body {
						max-width: 900px;
						margin: 100px auto;
					}

					.icons {
						padding: 0 20px;
						overflow: hidden;
						margin-bottom: 50px;
					}

					.icons div {
						width: 64px;
						height: 64px;
						float: left;
						padding: 6px 2px;
						position: relative;
						font-size: 7pt;
						cursor: pointer;
						text-align: center;
					}

					.icons div p {
						margin: 0;
						color: #bbb;
						text-align: center;
						overflow: hidden;
						max-height: 1.9em;
						word-break: break-word;
					}

					.icons div svg {
						width: 48px;
						height: 48px;
						fill: #000;
					}

					.icons div:hover svg {
						fill: #1fc1ad;
					}
					</style>
					<script type="text/javascript">
					window.onload = function () {
					    var rows = document.getElementsByTagName( 'svg' );
					    for ( i=0; i<rows.length; i++ ) {
					        rows[i].onclick = function () {
					            var cssClass = this.getAttribute( 'class' );
					            var iconID = cssClass.split(' dashicons-')[1];
					            var suggestion = '<Dashicon icon="'+ iconID +'" />';
					            window.prompt( 'Copy this, paste in your React component.', suggestion );
					        }
					    }
					}

					// SVG for Everybody
					!function(a,b){"function"==typeof define&&define.amd?define([],function(){return a.svg4everybody=b()}):"object"==typeof module&&module.exports?module.exports=b():a.svg4everybody=b()}(this,function(){function a(a,b,c){if(c){var d=document.createDocumentFragment(),e=!b.hasAttribute("viewBox")&&c.getAttribute("viewBox");e&&b.setAttribute("viewBox",e);for(var f=c.cloneNode(!0);f.childNodes.length;)d.appendChild(f.firstChild);a.appendChild(d)}}function b(b){b.onreadystatechange=function(){if(4===b.readyState){var c=b._cachedDocument;c||(c=b._cachedDocument=document.implementation.createHTMLDocument(""),c.body.innerHTML=b.responseText,b._cachedTarget={}),b._embeds.splice(0).map(function(d){var e=b._cachedTarget[d.id];e||(e=b._cachedTarget[d.id]=c.getElementById(d.id)),a(d.parent,d.svg,e)})}},b.onreadystatechange()}function c(c){function e(){for(var c=0;c<m.length;){var h=m[c],i=h.parentNode,j=d(i);if(j){var n=h.getAttribute("xlink:href")||h.getAttribute("href");if(f&&(!g.validate||g.validate(n,j,h))){i.removeChild(h);var o=n.split("#"),p=o.shift(),q=o.join("#");if(p.length){var r=k[p];r||(r=k[p]=new XMLHttpRequest,r.open("GET",p),r.send(),r._embeds=[]),r._embeds.push({parent:i,svg:j,id:q}),b(r)}else a(i,document.getElementById(q))}}else++c}l(e,67)}var f,g=Object(c),h=/\bTrident\/[567]\b|\bMSIE (?:9|10)\.0\b/,i=/\bAppleWebKit\/(\d+)\b/,j=/\bEdge\/12\.(\d+)\b/;f="polyfill"in g?g.polyfill:h.test(navigator.userAgent)||(navigator.userAgent.match(j)||[])[1]<10547||(navigator.userAgent.match(i)||[])[1]<537;var k={},l=window.requestAnimationFrame||setTimeout,m=document.getElementsByTagName("use");f&&e()}function d(a){for(var b=a;"svg"!==b.nodeName.toLowerCase()&&(b=b.parentNode););return b}return c});svg4everybody();
					</script>
					</head>
					<body>

					<h1>Dashicons</h1>

					<div class="icons">
					{{#each icons}}
						<div>
							<svg width="20" height="20" class="dashicon {{name}}">
							<use xlink:href="dashicons.svg#{{name}}" />
							</svg>
							<p>{{title}}</p>
						</div>
					{{/each}}
					</div>

					<p><a href="https://github.com/WordPress/dashicons">GitHub</a></p>

					</body>
					</html>
					*/})

				},
				files: {
					'svg-sprite/dashicons.svg': ['svg/*.svg']
				}
			},
		},

		rename: {
			moveThis: {
					src: 'svg-sprite/dashicons-demo.html',
					dest: 'svg-sprite/index.html'
			},
		},

		copy: {
			main: {
				src: 'svg-sprite/index.html',
				dest: 'docs/index.html'
			},
			sprite: {
				src: 'svg-sprite/dashicons.svg',
				dest: 'docs/dashicons.svg'
			}
		},

		babel: {
			options: {
				sourceMap: false,
				presets: [
					'es2015',
					'stage-2',
					'babili'
				],
				comments: false,
				plugins: [
					'transform-runtime',
					'transform-class-properties',
					'transform-export-extensions',
					'add-module-exports',
					'syntax-jsx',
					'transform-react-jsx',
					'transform-react-display-name'
				]
			},
			dist: {
				files: {
					"build/index.js": "build/index.jsx",
					"build/example.js": "build/example.jsx"
				}
			}
		}

	});

	// Load the copier
	grunt.loadNpmTasks('grunt-contrib-copy');

	// Load the SVGstore
	grunt.loadNpmTasks('grunt-svgstore');

	// Load the renamer
	grunt.loadNpmTasks('grunt-rename');

	// Load svgmin
	grunt.loadNpmTasks('grunt-svgmin');

	// Update all files in svg-min to add a <g> group tag
	grunt.registerTask( 'group', 'Add <g> tag to SVGs', function() {
		var svgFiles = grunt.file.expand( { filter: 'isFile', cwd: 'svg-min/' }, [ '**/*.svg' ] );

		// Add stuff
		svgFiles.forEach( function( svgFile ) {

			// Grab the relevant bits from the file contents
			var fileContent = grunt.file.read( 'svg-min/' + svgFile );

			// Add transparent rectangle to each file
			fileContent = fileContent.slice( 0, fileContent.indexOf('viewBox="0 0 20 20">') + 20 ) +	// opening SVG tag
						'<g>' +
						fileContent.slice( fileContent.indexOf('viewBox="0 0 20 20">') + 20, -6 ) + 	// child elements of SVG
						'</g>' +
						fileContent.slice( -6 );	// closing SVG tag

			// Save and overwrite the files in svg-min
			grunt.file.write( 'svg-min/' + svgFile, fileContent );

		} );

	});

	grunt.registerTask( 'kebabToCamelCase', 'Rename any svg attributes to camel case for react', function() {
		var svgFiles = grunt.file.expand( { filter: 'isFile', cwd: 'svg-min/' }, [ '**/*.svg' ] );

		// Add stuff
		svgFiles.forEach( function( svgFile ) {

			// Grab the relevant bits from the file contents
			var fileContent = grunt.file.read( 'svg-min/' + svgFile );

			// Rename any attributes to camel case for react
			xml2js.parseString( fileContent, {
					async: false, // set callback is sync, since this task is sync
					trim: true,
					attrNameProcessors: [ kebabToCamelCase ]
				},
				function ( err, result ) {
					if ( ! err ) {
						var builder = new xml2js.Builder( {
							renderOpts: { pretty: false },
							headless: true //omit xml header
						} );
						fileContent = builder.buildObject( result );
					}
				} );

			grunt.file.write( 'svg-min-react/' + svgFile, fileContent );

		} );

	});

	// Create React component, output to react
	grunt.registerTask( 'svgreact', 'Output a react component for SVGs', function() {
		var svgFiles = grunt.file.expand( { filter: 'isFile', cwd: 'svg-min-react/' }, [ '**/*.svg' ] ),
			content, designContent;

		// Start the React component
		content =	grunt.file.read( 'react/dashicon/inc/index-header.jsx' );

		// Create a switch() case for each svg file
		svgFiles.forEach( function( svgFile ) {
			// Clean up the filename to use for the react components
			var name = svgFile.split( '.' );
			name = name[0];

			// Grab the relevant bits from the file contents
			var fileContent = grunt.file.read( 'svg-min-react/' + svgFile );

			// Grab title
			var title = fileContent.substring( fileContent.lastIndexOf( '<title>' ) + 7, fileContent.lastIndexOf( '</title>' ) );

			// Grab SVG path
			fileContent = fileContent.slice( fileContent.lastIndexOf( '<path d="' ) + 9, -13 );

			// Output the case for each icon
			var iconComponent = "			case '" + name + "':\n" +
								"				title = '" + title + "';\n" +
								"				path = '" + fileContent + "';\n" +
								"				break;\n";

			content += iconComponent;
		} );

		// Finish up the React component
		content += grunt.file.read( 'react/dashicon/inc/index-footer.jsx' );

		// Start design/docs component
		designContent =	"/* eslint-disable no-alert */\n" +
					"/**\n" +
					" * External dependencies\n" +
					" */\n" +
					"var React = require( 'react' );\n\n" +
					"/**\n" +
					" * Internal dependencies\n" +
					" */\n" +
					"import Dashicon from './index.js';\n\n" +
					"module.exports = React.createClass( {\n" +
					"	displayName: 'Dashicons',\n\n" +
					"	handleClick: function( icon ) {\n" +
					"		var toCopy = '<Dashicon icon=\"' + icon + '\" />';\n" +
					"		window.prompt( 'Copy component code:', toCopy );\n" +
					"	},\n\n" +
					"	render: function() {\n" +
					'		return (\n' +
					'			<div>\n';

		// Create a switch() case for each svg file
		svgFiles.forEach( function( svgFile ) {
			// Clean up the filename to use for the react components
			var name = svgFile.split( '.' );
			name = name[0].replace( 'dashicons-', '' );

			// Output the case for each icon
			var iconComponent = '				<Dashicon icon="' + name + '" size={ 48 } onClick={ this.handleClick.bind( this, \'' + name + '\' ) } />\n';
			designContent += iconComponent;
		} );

		designContent +=	'			</div>\n' +
							'		);\n' +
							'	}\n' +
							'} );\n';

		// Write the React component to dashicon/index.jsx
		grunt.file.write( 'build/index.jsx', content );
		grunt.file.write( 'build/example.jsx', designContent );
	});

	// Create PHP WordPress plugin, output to php
	grunt.registerTask( 'svgphp', 'Output a PHP WordPress plugin for SVGs', function() {
		var svgFiles = grunt.file.expand( { filter: 'isFile', cwd: 'svg-min/' }, [ '**/*.svg' ] ),
			content;

		// Start the plugin
		content = grunt.file.read( 'php/inc/index-header.php' );

		// Create a switch() case for each svg file
		svgFiles.forEach( function( svgFile ) {
			// Clean up the filename to use for the react components
			var name = svgFile.split( '.' );
			name = name[0];

			// Grab the relevant bits from the file contents
			var fileContent = grunt.file.read( 'svg-min/' + svgFile );

			// Add className, height, and width to the svg element
			fileContent = fileContent.slice( 0, 4 ) +
						' class="dashicon ' + name + '" height="20" width="20"' +
						fileContent.slice( 4, -6 ) +
						fileContent.slice( -6 );

			// Output the case for each icon
			var iconComponent = "		case '" + name + "':\n" +
								"			$svg = '" + fileContent + "';\n" +
								"			break;\n";

			content += iconComponent;
		} );

		// Finish up and write the plugin
		content += grunt.file.read( 'php/inc/index-footer.php' );
		grunt.file.write( 'php/dashicons.php', content );

	});

	// Update all files in svg-min to add transparent square, this ensures copy/pasting to Sketch maintains a 20x20 size
	grunt.registerTask( 'addsquare', 'Add transparent square to SVGs', function() {
		var svgFiles = grunt.file.expand( { filter: 'isFile', cwd: 'svg-min/' }, [ '**/*.svg' ] );

		// Add stuff
		svgFiles.forEach( function( svgFile ) {

			// Grab the relevant bits from the file contents
			var fileContent = grunt.file.read( 'svg-min/' + svgFile );

			// Add transparent rectangle to each file
			fileContent = fileContent.slice( 0, fileContent.indexOf( '</title>' ) + 8 ) +
						'<rect x="0" fill="none" width="20" height="20"/>' +
						fileContent.slice( fileContent.indexOf( '</title>' ) + 8, -6 ) +
						fileContent.slice( -6 );

			// Save and overwrite the files in svg-min
			grunt.file.write( 'svg-min/' + svgFile, fileContent );

		} );

	});

	// Update all files in svg-min to add a title element for accessibility
	grunt.registerTask( 'addtitle', 'Add title element to SVGs', function() {
		var svgFiles = grunt.file.expand( { filter: 'isFile', cwd: 'svg-min/' }, [ '**/*.svg' ] );

		// Add stuff
		svgFiles.forEach( function( svgFile ) {

			// Grab the relevant bits from the file contents
			var fileContent = grunt.file.read( 'svg-min/' + svgFile );

			// Grab the filename without 'dashicons-' and the .svg extension
			var name = svgFile.substring( 0, svgFile.lastIndexOf( '.' ) );

			// Remove hyphens and convert to Title Case
			var title = name.split( '-' ).map( function( item ) {
				return item.charAt( 0 ).toUpperCase() + item.slice( 1 );
			 } ).join( ' ' );

			// Add transparent rectangle to each file
			fileContent = fileContent.slice( 0, fileContent.indexOf( 'viewBox="0 0 20 20">' ) + 20 ) +
						'<title>' + title + '</title>' +
						fileContent.slice( fileContent.indexOf( 'viewBox="0 0 20 20">' ) + 20, -6 ) +
						fileContent.slice( -6 );

			// Save and overwrite the files in svg-min
			grunt.file.write( 'svg-min/' + svgFile, fileContent );

		} );

	});

	// Default task(s).
	grunt.registerTask('default', ['svgmin', 'group', 'svgstore', 'rename', 'copy', 'addtitle', 'svgphp', 'kebabToCamelCase', 'svgreact', 'babel', 'addsquare', 'clean' ]);

};
