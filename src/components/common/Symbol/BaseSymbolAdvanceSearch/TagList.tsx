import { EraserSVG, XSVG } from '@/components/icons';
import clsx from 'clsx';

interface TagListProps {
	tagOnly: boolean;
	data: Option.BaseSearch[];
	clear: () => void;
	removeSymbol: (symbolISIN: string) => void;
}

interface TagProps extends Option.BaseSearch {
	removeSymbol: () => void;
}

const TagList = ({ data, tagOnly, clear, removeSymbol }: TagListProps) => {
	if (data.length === 0) return null;

	const slicedData = data.length < 12 ? data : data.slice(0, 11);
	const remainsDataLength = Math.max(0, data.length - 11);

	return (
		<div className='w-full px-8'>
			<div
				className={clsx(
					'w-full border-b py-16 flex-justify-between',
					tagOnly ? 'border-b-transparent' : 'border-light-gray-200',
				)}
			>
				<ul className='flex-1 flex-wrap gap-8 flex-justify-start'>
					{slicedData.map((item) => (
						<Tag key={item.symbolISIN} {...item} removeSymbol={() => removeSymbol(item.symbolISIN)} />
					))}
					{remainsDataLength > 0 && (
						<div className='w-24 text-center font-medium text-light-gray-700'>{remainsDataLength}+</div>
					)}
				</ul>

				<button onClick={clear} type='button' className='size-24 grow-0 icon-hover'>
					<EraserSVG width='2rem' height='2rem' />
				</button>
			</div>
		</div>
	);
};

const Tag = ({ symbolTitle, removeSymbol }: TagProps) => (
	<li className='h-32 gap-8 rounded bg-light-secondary-100 pr-8 flex-items-center *:text-light-gray-700'>
		<span className='text-tiny'>{symbolTitle}</span>
		<button onClick={removeSymbol} type='button' className='size-24 flex-justify-center'>
			<XSVG width='1.4rem' height='1.4rem' />
		</button>
	</li>
);

export default TagList;
