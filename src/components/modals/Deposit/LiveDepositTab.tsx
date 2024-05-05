import brokerAxios from '@/api/brokerAxios';
import Input from '@/components/common/Inputs/Input';
import { convertStringToInteger, sepNumbers } from '@/utils/helpers';
import num2persian from '@/utils/num2persian';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'react-toastify';

export const LiveDepositTab = () => {
	const t = useTranslations();

	const [value, setValue] = useState('');

	// const url = useSelector(getBrokerURLs);

	const handleClickDeposit = async () => {
		const { data } = await brokerAxios.post<ServerResponse<Payment.IDepositResponse>>(
			'https://backoffice.ramandtech.com/EPaymentApi/v1/CreateRequest' + `?amount=${value}`,
		);

		if (data.succeeded) {
			toast.info(t('alerts.redirecting_to_payment') + '...', {
				autoClose: 3000,
			});

			setTimeout(() => {
				window.location.href = `https://sep.shaparak.ir/OnlinePG/SendToken?Token=${data.result.bankToken}`;
			}, 1250);
		}
	};

	return (
		<div className='mt-24 flex flex-1 flex-col justify-between'>
			<Input
				value={sepNumbers(String(value))}
				onChange={(e) => setValue(convertStringToInteger(e.target.value))}
				type='text'
				prefix={t('common.rial')}
				placeholder={t('deposit_modal.placeholderDepositInput')}
				classInput='placeholder:text-right'
				inputMode='numeric'
				maxLength={25}
				num2persianValue={num2persian(String(value))}
			/>

			<button className='h-48 w-full rounded btn-success' type='button' onClick={handleClickDeposit}>
				{t('deposit_modal.submitDeposit')}
			</button>
		</div>
	);
};
