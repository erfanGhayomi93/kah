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
		<li className='w-full gap-16 overflow-hidden flex-justify-between'>
			<button
				onClick={onPin}
				type='button'
				style={{
					transform: isPinned ? '' : 'rotate(-45deg)',
					transition: 'border-color 250ms, background-color 250ms, color 250ms, transform 250ms',
				}}
				className={cn(
					'size-20 rounded-circle border transition-colors flex-justify-center',
					isPinned
						? 'border-light-primary-100 bg-light-primary-100 text-white'
						: 'border-light-gray-700 text-light-gray-700 hover:border-light-primary-100 hover:text-light-primary-100 bg-white',
				)}
			>
				<PinSVG width='2rem' height='2rem' />
			</button>

			<div
				onClick={onSelect}
				className={cn(
					'h-72 flex-1 cursor-pointer items-start justify-center gap-12 overflow-hidden rounded border px-16 py-8 transition-colors flex-column',
					isActive
						? 'hover:bg-light-primary-100 border-light-primary-100 bg-light-primary-100'
						: 'bg-light-gray-100 border-light-gray-200 hover:btn-hover',
				)}
			>
				<h3 className={cn('text-lg font-medium', isActive ? 'text-white' : 'text-light-gray-700')}>{name}</h3>

				{symbols.length > 0 && (
					<div
						className={cn(
							'flex select-none gap-8 text-tiny',
							isActive ? 'text-white' : 'text-light-gray-700',
						)}
					>
						{symbols.map((symbolTitle, i) => (
							<span key={i}>{symbolTitle}</span>
						))}
					</div>
				)}
			</div>
		</li>
	);
};

export default Template;
