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
				},
				files: {
					'svg-sprite/dashicons.svg': ['svg/*.svg']
				}
			},
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

	// Load the SVGstore
	grunt.loadNpmTasks('grunt-svgstore');

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
	grunt.registerTask('default', ['svgmin', 'group', 'svgstore', 'addtitle', 'kebabToCamelCase', 'svgreact', 'babel', 'addsquare', 'clean' ]);

};
