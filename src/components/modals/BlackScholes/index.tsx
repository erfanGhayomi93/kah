import { XSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { toggleBlackScholesModal, type IBlackScholes } from '@/features/slices/modalSlice';
import { useTranslations } from 'next-intl';
import { useLayoutEffect, useState } from 'react';
import styled from 'styled-components';
import Modal from '../Modal';
import Calculator from './Calculator';
import Form from './Form';
import SelectSymbol from './SelectSymbol';

interface BlackScholesProps extends IBlackScholes {}

const Div = styled.div`
	width: 820px;
	height: 660px;
`;

const BlackScholes = ({ symbolISIN, ...props }: BlackScholesProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const [inputs, setInputs] = useState<IBlackScholesModalStates>({
		baseSymbol: null,
		contract: null,
		selectedStrikePrice: null,
		premium: '',
		strikePrice: '',
		dueDays: '',
		volatility: '',
		riskFreeProfit: '',
		contractPrice: '',
	});

	const setInputValue = <T extends keyof IBlackScholesModalStates>(field: T, value: IBlackScholesModalStates[T]) => {
		setInputs((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const onCloseModal = () => {
		dispatch(toggleBlackScholesModal(null));
	};

	useLayoutEffect(() => {
		setInputs((prev) => ({
			...prev,
			contract: null,
			selectedStrikePrice: null,
		}));
	}, [JSON.stringify(inputs.baseSymbol)]);

	useLayoutEffect(() => {
		setInputs((prev) => ({
			...prev,
			selectedStrikePrice: null,
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

					<button onClick={onCloseModal} type='button' className='absolute left-24 icon-hover'>
						<XSVG width='2rem' height='2rem' />
					</button>
				</div>

				<div className='flex-1 gap-24 px-24 flex-column'>
					<SelectSymbol setInputValue={setInputValue} inputs={inputs} />

					<div className='flex flex-1 gap-16 pb-24'>
						<Form setInputValue={setInputValue} inputs={inputs} />
						<Calculator {...inputs} />
					</div>
				</div>
			</Div>
		</Modal>
	);
};

export default BlackScholes;
