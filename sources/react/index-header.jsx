/* !!!
IF YOU ARE EDITING dashicon/index.jsx
THEN YOU ARE EDITING A FILE THAT GETS OUTPUT FROM THE DASHICONS REPO!
DO NOT EDIT THAT FILE! EDIT index-header.jsx and index-footer.jsx instead
OR if you're looking to change now SVGs get output, you'll need to edit strings in the Gruntfile :)
!!! */

/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { Path, SVG } from '../primitives';
import { getIconClassName } from './icon-class';

export default class Dashicon extends Component {
	render() {
		const { icon, size = 20, className, ariaPressed, ...extraProps } = this.props;
		let path;

		switch ( icon ) {
