import Input from '@/components/common/Inputs/Input';
import { convertStringToInteger, sepNumbers } from '@/utils/helpers';
import num2persian from '@/utils/num2persian';
import { useTranslations } from 'next-intl';
import { useState } from 'react';


export const LiveDepositTab = () => {

	const t = useTranslations();

	const [value, setValue] = useState('');

	// useEffect(() => {
	// 	console.log('value', (value));
	// }, [value]);


	return (
		<div className="flex flex-col justify-between flex-1 mt-24">


			<Input
				value={sepNumbers((String(value)))}
				onChange={(e) => setValue(convertStringToInteger(e.target.value))}
				type='text'
				prefix={t('common.rial')}
				placeholder={t('deposit_modal.placeholderDepositInput')}
				classInput="placeholder:text-right"
				inputMode='numeric'
				maxLength={25}
				num2persianValue={num2persian((String(value)))}
			/>


			<button
				className='h-48 btn-success rounded w-full'
				type='button'
			>
				{t('deposit_modal.submitDeposit')}
			</button>


		</div>
	);
};
