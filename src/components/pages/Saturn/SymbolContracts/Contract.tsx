import { useAppDispatch } from '@/features/hooks';
import { toggleContractSelectorModal } from '@/features/slices/modalSlice';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface ContractProps {
	baseSymbol: Symbol.Info;
	symbol: Symbol.Info | null;
	onChange: (symbol: Symbol.Info | null) => void;
}

const Wrapper = ({ children }: { children?: React.ReactNode }) => (
	<div style={{ flex: 'calc(50% - 1.2rem)', height: '40rem' }} className='relative rounded bg-white'>
		{children}
	</div>
);

const Contract = ({ baseSymbol, symbol, onChange }: ContractProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const addSymbol = () => {
		dispatch(
			toggleContractSelectorModal({
				symbolTitle: baseSymbol.symbolTitle,
				symbolISIN: baseSymbol.symbolISIN,
			}),
		);
	};

	if (!symbol)
		return (
			<Wrapper>
				<div onClick={addSymbol} className='absolute items-center gap-24 text-center flex-column center'>
					<Image width='48' height='48' alt='add-symbol' src='/static/images/add-button.png' />
					<span className='text-base text-gray-100'>
						{t.rich('saturn.click_to_add_contract', {
							add: (chunks) => (
								<button type='button' className='text-primary-100'>
									{chunks}
								</button>
							),
							symbolTitle: baseSymbol.symbolTitle ?? '',
						})}
					</span>
				</div>
			</Wrapper>
		);

	return <Wrapper />;
};

export default Contract;
