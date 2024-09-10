import Tooltip from '@/components/common/Tooltip';
import { PinSVG, TrashSVG } from '@/components/icons';
import { cn } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

interface TemplateProps extends Saturn.Template {
	isActive: boolean;
	onPin: () => void;
	onDelete: () => void;
	onSelect: () => void;
}

const Template = ({ name, content, isActive, isPinned, onSelect, onDelete, onPin }: TemplateProps) => {
	const t = useTranslations('tooltip');

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
		<li className='w-full gap-12 overflow-hidden flex-justify-between'>
			{/* <button className='text-gray-200'>
				<DragSVG width='2.4rem' height='2.4rem' />
			</button> */}

			<div
				onClick={onSelect}
				className={cn(
					'h-72 flex-1 cursor-pointer overflow-hidden rounded border px-16 transition-colors flex-justify-between',
					isActive
						? 'border-primary-100 bg-primary-100 hover:bg-primary-100'
						: 'border-gray-200 bg-gray-100 hover:btn-hover',
				)}
			>
				<div className='flex-1 gap-10 overflow-hidden flex-column'>
					<h3 className={clsx('text-lg font-medium', isActive ? 'text-white' : 'text-gray-700')}>{name}</h3>

					{symbols.length > 0 && (
						<div className={clsx('flex select-none gap-4', isActive ? 'text-white' : 'text-gray-700')}>
							{symbols.map((symbolTitle, i) => (
								<span key={i} className={clsx(i === symbols.length - 1 && 'truncate')}>
									<span className={i === 0 ? 'text-base' : 'text-tiny'}>{symbolTitle}</span>
									{i === symbols.length - 1 ? '' : '،'}
								</span>
							))}
						</div>
					)}
				</div>

				<div className='flex gap-8'>
					<Tooltip placement='bottom' content={t('delete')}>
						<button
							onClick={(e) => {
								e.stopPropagation();
								onDelete();
							}}
							type='button'
							className={clsx(
								'size-20 rounded-circle border border-current transition-colors flex-justify-center',
								isActive ? 'text-white ' : 'text-gray-700',
							)}
						>
							<TrashSVG width='1rem' height='1rem' />
						</button>
					</Tooltip>

					<Tooltip placement='bottom' content={t('pin')}>
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
								'size-20 rounded-circle border border-current flex-justify-center',
								isActive ? 'text-white ' : 'text-gray-700',
							)}
						>
							<PinSVG width='1rem' height='1rem' />
						</button>
					</Tooltip>
				</div>
			</div>
		</li>
	);
};

export default Template;
