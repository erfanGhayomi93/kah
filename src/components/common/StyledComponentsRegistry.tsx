'use client';

import { useServerInsertedHTML } from 'next/navigation';
import React, { useMemo } from 'react';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';

interface IStyledComponentsRegistry {
	children: React.ReactNode;
}

const StyledComponentsRegistry = ({ children }: IStyledComponentsRegistry) => {
	const styledComponentsStyleSheet = useMemo(() => new ServerStyleSheet(), []);

	useServerInsertedHTML(() => {
		const styles = styledComponentsStyleSheet.getStyleElement();
		styledComponentsStyleSheet.instance.clearTag();
		return styles;
	});

	if (typeof window !== 'undefined') return children;

	return <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>{children}</StyleSheetManager>;
};

export default StyledComponentsRegistry;
