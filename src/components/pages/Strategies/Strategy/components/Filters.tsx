import Select from '@/components/common/Inputs/Select';
import Switch from '@/components/common/Inputs/Switch';
import TableActions from '@/components/common/Toolbar/TableActions';
import { watchlistPriceBasis, watchlistSymbolBasis } from '@/constants';
import { useTranslations } from 'next-intl';

interface FiltersProps {
	useCommission: boolean;
	priceBasis: TPriceBasis;
	symbolBasis: TStrategySymbolBasis;
	filtersCount?: number;
	title: string;
	type: Strategy.Type;
	onManageColumns?: () => void;
	onShowFilters?: () => void;
	onExportExcel?: () => void;
	setFieldValue?: <T extends keyof IStrategyFilter>(fieldName: T, value: IStrategyFilter[T]) => void;
	onCommissionChanged?: (v: boolean) => void;
}

const Filters = ({
	title,
	type,
	filtersCount,
	useCommission,
	priceBasis,
	symbolBasis,
	onManageColumns,
	onShowFilters,
	onExportExcel,
	setFieldValue,
	onCommissionChanged,
}: FiltersProps) => {
	const t = useTranslations();

	return (
		<div style={{ flex: '0 0 4rem' }} className='flex-justify-between'>
			<div className='flex-1 flex-justify-start'>
				<div className='flex gap-4 font-medium text-light-gray-700'>
					<h1 className='text-base'>{t(`${type}.title`)}</h1>
					<h2 className='text-base text-light-gray-500'>({title})</h2>
				</div>
			</div>

			<div className='flex-1 gap-24 flex-justify-end'>
				<div className='h-40 gap-8 flex-items-center'>
					<span className='text-tiny font-medium text-light-gray-700'>{t('strategy.with_commission')}</span>
					<Switch checked={useCommission} onChange={(v) => onCommissionChanged?.(v)} />
				</div>

				<div style={{ flex: '0 0 52.8rem' }} className='flex-1 gap-8 flex-justify-end'>
					<Select<TStrategySymbolBasis>
						defaultValue={symbolBasis}
						options={watchlistSymbolBasis}
						placeholder={t('strategy.symbol_basis')}
						onChange={(v) => setFieldValue?.('symbolBasis', v)}
						getOptionId={(id) => id}
						getOptionTitle={(id) => t(`strategy.symbol_${id}`)}
						classes={{
							root: '!h-40',
						}}
					/>

					<Select<TPriceBasis>
						defaultValue={priceBasis}
						options={watchlistPriceBasis}
						placeholder={t('strategy.price_basis')}
						onChange={(v) => setFieldValue?.('priceBasis', v)}
						getOptionId={(id) => id}
						getOptionTitle={(id) => t(`strategy.price_${id}`)}
						classes={{
							root: '!h-40',
						}}
					/>

					<TableActions
						filtersCount={filtersCount}
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
