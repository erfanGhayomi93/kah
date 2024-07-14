import brokerAxios from '@/api/brokerAxios';
import Input from '@/components/common/Inputs/Input';
import { useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { convertStringToInteger, sepNumbers } from '@/utils/helpers';
import num2persian from '@/utils/num2persian';
import { useTranslations } from 'next-intl';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

export const LiveDepositTab = () => {
	const t = useTranslations();

	const { control, handleSubmit, resetField, getValues } = useForm<{ value: string }>({
		defaultValues: {
			value: '',
		},
		mode: 'onChange',
	});

	const url = useAppSelector(getBrokerURLs);

	const onSubmitForm: SubmitHandler<{ value: string }> = async ({ value }) => {
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
		<form onSubmit={handleSubmit(onSubmitForm)} className='flex h-full'>
			<div className='mt-24 flex flex-1 flex-col justify-between'>
				<Controller
					name='value'
					defaultValue=''
					control={control}
					rules={{
						required: { value: true, message: t('deposit_modal.placeholderDepositInput') },
						validate: (value) => +value >= 1000 || t('deposit_modal.minimum_value_error'),
					}}
					render={({ field, fieldState: { invalid, isTouched, error } }) => (
						<Input
							type='text'
							prefix={t('common.rial')}
							placeholder={t('deposit_modal.placeholderDepositInput')}
							classInput='placeholder:text-right'
							inputMode='numeric'
							maxLength={25}
							num2persianValue={num2persian(String(field.value))}
							error={invalid && isTouched ? error?.message : ''}
							{...field}
							value={sepNumbers(String(getValues('value')))}
							onChange={(e) => field.onChange(convertStringToInteger(e.target.value))}
						/>
					)}
				/>

				<button className='h-48 w-full rounded btn-success' type='submit'>
					{t('deposit_modal.submitDeposit')}
				</button>
			</div>
		</form>
	);
};
