		}

		if ( ! path ) {
			return null;
		}

		const iconClass = classnames( 'dashicon', icon, className );

		return (
			<svg className={ iconClass } xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
				{ title ? <title>{ title }</title> : null }
				<path d={ path } />
			</svg>
		);
	}
}
