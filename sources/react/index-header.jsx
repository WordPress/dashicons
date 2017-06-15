/* !!!
IF YOU ARE EDITING dashicon/index.jsx
THEN YOU ARE EDITING A FILE THAT GETS OUTPUT FROM THE DASHICONS REPO!
DO NOT EDIT THAT FILE! EDIT index-header.jsx and index-footer.jsx instead
OR if you're looking to change now SVGs get output, you'll need to edit strings in the Gruntfile :)
!!! */

/**
 * External dependencies
 */
export default class Dashicon extends wp.element.Component {
	shouldComponentUpdate( nextProps ) {
		return (
			this.props.icon !== nextProps.icon ||
			this.props.className !== nextProps.className
		);
	}

	render() {
		const { icon, className } = this.props;
		let path;

		switch ( icon ) {
