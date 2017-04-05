/** @ssr-ready **/

/* !!!
IF YOU ARE EDITING dashicon/index.jsx
THEN YOU ARE EDITING A FILE THAT GETS OUTPUT FROM THE DASHICONS REPO!
DO NOT EDIT THAT FILE! EDIT index-header.jsx and index-footer.jsx instead
OR if you're looking to change now SVGs get output, you'll need to edit strings in the Gruntfile :)
!!! */

/**
 * External dependencies
 */
import React, { PureComponent, PropTypes } from 'react';

export default class Dashicon extends PureComponent {

	static defaultProps = {
		size: 20,
		size: 20
	};

	static propTypes = {
		icon: PropTypes.string.isRequired,
		size: PropTypes.number,
		onClick: PropTypes.func,
		className: PropTypes.string
	};

	needsOffset( icon, size ) {
		const iconNeedsOffset = [
		];

		if ( iconNeedsOffset.indexOf( icon ) >= 0 ) {
			return ( size % 15 === 0 );
		} else {
			return false;
		}
	}

	needsOffsetX( icon, size ) {
		const iconNeedsOffsetX = [
		];

		if ( iconNeedsOffsetX.indexOf( icon ) >= 0 ) {
			return ( size % 15 === 0 );
		} else {
			return false;
		}
	}

	needsOffsetY( icon, size ) {
		const iconNeedsOffsetY = [
		];

		if ( iconNeedsOffsetY.indexOf( icon ) >= 0 ) {
			return ( size % 15 === 0 );
		} else {
			return false;
		}
	}

	render() {

		const { size, onClick, icon: iconProp } = this.props;
		const icon = 'dashicons-' + iconProp;
		const needsOffset = this.needsOffset( icon, size );
		const needsOffsetX = this.needsOffsetX( icon, size );
		const needsOffsetY = this.needsOffsetY( icon, size );

		let svg;

		const iconClass = [
			'dashicon',
			icon,
			this.props.className,
			needsOffset ? 'needs-offset' : false,
			needsOffsetX ? 'needs-offset-x': false,
			needsOffsetY ? 'needs-offset-y': false,
		].filter( Boolean ).join( ' ' );

		switch ( icon ) {
			default:
				svg = <svg height={ size } width={ size } />;
				break;
