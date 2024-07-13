import ExportExcelBtn from '@/components/common/Buttons/ExportExcelBtn';
import OptionWatchlistManagerBtn from '@/components/common/Buttons/OptionWatchlistManagerBtn';
import Select from '@/components/common/Inputs/Select';
import Switch from '@/components/common/Inputs/Switch';
import Popup from '@/components/common/Popup';
import Separator from '@/components/common/Separator';
import Tooltip from '@/components/common/Tooltip';
import { ArrowDownSVG, DownloadDdnSVG, UploadDdnSVG, XiaomiSettingSVG } from '@/components/icons';
import { watchlistPriceBasis } from '@/constants';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getMyAssetsFilters, setMyAssetsFilters } from '@/features/slices/uiSlice';
import { usePathname } from '@/navigation';
import { comparePathname } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

const Filters = () => {
	const t = useTranslations('my_assets');

	const pathname = usePathname();

	const dispatch = useAppDispatch();

	const filters = useAppSelector(getMyAssetsFilters);

	const setFieldValue = <T extends keyof IMyAssetsFilters>(name: T, value: IMyAssetsFilters[T]) => {
		dispatch(
			setMyAssetsFilters({
				...filters,
				[name]: value,
			}),
		);
	};

	const uploadDDN = () => {
		//
	};

	const downloadDDN = () => {
		//
	};

	const exportExcel = () => {
		//
	};

	const manageColumns = () => {
		//
	};

	const isNotTable = comparePathname('my-assets/all', pathname);

	return (
		<div className='flex-1 gap-16 flex-justify-end'>
			<div style={{ maxWidth: '16rem' }} className='w-full'>
				<Select<TPriceBasis>
					defaultValue={filters.priceBasis}
					options={watchlistPriceBasis}
					placeholder={t('price_basis')}
					onChange={(v) => setFieldValue('priceBasis', v)}
					getOptionId={(id) => id}
					getOptionTitle={(id) => t(`price_${id}`)}
					classes={{
						root: '!h-40',
					}}
				/>
			</div>

			<Separator />

			<ul className='flex h-40 gap-8'>
				<Popup
					defaultPopupWidth={232}
					renderer={() => (
						<ul className='gap-16 overflow-hidden rounded bg-white p-16 shadow-tooltip flex-column *:cursor-default *:flex-justify-between'>
							<li>
								<span className='text-tiny font-medium'>{t('symbols_involved_in_strategy')}</span>
								<Switch
									checked={filters.involvedInStrategy}
									onChange={(v) => setFieldValue('involvedInStrategy', v)}
								/>
							</li>
							<li>
								<span className='text-tiny font-medium'>{t('sold_symbols')}</span>
								<Switch
									checked={filters.soldSymbols}
									onChange={(v) => setFieldValue('soldSymbols', v)}
								/>
							</li>
							<li>
								<span className='text-tiny font-medium'>{t('calculate_commission')}</span>
								<Switch
									checked={filters.calculateCommission}
									onChange={(v) => setFieldValue('calculateCommission', v)}
								/>
							</li>
						</ul>
					)}
				>
					{({ setOpen, open }) => (
						<li>
							<Tooltip placement='bottom' content={t('table_setting_tooltip')}>
								<button
									type='button'
									onClick={() => setOpen(!open)}
									className={clsx(
										'h-40 gap-4 rounded !border px-8',
										open ? 'btn-primary' : 'btn-icon',
									)}
								>
									<ArrowDownSVG
										width='1.4rem'
										height='1.4rem'
										className='transition-transform'
										style={{ transform: `rotate(${open ? 180 : 0}deg)` }}
									/>
									<XiaomiSettingSVG />
								</button>
							</Tooltip>
						</li>
					)}
				</Popup>

				<li>
					<Tooltip placement='bottom' content={t('upload_ddn_tooltip')}>
						<button onClick={uploadDDN} type='button' className='size-40 rounded btn-icon'>
							<UploadDdnSVG />
						</button>
					</Tooltip>
				</li>
				<li>
					<Tooltip placement='bottom' content={t('download_ddn_tooltip')}>
						<button onClick={downloadDDN} type='button' className='size-40 rounded btn-icon'>
							<DownloadDdnSVG />
						</button>
					</Tooltip>
				</li>
				<li>
					<Tooltip placement='bottom' content={t('export_excel_tooltip')}>
						<div>
							<ExportExcelBtn disabled={isNotTable} onClick={exportExcel} />
						</div>
					</Tooltip>
				</li>
				<li>
					<Tooltip placement='bottom' content={t('manage_columns_tooltip')}>
						<div>
							<OptionWatchlistManagerBtn disabled={isNotTable} onClick={manageColumns} />
						</div>
					</Tooltip>
				</li>
			</ul>
		</div>
	);
};

export default Filters;
