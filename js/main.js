;(function( window, document, $, undefined ) {

'use strict';

var DashIcons = function() {
	return this.init();
};

DashIcons.prototype = {

	init : function() {
		var self = this;

		// When finished loading method "self.getIconList", call "self.pickRandomIcon"
		$.when( self.getIconList() )
		.then(function() {
			self.pickRandomIcon();
		});

		// All events are called in this method "self.initEvents"
		self.initEvents();
	}, // init


	initEvents : function() {
		var self = this;

		// Select Glyph
		$( '#iconlist' ).on( 'click', 'div', self.displayGlyph );

		// Copy text to clipboard
		$( 'a.copy-text' ).on( 'click', self.copyToClipboard );

		// Select code on textarea
		$( 'textarea.code' ).on( 'click', self.selectText );

		// Toggle Instructions (once)
		$( 'a.show-instructions' ).one( 'click', self.showInstructions );

	}, // initEvents


	getIconList : function() {
		var url = 'json/dashicons.json',
			$container = $( '#iconlist' );

		return $.getJSON( url, function( data ) {
			var icons = data.icons,
				output = [],
				i,
				j,
				category,
				code,
				css_class;


			for( i in icons ) {
				category = icons[i];
				j = icons[i].length;

				while( j-- ) {
					code = category[j].code;
					css_class = i + ' dashicons dashicons-' + category[j].name;
					output.push( '<div data-code="' + code + '" class="' + css_class + '"></div>' );
				}
			}

			$container.append( output.join( '' ) );
		});
	}, // getIconList


	pickRandomIcon : function() {
		var $icons = $( '#iconlist div' ),
			amount_icons = $icons.length,
			rand = Math.round( Math.random() * amount_icons );

		$( $icons[ rand ] ).trigger( 'click' );
	}, // pickRandomIcon


	displayGlyph : function( e ) {
		e.preventDefault();

			// ELements
		var $this               = $( this ),
			$glyph_temp_element = $( document.createElement( 'div' ) ),
			code                = $this.data( 'code' ),
			css_class           = $this.attr( 'class' ),
			icon_name           = css_class.split( ' ' )[2],

			// Icon Texts
			css_text        = 'content: \"\\' + code + '";',
			html_text       = '<div class="' + css_class + '"></div>',
			glyph_temp_text = '&#x' + code + ';',
			glyph_text      = $glyph_temp_element.html( glyph_temp_text ).text(),

			// DOM Elements
			$glyph            = $( '#glyph' ),
			$glyph_info       = $glyph.find( 'div.info' );


		// Icon
		$glyph.find( 'div.dashicons' ).attr( 'class', css_class );
		// Icon name
		$glyph_info.find( 'strong' ).html( '&larr; ' + icon_name );
		// Copy CSS Text
		$glyph_info.find( 'a.copy-css' ).attr( 'data-text', css_text );
		// Copy HTML Text
		$glyph_info.find( 'a.copy-html' ).attr( 'data-text', html_text );
		// Copy Glyph Text
		$glyph_info.find( 'a.copy-glyph' ).attr( 'data-text', glyph_text );

		// Scroll page to top
		$( 'html, body, document' ).animate({ scrollTop : 0 }, 500);

		// Active selected icon
		$( '#iconlist' ).find( 'div' ).removeClass( 'active' );
		$this.addClass( 'active' );

	}, // displayGlyph


	copyToClipboard : function( e ) {
		e.preventDefault();

		var $this = $( this ),
			type = $this.attr( 'data-type' ),
			text = $this.attr( 'data-text' ),
			phrases = {
				css   : 'Copy this, then paste in your CSS :before selector.',
				html  : 'Copy this, then paste in your HTML.',
				glyph : 'Copy this, then paste in your Photoshop textfield.'
			};

		window.prompt( phrases[ type ], text );

	}, //copyToClipboard


	selectText : function( e ) {
		return this.select();
	}, // selectText


	showInstructions : function( e ) {
		e.preventDefault();
		$( '#instructions' ).slideDown();
		$( this ).hide();
	}

};



// DOM Loaded
$(function() {
	var dashicons = new DashIcons();
});

})( window, document, jQuery );
