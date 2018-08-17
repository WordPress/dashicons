import SVG from 'react-native-svg';

export default ( props ) => (
	<SVG width={ props.width } height={ props.height } >
		{ props.children }
	</SVG>
);
