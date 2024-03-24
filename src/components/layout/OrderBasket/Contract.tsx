import Checkbox from '@/components/common/Inputs/Checkbox';
import { TrashSVG } from '@/components/icons';
import { convertStringToInteger, copyNumberToClipboard, sepNumbers } from '@/utils/helpers';
import clsx from 'clsx';

type ContractProps = TOrderBasket & {
	index: number;
	checked: boolean;
	setProperty: <T extends keyof TOrderBasket>(field: T, value: IFillOrderBasket[T]) => void;
	onSelect: (checked: boolean) => void;
	onDelete: () => void;
};

const Contract = ({
	contract,
	symbolISIN,
	side,
	settlementDay,
	strikePrice,
	quantity,
	price,
	index,
	checked,
	setProperty,
	onSelect,
	onDelete,
}: ContractProps) => {
	return (
		<li
			key={symbolISIN}
			style={{
				top: `${index * 40 + index * 8}px`,
				transition: 'top 250ms ease',
			}}
			className='absolute left-0 h-40 w-full gap-8 px-16 flex-justify-start'
		>
			<div style={{ flex: '0 0 24px' }} className='h-40 flex-items-center'>
				<Checkbox checked={checked} onChange={onSelect} />
			</div>

			<div style={{ flex: '0 0 84px' }}>
				<button
					onClick={() => setProperty('side', side === 'call' ? 'put' : 'call')}
					type='button'
					className={clsx(
						'size-40 rounded transition-colors',
						side === 'call' ? 'bg-success-100/10 text-success-100' : 'bg-error-100/10 text-error-100',
					)}
				>
					{side === 'call' ? 'B' : 'S'}
				</button>
			</div>

			<div className='flex-1' />

			<div className='flex-1'>
				<input
					onCopy={(e) => copyNumberToClipboard(e, strikePrice)}
					type='text'
					inputMode='numeric'
					className='h-40 w-full rounded border border-input px-8 text-center ltr'
					value={sepNumbers(String(strikePrice))}
					onChange={(e) => setProperty('strikePrice', Number(convertStringToInteger(e.target.value)))}
				/>
			</div>

			<div className='flex-1'>
				<input
					onCopy={(e) => copyNumberToClipboard(e, quantity)}
					type='text'
					inputMode='numeric'
					className='h-40 w-full rounded border border-input px-8 text-center ltr'
					value={sepNumbers(String(quantity))}
					onChange={(e) => setProperty('quantity', Number(convertStringToInteger(e.target.value)))}
				/>
			</div>

			<div className='flex-1'>
				<input
					onCopy={(e) => copyNumberToClipboard(e, price)}
					type='text'
					inputMode='numeric'
					className='h-40 w-full rounded border border-input px-8 text-center ltr'
					value={sepNumbers(String(price))}
					onChange={(e) => setProperty('price', Number(convertStringToInteger(e.target.value)))}
				/>
			</div>

			<div style={{ flex: '0 0 24px' }} className='h-40 flex-items-center'>
				<button onClick={onDelete} type='button' className='text-gray-900'>
					<TrashSVG className='2rem' height='2rem' />
				</button>
			</div>
		</li>
	);
};

export default Contract;
