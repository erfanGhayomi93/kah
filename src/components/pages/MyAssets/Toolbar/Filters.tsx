import Select from '@/components/common/Inputs/Select';
import Switch from '@/components/common/Inputs/Switch';
import Popup from '@/components/common/Popup';
import Separator from '@/components/common/Separator';
import Tooltip from '@/components/common/Tooltip';
import { ArrowDownSVG, XiaomiSettingSVG } from '@/components/icons';
import { watchlistPriceBasis } from '@/constants';
import { usePathname, useRouter } from '@/navigation';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';

const Filters = () => {
	const t = useTranslations('my_assets');

	const router = useRouter();

	const pathname = usePathname();

	const searchParams = useSearchParams();

	const onChangePriceBasis = (v: TPriceBasis) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set('pb', v);

		router.replace(`${pathname}?${params.toString()}`);
	};

	const onChangeSetting = (name: string, v: boolean) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set(name, v ? 'true' : 'false');

		router.replace(`${pathname}?${params.toString()}`);
	};

	// const isNotTable = comparePathname('my-assets/all', pathname);
	const priceBasis = (searchParams.get('pb') as TPriceBasis) ?? 'LastTradePrice';
	// const showInvolvedInStrategy = (searchParams.get('str') ?? 'true') === 'true';
	const showSoldSymbols = (searchParams.get('ss') ?? 'true') === 'true';
	const useCommissions = (searchParams.get('com') ?? 'true') === 'true';

	return (
		<div className='flex-1 gap-16 flex-justify-end'>
			<div style={{ maxWidth: '16rem' }} className='w-full'>
				<Select<TPriceBasis>
					defaultValue={priceBasis}
					options={watchlistPriceBasis}
					placeholder={t('price_basis')}
					onChange={onChangePriceBasis}
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
						<ul className='gap-16 overflow-hidden rounded bg-white p-16 shadow-sm flex-column *:cursor-default *:flex-justify-between darkness:bg-gray-50'>
							{/* <li>
								<span className='text-tiny font-medium'>{t('symbols_involved_in_strategy')}</span>
								<Switch checked={showInvolvedInStrategy} onChange={(v) => onChangeSetting('str', v)} />
							</li> */}
							<li>
								<span className='text-tiny font-medium'>{t('sold_symbols')}</span>
								<Switch checked={showSoldSymbols} onChange={(v) => onChangeSetting('ss', v)} />
							</li>
							<li>
								<span className='text-tiny font-medium'>{t('calculate_commission')}</span>
								<Switch checked={useCommissions} onChange={(v) => onChangeSetting('com', v)} />
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

				{/* <li>
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
				</li> */}
			</ul>
		</div>
	);
};

export default Filters;
