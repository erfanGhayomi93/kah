import Radiobox from '@/components/common/Inputs/Radiobox';
import { XCircleSVG } from '@/components/icons';
import { sepNumbers } from '@/utils/helpers';
import clsx from 'clsx';

interface CardProps {
	isActive: boolean;
	description: React.ReactNode;
	icon: React.ReactNode;
	value: number;
	title: string;
	prefix: string;
	error?: string;
	children?: React.ReactNode;
	onClick: () => void;
}
const Card = ({ isActive, description, icon, value, title, prefix, children, error, onClick }: CardProps) => (
	<div
		className={clsx(
			'overflow-hidden pt-16 transition-bg flex-column',
			isActive ? 'bg-white darkness:bg-gray-50' : 'bg-gray-100',
			!children && 'pb-16',
		)}
	>
		<div onClick={onClick} className='flex-48 cursor-pointer px-16 flex-justify-between'>
			<div
				className={clsx(
					'flex-1 gap-8 text-base transition-color flex-justify-start',
					isActive ? 'text-primary-100' : 'text-gray-700',
				)}
			>
				<Radiobox checked={isActive} onChange={onClick} />

				{icon}

				<span>{title}</span>
			</div>

			<div className='flex-1 gap-8 flex-justify-end'>
				<span className={clsx('transition-color', isActive ? 'font-medium text-gray-800' : 'text-gray-700')}>
					{sepNumbers(String(value))}
				</span>
				<span className='text-tiny text-gray-700'>{prefix}</span>
			</div>
		</div>

		<div
			className={clsx(
				'flex-1 overflow-hidden px-16 text-tiny text-gray-700 transition-all',
				isActive ? 'pt-8 opacity-100' : 'p-0 opacity-0',
			)}
			style={{
				flexBasis: isActive ? '2.8rem' : '0',
			}}
		>
			{description}
		</div>

		<div
			className={clsx(
				'flex-1 gap-8 overflow-hidden px-16 text-tiny text-error-100 transition-all flex-items-center',
				isActive && Boolean(error) ? 'pt-16 opacity-100' : 'p-0 opacity-0',
			)}
			style={{
				flexBasis: isActive && Boolean(error) ? '3.6rem' : '0',
			}}
		>
			<XCircleSVG width='1.6rem' height='1.6rem' />
			<span className='text-tiny font-medium'>{error}</span>
		</div>

		{Boolean(children) && (
			<div
				className={clsx('transition-all', isActive ? 'p-16 opacity-100' : 'pb-16 opacity-0')}
				style={{
					maxHeight: isActive ? '28.4rem' : '0',
				}}
			>
				<div className='border-t border-t-gray-200 pt-16'>
					<div
						style={{ maxHeight: '20.8rem' }}
						className='overflow-auto rounded bg-white shadow-sm darkness:bg-gray-50'
					>
						{children}
					</div>
				</div>
			</div>
		)}
	</div>
);

export default Card;
