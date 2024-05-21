import Tooltip from '@/components/common/Tooltip';
import { InfoCircleSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { setCoveredCallFiltersModal } from '@/features/slices/modalSlice';
import { useInputs } from '@/hooks';
import { toggleArrayElement } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import React from 'react';
import BepDifference from '../Components/BepDifference';
import DueDaysInput from '../Components/DueDaysInput';
import IOTMInput from '../Components/IOTMInput';
import MaxProfitInput from '../Components/MaxProfitInput';
import NonExpiredProfitInput from '../Components/NonExpiredProfitInput';
import OpenPositionsInput from '../Components/OpenPositionsInput';
import SideInput from '../Components/SideInput';

interface FilterProps {
	title: string;
	tooltip?: string;
	children?: React.ReactNode;
}

interface SimpleFilterProps {
	initialFilters: Partial<ICoveredCallFiltersModalStates>;
	onSubmit: (appliedFilters: Partial<ICoveredCallFiltersModalStates>) => void;
}

const SimpleFilter = ({ initialFilters, onSubmit }: SimpleFilterProps) => {
	const t = useTranslations('strategy_filters');

	const dispatch = useAppDispatch();

	const { inputs, setFieldValue } = useInputs<ICoveredCallFiltersModalStates>({
		side: initialFilters?.side ?? [],
		iotm: initialFilters?.iotm ?? [],
		dueDays: initialFilters?.dueDays ?? [null, null],
		openPositions: initialFilters?.openPositions ?? [null, null],
		maxProfit: initialFilters?.maxProfit ?? null,
		nonExpiredProfit: initialFilters?.nonExpiredProfit ?? null,
		bepDifference: initialFilters?.bepDifference ?? null,
	});

	const submit = (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const { side, iotm, dueDays, openPositions, maxProfit, nonExpiredProfit, bepDifference } = inputs;
			const appliedFilters: Partial<ICoveredCallFiltersModalStates> = {};

			if (side.length > 0) appliedFilters.side = [...side];
			if (iotm.length > 0) appliedFilters.iotm = [...iotm];
			if (dueDays[0] || dueDays[1]) appliedFilters.dueDays = [...dueDays];
			if (openPositions[0] || openPositions[1]) appliedFilters.openPositions = openPositions;
			if (maxProfit) appliedFilters.nonExpiredProfit = maxProfit;
			if (nonExpiredProfit) appliedFilters.nonExpiredProfit = nonExpiredProfit;
			if (bepDifference) appliedFilters.bepDifference = bepDifference;

			onSubmit(appliedFilters);
		} catch (e) {
			//
		} finally {
			dispatch(setCoveredCallFiltersModal(null));
		}
	};

	const onSideChange = (v: TBsSides) => {
		setFieldValue('side', toggleArrayElement(inputs.side, v));
	};

	const onIOTMChange = (v: Option.IOTM) => {
		setFieldValue('iotm', toggleArrayElement(inputs.iotm, v));
	};

	return (
		<form onSubmit={submit} method='get' className='gap-32 pt-32 flex-column'>
			<ul className='gap-32 flex-column'>
				<Filter title={t('side')}>
					<SideInput value={inputs.side} onClick={onSideChange} />
				</Filter>

				<Filter title={t('iotm')}>
					<IOTMInput value={inputs.iotm} onClick={onIOTMChange} />
				</Filter>

				<Filter title={t('due_days')}>
					<DueDaysInput value={inputs.dueDays} onChange={(v) => setFieldValue('dueDays', v)} />
				</Filter>

				<Filter title={t('open_positions')}>
					<OpenPositionsInput
						value={inputs.openPositions}
						onChange={(v) => setFieldValue('openPositions', v)}
					/>
				</Filter>

				<Filter title={t('max_profit')} tooltip={t('max_profit_tooltip')}>
					<MaxProfitInput value={inputs.maxProfit} onChange={(v) => setFieldValue('maxProfit', v)} />
				</Filter>

				<Filter title={t('non_expired_profit')} tooltip={t('non_expired_profit_tooltip')}>
					<NonExpiredProfitInput
						value={inputs.nonExpiredProfit}
						onChange={(v) => setFieldValue('nonExpiredProfit', v)}
					/>
				</Filter>

				<Filter title={t('bep_difference')}>
					<BepDifference value={inputs.bepDifference} onChange={(v) => setFieldValue('bepDifference', v)} />
				</Filter>
			</ul>

			<div className='flex-justify-end'>
				<button type='submit' className='w-1/2 rounded py-8 btn-primary'>
					{t('apply_filters')}
				</button>
			</div>
		</form>
	);
};

const Filter = ({ title, tooltip, children }: FilterProps) => (
	<li className='h-40 flex-justify-between'>
		<div className='gap-8 flex-justify-start'>
			<h3 className='text-gray-900'>{title}:</h3>
			{tooltip && (
				<Tooltip placement='top' content={tooltip}>
					<span className='cursor-pointer'>
						<InfoCircleSVG width='1.8rem' height='1.8rem' className='text-info' />
					</span>
				</Tooltip>
			)}
		</div>

		<div style={{ flex: '0 0 32.8rem' }}>{children}</div>
	</li>
);

export default SimpleFilter;
