import { PinSVG } from '@/components/icons';
import { cn } from '@/utils/helpers';
import clsx from 'clsx';
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
			<div
				onClick={onSelect}
				className={cn(
					'h-72 flex-1 cursor-pointer overflow-hidden rounded border px-16 transition-colors flex-justify-between',
					isActive
						? 'border-light-primary-100 bg-light-primary-100 hover:bg-light-primary-100'
						: 'border-light-gray-200 bg-light-gray-100 hover:btn-hover',
				)}
			>
				<div className='gap-10 flex-column'>
					<h3 className={clsx('text-lg font-medium', isActive ? 'text-white' : 'text-light-gray-700')}>
						{name}
					</h3>

					{symbols.length > 0 && (
						<div
							className={clsx('flex select-none gap-4', isActive ? 'text-white' : 'text-light-gray-700')}
						>
							{symbols.map((symbolTitle, i) => (
								<span key={i}>
									<span className={i === 0 ? 'text-base' : 'text-tiny'}>{symbolTitle}</span>
									{i === symbols.length - 1 ? '' : '،'}
								</span>
							))}
						</div>
					)}
				</div>

				<button
					onClick={(e) => {
						e.stopPropagation();
						onPin();
					}}
					type='button'
					style={{
						transform: isPinned ? 'rotate(45deg)' : 'rotate(0deg)',
						transition: 'border-color 250ms, background-color 250ms, color 250ms, transform 250ms',
					}}
					className={clsx(
						'size-20 rounded-circle border border-current transition-colors flex-justify-center',
						isActive ? 'text-white ' : 'text-light-gray-700',
					)}
				>
					<PinSVG width='1rem' height='1rem' />
				</button>
			</div>
		</li>
	);
};

export default Template;
