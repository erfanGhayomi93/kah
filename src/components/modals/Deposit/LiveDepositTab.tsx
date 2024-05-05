import brokerAxios from '@/api/brokerAxios';
import Input from '@/components/common/Inputs/Input';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { convertStringToInteger, sepNumbers } from '@/utils/helpers';
import num2persian from '@/utils/num2persian';
import { useTranslations } from 'next-intl';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export const LiveDepositTab = () => {
	const t = useTranslations();

	const {
		register,
		handleSubmit,
		formState: { errors },
		resetField,
		setValue,
		getValues,
	} =
		useForm<{ value: string }>({
			defaultValues: {
				value: ''
			},
			mode: 'onChange',
		});


	const url = useSelector(getBrokerURLs);

	const onSubmitForm: SubmitHandler<{ value: string }> = async ({
		value
	}) => {
		if (!url) return;

		const { data } = await brokerAxios.post<ServerResponse<Payment.IDepositResponse>>(
			url.createRequestEPaymentApi + `?amount=${convertStringToInteger(value)}`,
		);

		if (data.succeeded) {
			toast.info(t('alerts.redirecting_to_payment') + '...', {
				autoClose: 3000,
			});

			setTimeout(() => {
				window.location.href = `https://sep.shaparak.ir/OnlinePG/SendToken?Token=${data.result.bankToken}`;
			}, 1250);
		}

		resetField('value');
	};

	return (
		<form onSubmit={handleSubmit(onSubmitForm)} className='h-full flex'>
			<div className='mt-24 flex flex-1 flex-col justify-between'>
				<Input
					{...register('value', {
						required: {
							value: true,
							message: t('deposit_modal.placeholderDepositInput')
						},
						// value: sepNumbers(String(getValues('value'))),
						// setValueAs(value) {
						// 	convertStringToInteger(value);
						// },
					})}
					value={sepNumbers(String(getValues('value')))}
					onChange={(e) => setValue('value', convertStringToInteger(e.target.value), { shouldValidate: true })}
					type='text'
					prefix={t('common.rial')}
					placeholder={t('deposit_modal.placeholderDepositInput')}
					classInput='placeholder:text-right'
					inputMode='numeric'
					maxLength={25}
					num2persianValue={num2persian(String(getValues('value')))}
					error={errors.value?.message}
				/>

				<button className='h-48 w-full rounded btn-success'
					type='submit'
				// onClick={handleClickDeposit}
				>
					{t('deposit_modal.submitDeposit')}
				</button>

			</div>
		</form>
	);
};
