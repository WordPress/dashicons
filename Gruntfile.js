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
					cwd: 'sources/svg',
					src: [ '**/*.svg' ],
					dest: 'svg-min/',
					ext: '.svg'
				}]
			},
			options: {
				plugins: [
					{ removeStyleElement: true },
					{ removeAttrs: { attrs: [ 'fill', 'width', 'height', 'id', 'class' ] } },
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
					includeTitleElement: false,
					svg: { // will add and overide the the default xmlns="http://www.w3.org/2000/svg" attribute to the resulting SVG
						viewBox : '0 0 20 20',
						xmlns: 'http://www.w3.org/2000/svg'
					},
					cleanup : ['style', 'fill', 'id'],
				},
				files: {
					'svg-sprite/dashicons.svg': [ 'svg-min/**/*.svg' ]
				}
			},
		},

		// Generate a web font, omit Gutenberg files for now, as they need separate approval
		webfont: {
			icons: {
				src: 'svg-min/*.svg',
				dest: 'icon-font/fonts',
				destCss: 'icon-font/css'
			},
			options: {
				engine: 'node',
				autoHint: false,
				normalize: true,
				optimize: false,
				font: 'dashicons',
				types: 'eot,woff2,woff,ttf',
				order: 'eot,woff,ttf',
				embed: true,
				descent: 0,
				template: 'icon-font/css-template.css',
				htmlDemo: true,
				htmlDemoTemplate: 'icon-font/demo-template.html',
				destHtml: 'icon-font',
				templateOptions: {
					baseClass: 'dashicons',
					classPrefix: 'dashicons-',
					mixinPrefix: 'dashicons-'
				},
				codepointsFile: 'codepoints.json'
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
					"react/index.js": "react/index.jsx",
					"react/example.js": "react/example.jsx"
				}
			}
		}

	});

	// Load the SVGstore
	grunt.loadNpmTasks('grunt-svgstore');

	// Load svgmin
	grunt.loadNpmTasks('grunt-svgmin');

	// ****************************************************************************************************
	// Rewrite to add <g> group tag in `svg-min/`
	grunt.registerTask( 'group', 'Add <g> tag to SVGs', function() {
		var svgFiles = grunt.file.expand( { filter: 'isFile', cwd: 'svg-min/' }, [ '**/*.svg' ] );

		// Add stuff
		svgFiles.forEach( function( svgFile ) {

			// Grab the relevant bits from the file contents
			var fileContent = grunt.file.read( 'svg-min/' + svgFile );

			// Add <g> to each file
			fileContent = fileContent.slice( 0, fileContent.indexOf('viewBox="0 0 20 20">') + 20 ) +	// opening SVG tag
						'<g>' +
						fileContent.slice( fileContent.indexOf('viewBox="0 0 20 20">') + 20, -6 ) + 	// child elements of SVG
						'</g>' +
						fileContent.slice( -6 );	// closing SVG tag

			// Save and overwrite the files in svg-min
			grunt.file.write( 'svg-min/' + svgFile, fileContent );

		} );

	});

	// ****************************************************************************************************
	// Create temporary SVGs with React syntax (`svg-min/` --> `svg-min-react/`)
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

	// ****************************************************************************************************
	// Create React component (`svg-min-react/` --> `react/`)
	grunt.registerTask( 'svgreact', 'Output a react component for SVGs', function() {
		var svgFiles = grunt.file.expand( { filter: 'isFile', cwd: 'svg-min-react/' }, [ '**/*.svg' ] ),
			content, designContent;

		// Start the React component
		content = grunt.file.read( 'sources/react/index-header.jsx' );

		// Ensure alphabetical ordering ignoring prefix
		svgFiles.sort( function( a, b ) {
			return a.replace( /^gutenberg\//, '' ).localeCompare(
				b.replace( /^gutenberg\//, '' )
			);
		} );

		// Create a switch() case for each svg file
		svgFiles.forEach( function( svgFile ) {
			// Clean up the filename to use for the react components
			console.log( svgFile );
			var name = svgFile.split( '.' );
			name = name[0];

			// strip out "gutenberg/" from those SVGs
			name = name.split( 'gutenberg/' );
			if ( name.length > 1 ) {
				name = name[1];
			}

			// Grab the relevant bits from the file contents
			var fileContent = grunt.file.read( 'svg-min-react/' + svgFile );

			// Grab SVG path
			var path = fileContent.slice( fileContent.lastIndexOf( '<path d="' ) + 9, -13 );

			// Output the case for each icon
			var iconComponent = "			case '" + name + "':\n" +
								"				path = '" + path + "';\n" +
								"				break;\n";

			content += iconComponent;
		} );

		// Finish up the React component
		content += grunt.file.read( 'sources/react/index-footer.jsx' );

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
			var iconComponent = '				<Dashicon icon="' + name + '" size={ 40 } onClick={ this.handleClick.bind( this, \'' + name + '\' ) } />\n';
			designContent += iconComponent;
		} );

		designContent +=	'			</div>\n' +
							'		);\n' +
							'	}\n' +
							'} );\n';

		// Write the React component to dashicon/index.jsx
		grunt.file.write( 'react/index.jsx', content );
		grunt.file.write( 'react/example.jsx', designContent );
	});

	// ****************************************************************************************************
	// Rewrite to add transparent square in `svg-min/`
	// This ensures precise 20x20 pixel copy/pasting and placement to design apps (i.e. Sketch)
	grunt.registerTask( 'addsquare', 'Add transparent square to SVGs', function() {
		var svgFiles = grunt.file.expand( { filter: 'isFile', cwd: 'svg-min/' }, [ '**/*.svg' ] );

		// Add stuff
		svgFiles.forEach( function( svgFile ) {

			// Grab the relevant bits from the file contents
			var fileContent = grunt.file.read( 'svg-min/' + svgFile );

			// Add transparent rectangle to each file
			var insertAt = fileContent.indexOf( '>' ) + 1;
			fileContent = fileContent.slice( 0, insertAt ) +
						'<rect x="0" fill="none" width="20" height="20"/>' +
						fileContent.slice( insertAt );

			// Save and overwrite the files in svg-min
			grunt.file.write( 'svg-min/' + svgFile, fileContent );

		} );

	});

	// ****************************************************************************************************
	// Default task
	grunt.registerTask('default', [
		'svgmin',
		'group',
		'svgstore',
		'kebabToCamelCase',
		'svgreact',
		'babel',
		'webfont',
		'addsquare',
		'clean'
	]);
};
