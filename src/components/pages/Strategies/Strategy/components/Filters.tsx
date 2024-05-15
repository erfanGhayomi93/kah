import Select from '@/components/common/Inputs/Select';
import Switch from '@/components/common/Inputs/Switch';
import TableActions from '@/components/common/Toolbar/TableActions';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { type ISelectItem } from '..';

interface FiltersProps {
	useCommission: boolean;
	priceBasis: ISelectItem;
	title: string;
	type: Strategy.Type;
	onManageColumns?: () => void;
	onShowFilters?: () => void;
	onExportExcel?: () => void;
	onPriceBasisChanged?: (v: ISelectItem) => void;
	onCommissionChanged?: (v: boolean) => void;
}

const Filters = ({
	title,
	type,
	useCommission,
	priceBasis,
	onManageColumns,
	onShowFilters,
	onExportExcel,
	onPriceBasisChanged,
	onCommissionChanged,
}: FiltersProps) => {
	const t = useTranslations();

	const options: ISelectItem[] = useMemo(
		() => [
			{ id: 'LastTradePrice', title: t('strategy.last_traded_price') },
			{ id: 'ClosingPrice', title: t('strategy.closing_price') },
			{ id: 'BestLimit', title: t('strategy.headline') },
		],
		[],
	);

	return (
		<div style={{ flex: '0 0 4rem' }} className='flex-justify-between'>
			<div className='flex-1 flex-justify-start'>
				<div className='flex gap-4 font-medium text-gray-900'>
					<h1 className='text-base'>{t(`${type}.title`)}</h1>
					<h2 className='text-base text-gray-700'>({title})</h2>
				</div>
			</div>

			<div className='flex-1 gap-24 flex-justify-end'>
				<div className='h-40 gap-8 flex-items-center'>
					<span className='text-tiny font-medium text-gray-900'>{t('strategy.with_commission')}</span>
					<Switch checked={useCommission} onChange={(v) => onCommissionChanged?.(v)} />
				</div>

				<div style={{ flex: '0 0 28.4rem' }} className='flex-1 gap-8 flex-justify-end'>
					<Select<ISelectItem>
						defaultValue={priceBasis}
						options={options}
						placeholder={t('strategy.price_basis')}
						onChange={(v) => onPriceBasisChanged?.(v)}
						getOptionId={(option) => option.id}
						getOptionTitle={(option) => option.title}
						classes={{
							root: '!h-40',
						}}
					/>

					<TableActions
						onExportExcel={onExportExcel}
						onShowFilters={onShowFilters}
						onManageColumns={onManageColumns}
					/>
				</div>
			</div>
		</div>
	);
};

export default Filters;
