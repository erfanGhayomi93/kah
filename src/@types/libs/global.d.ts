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

declare module '*.svg' {
	import { type FC, type SVGProps } from 'react';
	const content: FC<SVGProps<SVGElement>>;
	export default content;
}

declare module '*.svg?url' {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const content: any;
	export default content;
}
