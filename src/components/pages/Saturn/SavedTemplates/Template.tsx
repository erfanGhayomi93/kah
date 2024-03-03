import { PinSVG } from '@/components/icons';
import { cn } from '@/utils/helpers';
import { useMemo } from 'react';

interface TemplateProps extends Saturn.Template {
	isActive: boolean;
	onPin: () => void;
	onSelect: () => void;
}

const Template = ({ name, content, isActive, isPinned, onSelect, onPin }: TemplateProps) => {
	const symbols: string[] = useMemo(() => {
		const symbolsAsString: string[] = [];

		try {
			const data = JSON.parse(content) as Saturn.Content;
			symbolsAsString.push(data.baseSymbolTitle);

			for (let i = 0; i < data.options.length; i++) {
				symbolsAsString.push(data.options[i].symbolTitle);
			}

			return symbolsAsString;
		} catch (error) {
			return symbolsAsString;
		}
	}, [content]);

	return (
		<div className='w-full gap-16 flex-justify-between'>
			<button
				onClick={onPin}
				type='button'
				style={{
					transform: isPinned ? '' : 'rotate(-45deg)',
					transition: 'border-color 250ms, background-color 250ms, color 250ms, transform 250ms',
				}}
				className={cn(
					'size-20 rounded-circle border flex-justify-center',
					isPinned
						? 'border-primary-400 bg-primary-400 text-white'
						: 'border-gray-900 bg-white text-gray-900 transition-colors hover:border-primary-400 hover:text-primary-400',
				)}
			>
				<PinSVG width='2rem' height='2rem' />
			</button>

			<div
				onClick={onSelect}
				className={cn(
					'h-72 flex-1 cursor-pointer items-start justify-center gap-12 rounded border px-16 py-8 transition-colors flex-column',
					isActive
						? 'border-primary-400 bg-primary-400 hover:bg-primary-300'
						: 'border-gray-500 bg-gray-200 transition-colors hover:bg-primary-100',
				)}
			>
				<h3 className={cn('text-lg font-medium', isActive ? 'text-white' : 'text-gray-900')}>{name}</h3>

				{symbols.length > 0 && (
					<div className={cn('flex select-none gap-8 text-tiny', isActive ? 'text-white' : 'text-gray-900')}>
						{symbols.map((symbolTitle, i) => (
							<span key={i}>{symbolTitle}</span>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default Template;
