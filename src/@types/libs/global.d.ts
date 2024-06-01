declare module 'save-svg-as-png' {
	interface Options {
		backgroundColor: string;
		encoderOptions: number;
		encoderType: string;
		fonts: Array<Record<'text' | 'url' | 'format', string>>;
		height: number;
		width: number;
		top: number;
		left: number;
		scale: number;
	}
	const saveSvgAsPng: (el: HTMLElement, filename: string, options?: Partial<Options>) => void;
	export { saveSvgAsPng };
}
