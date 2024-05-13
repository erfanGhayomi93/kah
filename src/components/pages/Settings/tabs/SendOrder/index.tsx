'use client';
import brokerAxios from '@/api/brokerAxios';
import { useGetCustomerSettings } from '@/api/queries/brokerPrivateQueries';
import Input from '@/components/common/Inputs/Input';
import Switch from '@/components/common/Inputs/Switch';
import { useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { convertStringToInteger, sepNumbers } from '@/utils/helpers';
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

const SendOrder = () => {
	const t = useTranslations();

	const defaultFieldValues = useRef<Settings.IFormatedBrokerCustomerSettings>();

	const [fieldValues, setFieldValues] = useState<Settings.IFormatedBrokerCustomerSettings>();

	const brokerURLs = useAppSelector(getBrokerURLs);

	const { data: customerSettings, refetch: fetchCustomerSettings } = useGetCustomerSettings({
		queryKey: ['GetCustomerSettings'],
		enabled: false,
	});

	const { mutate: updateCustomerSettings } = useMutation({
		mutationFn: async (settingsData: IUpdateSettingsBody[]) => {
			if (!brokerURLs) return;
			const { data } = await brokerAxios.post(brokerURLs.SetCustomerSettings, settingsData);
			return data;
		},
		onSuccess: () => {
			defaultFieldValues.current = fieldValues;
		},
		onError: () => {
			toast.warning(t('i_errors.undefined_error'));
			setFieldValues(defaultFieldValues.current);
		},
	});

	const handleFieldValueChange = (fieldName: TFieldName, newValue: string | boolean) => {
		const customerSettingsBody: IUpdateSettingsBody[] = [];
		for (const key in fieldValues) {
			const keyValue = key as IUpdateSettingsBody['configKey'];
			customerSettingsBody.push({
				configKey: keyValue,
				configValue: fieldName === keyValue ? String(newValue) : String(fieldValues[keyValue]),
			});
		}
		updateCustomerSettings(customerSettingsBody);
		setFieldValues((prev) => ({ ...prev, [fieldName]: newValue }) as Settings.IFormatedBrokerCustomerSettings);
	};

	useEffect(() => {
		brokerURLs && fetchCustomerSettings();
	}, [brokerURLs]);

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
				component: (
					<Input
						classInput='text-right'
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
				component: (
					<Input
						classInput='text-right'
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
				component: (
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
				component: (
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
				component: (
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
				component: (
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
				component: (
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
		<SettingCard title={t('settings_page.send_order_settings')}>
			<div className='grid grid-cols-2 gap-x-32 gap-y-24'>
				{fields.map((item) => (
					<SettingCardField key={item.title} colon={false} title={item.title} node={item.component} />
				))}
			</div>
		</SettingCard>
	);
};

export default SendOrder;
