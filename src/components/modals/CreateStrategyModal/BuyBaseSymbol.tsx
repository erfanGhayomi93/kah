import { useCommissionsQuery } from '@/api/queries/commonQueries';
import Tooltip from '@/components/common/Tooltip';
import { LockSVG, QuestionCircleOutlineSVG, UnlockSVG } from '@/components/icons';
import { convertStringToInteger, sepNumbers } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

interface BuyBaseSymbolProps {
	symbolTitle: string;
	bestLimitPrice: number;
	quantity: number;
	price: number;
	marketUnit: string;
	validityDate: TBsValidityDates;
	onSubmit: () => void;
	onChangePrice: (v: number) => void;
}

const BuyBaseSymbol = ({
	symbolTitle,
	bestLimitPrice,
	price,
	quantity,
	validityDate,
	marketUnit,
	onSubmit,
	onChangePrice,
}: BuyBaseSymbolProps) => {
	const t = useTranslations();

	const { data: commission, isLoading } = useCommissionsQuery({
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
				<div className='h-40 cursor-default rounded border border-input bg-gray-200 px-8 text-gray-900 flex-justify-between'>
					<span>{t('create_strategy.quantity_input')}</span>
					<span>{sepNumbers(String(quantity))}</span>
				</div>

				<div className='flex h-40 gap-8'>
					<label className='h-full flex-1 gap-8 rounded border border-input px-8 flex-justify-center'>
						<span className='text-gray-900'>{t('create_strategy.price_input')}</span>
						<input
							value={sepNumbers(String(price))}
							type='text'
							inputMode='numeric'
							className='flex-1 bg-transparent text-left text-gray-1000 ltr'
							onChange={(e) => onChange(Number(convertStringToInteger(e.target.value)))}
						/>
					</label>
					<button
						onClick={() => setIsPriceLocked(!isPriceLocked)}
						type='button'
						className={clsx(
							'size-40 rounded !border transition-colors flex-justify-center',
							isPriceLocked ? 'no-hover btn-select' : 'border-input text-gray-900',
						)}
					>
						{isPriceLocked ? (
							<LockSVG width='2rem' height='2rem' />
						) : (
							<UnlockSVG width='2rem' height='2rem' />
						)}
					</button>
				</div>

				<div className='h-40 cursor-default rounded border border-input px-8 text-gray-900 flex-justify-between'>
					<span>{t('create_strategy.validity_input')}</span>
					<span className='no-hover h-24 w-40 rounded !border flex-justify-center btn-select'>
						{t(`validity_date.${validityDate}`)}
					</span>
				</div>
			</div>

			<div className='gap-16 flex-column'>
				<div className='h-24 flex-justify-between'>
					<div className='gap-4 text-gray-900 flex-items-center'>
						{t('create_strategy.order_value') + ':'}
						<Tooltip content='ارزش سفارش' placement='top'>
							<QuestionCircleOutlineSVG width='1.6rem' height='1.6rem' />
						</Tooltip>
					</div>

					<div className='flex gap-4'>
						{isLoading ? (
							<div className='size-16 spinner' />
						) : (
							<>
								{sepNumbers(String(transactionCommission))}
								<span className='text-gray-700'>{t('common.rial')}</span>
							</>
						)}
					</div>
				</div>

				<button
					disabled={quantity === 0 || price === 0}
					type='submit'
					className='h-40 rounded text-base font-medium flex-justify-center btn-success'
				>
					{t('create_strategy.send_buy_order', { n: symbolTitle })}
				</button>
			</div>
		</form>
	);
};

export default BuyBaseSymbol;
