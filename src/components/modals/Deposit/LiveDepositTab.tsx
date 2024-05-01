import brokerAxios from '@/api/brokerAxios';
import Input from '@/components/common/Inputs/Input';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { convertStringToInteger, sepNumbers } from '@/utils/helpers';
import num2persian from '@/utils/num2persian';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';


export const LiveDepositTab = () => {

	const t = useTranslations();

	const [value, setValue] = useState('');

	const url = useSelector(getBrokerURLs);

	// const { data } = usePaymentCreateQuery();

	// useEffect(() => {
	// 	console.log('data', (data));
	// }, [data]);

	const handleClickDeposit = async () => {
		if (!url?.createRequestEPaymentApi) return;

		const { data } = await brokerAxios.post<ServerResponse<Payment.IDepositResponse>>(url?.createRequestEPaymentApi + `?amount=${value}`);
		// console.log('data', data.result.bankToken, data);

		if (data.succeeded) {
			toast.info(t('alerts.redirecting_to_payment') + '...', {
				autoClose: 3000
			});

			setTimeout(() => {
				window.location.href = `https://sep.shaparak.ir/OnlinePG/SendToken?Token=${data.result.bankToken}`;
			}, 1250);
		}

	};


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
				onClick={handleClickDeposit}
			>
				{t('deposit_modal.submitDeposit')}
			</button>


		</div>
	);
};
