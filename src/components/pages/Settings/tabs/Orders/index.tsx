'use client';

import brokerAxios from '@/api/brokerAxios';
import { useGetCustomerSettingsQuery } from '@/api/queries/brokerPrivateQueries';
import Input from '@/components/common/Inputs/Input';
import Switch from '@/components/common/Inputs/Switch';
import Loading from '@/components/common/Loading';
import { useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import useDebounce from '@/hooks/useDebounce';
import { convertStringToInteger, sepNumbers } from '@/utils/helpers';
import auth from '@/utils/hoc/auth';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import SettingCard from '../../components/SettingCard';
import SettingCardField from '../../components/SettingCardField';

type TFieldName = Settings.IBrokerCustomerSettings['configKey'];

interface IUpdateSettingsBody {
	configKey: Settings.IBrokerCustomerSettings['configKey'];
	configValue: string | boolean;
}

const Orders = () => {
	const t = useTranslations();

	const { setDebounce } = useDebounce();

	const defaultFieldValues = useRef<Settings.IFormattedBrokerCustomerSettings>();

	const [fieldValues, setFieldValues] = useState<Settings.IFormattedBrokerCustomerSettings>();

	const brokerURLs = useAppSelector(getBrokerURLs);

	const { data: customerSettings, isFetching: customerSettingsLoading } = useGetCustomerSettingsQuery({
		queryKey: ['GetCustomerSettings'],
		enabled: Boolean(brokerURLs),
	});

	const { mutate: updateCustomerSettings } = useMutation({
		mutationFn: async (settingsData: IUpdateSettingsBody[]) => {
			if (!brokerURLs) return;
			const { data } = await brokerAxios.post(brokerURLs.AccountSettingSet, settingsData);
			return data;
		},
		onSuccess: () => {
			defaultFieldValues.current = fieldValues;
		},
		onError: () => {
			toast.error(t('i_errors.undefined_error'));
			setFieldValues(defaultFieldValues.current);
		},
	});

	const handleFieldValueChange = (fieldName: TFieldName, newValue: string | boolean) => {
		if (!fieldValues) return;

		const customerSettingsBody: IUpdateSettingsBody[] = [];
		for (const key in fieldValues) {
			const keyValue = key as IUpdateSettingsBody['configKey'];
			customerSettingsBody.push({
				configKey: keyValue,
				configValue: fieldName === keyValue ? String(newValue) : String(fieldValues[keyValue]),
			});
		}

		setFieldValues({ ...fieldValues, [fieldName]: newValue });
		setDebounce(() => updateCustomerSettings(customerSettingsBody), 600);
	};

	useEffect(() => {
		if (customerSettings) {
			setFieldValues(customerSettings);
			defaultFieldValues.current = customerSettings;
		}
	}, [customerSettings]);

	const fields = useMemo(
		() => [
			{
				title: t('settings_page.default_buy_volume'),
				value: (
					<Input
						classInput='text-right bg-white darkness:bg-gray-50 !h-40'
						value={
							fieldValues?.defaultBuyVolume === '0'
								? ''
								: sepNumbers(String(fieldValues?.defaultBuyVolume))
						}
						onChange={(e) =>
							handleFieldValueChange('defaultBuyVolume', convertStringToInteger(e.target.value))
						}
						type='text'
						inputMode='numeric'
						placeholder='وارد کنید'
					/>
				),
			},
			{
				title: t('settings_page.default_sell_volume'),
				value: (
					<Input
						classInput='text-right bg-white darkness:bg-gray-50 !h-40'
						value={
							fieldValues?.defaultSellVolume === '0'
								? ''
								: sepNumbers(String(fieldValues?.defaultSellVolume))
						}
						onChange={(e) =>
							handleFieldValueChange('defaultSellVolume', convertStringToInteger(e.target.value))
						}
						type='text'
						inputMode='numeric'
						placeholder='وارد کنید'
					/>
				),
			},
			{
				title: t('settings_page.confirm_before_send_order'),
				value: (
					<>
						<Switch
							checked={!!fieldValues?.confirmBeforeSendOrder}
							onChange={(value) => handleFieldValueChange('confirmBeforeSendOrder', value)}
						/>
					</>
				),
			},
			{
				title: t('settings_page.confirm_before_delete_order'),
				value: (
					<>
						<Switch
							checked={!!fieldValues?.confirmBeforeDelete}
							onChange={(value) => handleFieldValueChange('confirmBeforeDelete', value)}
						/>
					</>
				),
			},
			{
				title: t('settings_page.Get_online_price'),
				value: (
					<>
						<Switch
							checked={!!fieldValues?.breakEvenPoint}
							onChange={(value) => handleFieldValueChange('breakEvenPoint', value)}
						/>
					</>
				),
			},
			{
				title: t('settings_page.market_watcher_message_notification'),
				value: (
					<>
						<Switch
							checked={!!fieldValues?.sendSupervisorMarketMessage}
							onChange={(value) => handleFieldValueChange('sendSupervisorMarketMessage', value)}
						/>
					</>
				),
			},
			{
				title: t('settings_page.show_symbol_info_in_send_order'),
				value: (
					<>
						<Switch
							checked={!!fieldValues?.showSymbolDetailsInBuySellModal}
							onChange={(value) => handleFieldValueChange('showSymbolDetailsInBuySellModal', value)}
						/>
					</>
				),
			},
		],
		[fieldValues],
	);

	return (
		<SettingCard title={t('settings_page.orders_settings')}>
			<div className='grid grid-cols-2 gap-x-88 gap-y-24'>
				{fields.map((item) => (
					<SettingCardField key={item.title} {...item} />
				))}

				{customerSettingsLoading && <Loading />}
			</div>
		</SettingCard>
	);
};

export default auth(Orders);
