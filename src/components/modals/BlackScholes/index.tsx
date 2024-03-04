import { EraserSVG, XSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { toggleBlackScholesModal, type IBlackScholes } from '@/features/slices/modalSlice';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useLayoutEffect, useState } from 'react';
import styled from 'styled-components';
import Modal from '../Modal';
import Form from './Form';
import SelectSymbol from './SelectSymbol';

interface BlackScholesProps extends IBlackScholes {}

const Calculator = dynamic(() => import('./Calculator'), {
	ssr: false,
});

const initialValues: IBlackScholesModalStates = {
	baseSymbol: null,
	contractEndDate: null,
	contract: null,
	premium: 0,
	strikePrice: 0,
	dueDays: 0,
	volatility: '',
	riskFreeProfit: '',
	sharePrice: 0,
};

const Div = styled.div`
	width: 820px;
	height: 660px;
`;

const BlackScholes = ({ symbolISIN, ...props }: BlackScholesProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const [inputs, setInputs] = useState(initialValues);

	const setInputValue = <T extends keyof IBlackScholesModalStates>(field: T, value: IBlackScholesModalStates[T]) => {
		setInputs((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const onCloseModal = () => {
		dispatch(toggleBlackScholesModal(null));
	};

	const onReset = () => {
		setInputs(initialValues);
	};

	useLayoutEffect(() => {
		setInputs((prev) => ({
			...prev,
			contractEndDate: null,
			contract: null,
		}));
	}, [JSON.stringify(inputs.baseSymbol)]);

	useLayoutEffect(() => {
		setInputs((prev) => ({
			...prev,
			contract: null,
		}));
	}, [JSON.stringify(inputs.contractEndDate)]);

	useLayoutEffect(() => {
		if (!inputs.contract || !inputs.contractEndDate) return;

		const { symbolInfo, optionWatchlistData } = inputs.contract;

		const now = Date.now();
		const contractEndDate = new Date(inputs.contractEndDate.contractEndDate).getTime();

		setInputs((prev) => ({
			...prev,
			sharePrice: optionWatchlistData.baseSymbolPrice ?? 0,
			strikePrice: symbolInfo.strikePrice ?? 0,
			dueDays: Math.floor(Math.abs(now - contractEndDate) / 1e3 / 24 / 60 / 60),
			volatility: String(optionWatchlistData.historicalVolatility ?? 0),
			riskFreeProfit: '30',
			premium: optionWatchlistData.premium ?? 0,
		}));
	}, [JSON.stringify(inputs.contract)]);

	return (
		<Modal
			style={{ modal: { transform: 'translate(-50%, -50%)', borderRadius: '1.6rem' } }}
			top='50%'
			onClose={onCloseModal}
			{...props}
		>
			<Div className='bg-white flex-column'>
				<div className='relative h-56 bg-gray-200 flex-justify-center'>
					<h1 className='text-xl font-medium text-gray-900'>{t('black_scholes_modal.title')}</h1>

					<div className='absolute left-24 gap-16 flex-items-center'>
						<button onClick={onReset} type='button' className='icon-hover'>
							<EraserSVG width='2rem' height='2rem' />
						</button>

						<button onClick={onCloseModal} type='button' className='icon-hover'>
							<XSVG width='2rem' height='2rem' />
						</button>
					</div>
				</div>

				<div className='flex-1 gap-24 px-24 flex-column'>
					<SelectSymbol setInputValue={setInputValue} inputs={inputs} />

					<div className='flex flex-1 gap-16 pb-24'>
						<Form setInputValue={setInputValue} inputs={inputs} />

						<div className='h-full flex-1 justify-between gap-24 rounded-md bg-gray-100 px-24 pb-16 pt-24 flex-column'>
							<Calculator {...inputs} />
						</div>
					</div>
				</div>
			</Div>
		</Modal>
	);
};

export default BlackScholes;
