		}

		if ( ! path ) {
			return null;
		}

		const iconClass = getIconClassName( icon, className, ariaPressed );

		return (
			<SVG
				aria-hidden
				role="img"
				focusable="false"
				className={ iconClass }
				xmlns="http://www.w3.org/2000/svg"
				width={ size }
				height={ size }
				viewBox="0 0 20 20"
				{ ...extraProps }
			>
				<Path d={ path } />
			</SVG>
		);
	}
}
