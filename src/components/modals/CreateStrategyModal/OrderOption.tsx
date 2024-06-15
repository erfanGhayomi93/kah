import { useCommissionsQuery } from '@/api/queries/commonQueries';
import { LockSVG, UnlockSVG } from '@/components/icons';
import { convertStringToInteger, sepNumbers } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

interface OrderOptionProps {
	symbolTitle: string;
	bestLimitPrice: number;
	quantity: number;
	price: number;
	marketUnit: string;
	onChangePrice: (v: number) => void;
	onSubmit: () => void;
}

const OrderOption = ({
	bestLimitPrice,
	symbolTitle,
	quantity,
	price,
	marketUnit,
	onChangePrice,
	onSubmit,
}: OrderOptionProps) => {
	const t = useTranslations();

	const { data: commission } = useCommissionsQuery({
		queryKey: ['commissionQuery'],
	});

	const [isPriceLocked, setIsPriceLocked] = useState(false);

	const onChange = (v: number) => {
		if (isPriceLocked) setIsPriceLocked(false);
		onChangePrice(v);
	};

	useEffect(() => {
		if (isPriceLocked) onChangePrice(bestLimitPrice);
	}, [isPriceLocked]);

	const symbolCommission = commission?.find((item) => item.marketUnitTitle === marketUnit)?.buyCommission ?? 0;
	const transactionCommission = Math.ceil(price * quantity + price * quantity * symbolCommission);

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				if (price !== 0 && quantity !== 0) onSubmit();
			}}
			className='flex-1 justify-between gap-24 pt-8 flex-column'
		>
			<div className='flex-1 gap-8 flex-column'>
				<div className='border-light-gray-200 bg-light-gray-100 text-light-gray-700 h-40 cursor-default rounded border px-8 flex-justify-between'>
					<span>{t('create_strategy.quantity_input')}</span>
					<span>{sepNumbers(String(quantity))}</span>
				</div>

				<div className='flex h-40 gap-8'>
					<label className='border-light-gray-200 h-full flex-1 gap-8 rounded border px-8 flex-justify-center'>
						<span className='text-light-gray-700'>{t('create_strategy.price_input')}</span>
						<input
							value={sepNumbers(String(price))}
							type='text'
							inputMode='numeric'
							className='text-light-gray-800 flex-1 bg-transparent text-left ltr'
							onChange={(e) => onChange(Number(convertStringToInteger(e.target.value)))}
						/>
					</label>

					<button
						onClick={() => setIsPriceLocked(!isPriceLocked)}
						type='button'
						className={clsx(
							'size-40 rounded !border transition-colors flex-justify-center',
							isPriceLocked ? 'no-hover btn-select' : 'border-light-gray-200 text-light-gray-700',
						)}
					>
						{isPriceLocked ? (
							<LockSVG width='2rem' height='2rem' />
						) : (
							<UnlockSVG width='2rem' height='2rem' />
						)}
					</button>
				</div>
			</div>

			<button
				disabled={quantity === 0 || price === 0}
				type='submit'
				className='h-40 rounded text-base font-medium flex-justify-center btn-error'
			>
				{t('create_strategy.send_sell_order', { n: symbolTitle })}
			</button>
		</form>
	);
};

export default OrderOption;
