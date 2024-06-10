import { useCommissionsQuery } from '@/api/queries/commonQueries';
import ipcMain from '@/classes/IpcMain';
import Tooltip from '@/components/common/Tooltip';
import { LockSVG, QuestionCircleOutlineSVG, UnlockSVG } from '@/components/icons';
import { useInputs } from '@/hooks';
import { convertStringToInteger, sepNumbers } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';

interface BuyFormProps {
	symbolISIN: string;
	quantity: number;
	price: number;
	marketUnit: string;
	validityDate: TBsValidityDates;
	onChangePrice: (v: number) => void;
}

const BuyForm = ({ symbolISIN, price, quantity, validityDate, marketUnit, onChangePrice }: BuyFormProps) => {
	const t = useTranslations();

	const inputRef = useRef<HTMLInputElement>(null);

	const {
		inputs: priceInfo,
		setFieldValue: setPriceInfoField,
		setInputs: setPriceInfo,
	} = useInputs({
		isLocked: false,
		value: price,
	});

	const { data: commission, isLoading } = useCommissionsQuery({
		queryKey: ['commissionQuery'],
	});

	const onChange = (v: number) => {
		if (priceInfo.isLocked) setPriceInfoField('isLocked', false);
		onChangePrice(v);
	};

	useEffect(() => {
		ipcMain
			.sendAsync<
				IpcMainChannels['execute_strategy:symbol_data'] | null
			>('execute_strategy:get_symbol_data', [symbolISIN, 'bestSellLimitPrice_1'])
			.then((data) => {
				if (data) {
					setPriceInfoField('value', data.value ?? 0);
					onChangePrice(data.value ?? 0);
				}
			});
	}, []);

	useEffect(() => {
		const abort = ipcMain.handle('execute_strategy:symbol_data', ({ itemName, fieldName, value }) => {
			if (itemName === symbolISIN && fieldName === 'bestSellLimitPrice_1') {
				setPriceInfo({
					isLocked: priceInfo.isLocked,
					value,
				});

				if (priceInfo.isLocked) onChangePrice(value);
			}
		});

		return () => {
			abort();
		};
	}, [priceInfo.isLocked]);

	const symbolCommission = commission?.find((item) => item.marketUnitTitle === marketUnit)?.buyCommission ?? 0;
	const transactionCommission = Math.ceil(price * quantity + price * quantity * symbolCommission);

	return (
		<form className='flex-1 justify-between gap-24 pt-8 flex-column'>
			<div className='flex-1 gap-8 flex-column'>
				<div className='h-40 cursor-default rounded border border-input bg-gray-200 px-8 text-gray-900 flex-justify-between'>
					<span>{t('create_strategy.quantity_input')}</span>
					<span>{sepNumbers(String(quantity))}</span>
				</div>

				<div className='flex h-40 gap-8'>
					<label className='h-full flex-1 gap-8 rounded border border-input px-8 flex-justify-center'>
						<span className='text-gray-900'>{t('create_strategy.price_input')}</span>
						<input
							ref={inputRef}
							value={sepNumbers(String(price))}
							type='text'
							inputMode='numeric'
							className='flex-1 bg-transparent text-left text-gray-1000 ltr'
							onChange={(e) => onChange(Number(convertStringToInteger(e.target.value)))}
						/>
					</label>
					<button
						onClick={() => setPriceInfoField('isLocked', !priceInfo.isLocked)}
						type='button'
						className={clsx(
							'size-40 rounded !border transition-colors flex-justify-center',
							priceInfo.isLocked ? 'no-hover btn-select' : 'border-input text-gray-900',
						)}
					>
						{priceInfo.isLocked ? (
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

				<button type='button' className='h-40 rounded text-base font-medium flex-justify-center btn-success'>
					{t('create_strategy.send_order') + ' ' + t('side.buy')}
				</button>
			</div>
		</form>
	);
};

export default BuyForm;
