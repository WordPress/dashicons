	function copyToClipboard ( text, copyMode ) {
		if ( copyMode == "css" ) {
			window.prompt( "Copy this, then paste in your CSS :before selector.", text );
		} else if ( copyMode == "html" ) {
			window.prompt( "Copy this, then paste in your HTML.", text );
		} else {
			window.prompt( "Copy this, then paste in your Photoshop textfield.", text );
		}
	}

	function pickRandomIcon() {
		var divs = jQuery("#iconlist div").get().sort(function(){
				return Math.round(Math.random())-0.5;
			}).slice(0,1);

		attr = jQuery(divs).data('code');
		cssclass = jQuery(divs).attr('class');
		displayGlyph( attr, cssclass );

	}

	function displayGlyph( attr, cssclass ) {

		// css copy string
		csstext = 'content: \"\\' + attr + '";';

		// html copy string
		htmltext = '<div class="' + cssclass + '"></div>';

		// glyph copy string
		glyphtemp = "&#x" + attr + ";";
		jQuery('#temp').html( glyphtemp );
		glyphtext = jQuery('#temp').text();

		// final output
		output = '<div class="' + cssclass + '"></div>'
		+ '<div class="info">'
			+ '<strong>&larr; ' + cssclass.split( ' ' )[1] + '</strong>'
			+ '<a href="javascript:copyToClipboard(csstext, \'css\')">Copy CSS</a>'
			+ '<a href="javascript:copyToClipboard(htmltext, \'html\')">Copy HTML</a>'
			+ '<a href="javascript:copyToClipboard(glyphtext)">Copy Glyph</a>'
		+ '</div>';

		jQuery( '#glyph' ).html( output );

	}

	jQuery(document).ready(function() {

		pickRandomIcon();

		jQuery( '#iconlist div' ).click(function() {

			attr = jQuery( this ).data( 'code' );
			cssclass = jQuery( this ).attr( 'class' );

			displayGlyph( attr, cssclass );

		});

	});