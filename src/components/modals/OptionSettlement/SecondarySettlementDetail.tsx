import { dateFormatter } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useMemo, type FC } from 'react';

interface IDataType {
	label: string;
	value: string;
	formatterValue?: (value: string) => string,
	classes?: string
}

interface SecondarySettlementDetailProps {
	dataSecondaryDetails?: Reports.TCashOrPhysicalSettlement,
	clickItemSettlement: () => void
}

export const SecondarySettlementDetail: FC<SecondarySettlementDetailProps> = ({ dataSecondaryDetails, clickItemSettlement }) => {

	const t = useTranslations();

	const isDisbled = !dataSecondaryDetails?.enabled || dataSecondaryDetails?.status !== 'Draft' || !dataSecondaryDetails?.openPositionCount;

	const data: IDataType[] = useMemo(() => [
		{
			label: t('orders_reports_page.symbol_column'),
			value: dataSecondaryDetails?.symbolTitle || '-',
			classes: 'font-bold'
		},
		{
			label: t('orders_reports_page.date_column'),
			value: dataSecondaryDetails?.cashSettlementDate || '-',
			formatterValue: (value) => '\u200E' + dateFormatter(value, 'date'),
			classes: 'font-bold'
		},
		{
			label: t('orders_reports_page.side_column'),
			value: dataSecondaryDetails?.side || '-',
			formatterValue: (value) => dataSecondaryDetails?.side ? t('side.' + value.toLowerCase()) : '-',
			classes: dataSecondaryDetails?.side === 'Buy' ? 'text-success-100' : dataSecondaryDetails?.side === 'Sell' ? 'text-error-100' : ''
		},
		{
			label: t('optionSettlementModal.status_contract'),
			value: (dataSecondaryDetails?.openPositionCount || 0) + ' موقعیت',
		},
		{
			label: t('optionSettlementModal.status_contract'),
			value: dataSecondaryDetails?.pandLStatus ? t('cash_settlement_reports_page.type_contract_status_' + dataSecondaryDetails?.pandLStatus) : '-',
			classes: dataSecondaryDetails?.pandLStatus === 'Profit' ? 'text-success-100' : dataSecondaryDetails?.pandLStatus === 'Loss' ? 'text-error-100' : ''
		},
	], [dataSecondaryDetails]);



	return (
		<div className='flex flex-col justify-between h-full'>
			<div className="shadow-sm rounded px-8 py-16 flex flex-col gap-y-16">
				{
					data.map((item, ind) => (
						<div key={ind} className="flex justify-between">
							<span className="text-gray-900">{item.label}</span>
							<span className={clsx({
								[item.classes ? item.classes : '']: !!item.classes
							})}>
								{item.formatterValue ? item.formatterValue(item.value) : item.value}
							</span>
						</div>
					))
				}
			</div>

			<div className='mt-24'>
				<button
					className='text- h-48 w-full gap-8 rounded font-medium flex-justify-center btn-primary'
					type='submit'
					onClick={clickItemSettlement}
					disabled={isDisbled}
				>
					{t('deposit_modal.state_Request')}
				</button>
			</div>

		</div>
	);
};
