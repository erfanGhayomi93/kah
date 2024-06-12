import { useAppDispatch } from '@/features/hooks';
import { setSelectSymbolContractsModal } from '@/features/slices/modalSlice';
import dynamic from 'next/dynamic';
import ContractSkeletonLoading from './ContractSkeletonLoading';

const Contract = dynamic(() => import('./Contract'), {
	ssr: false,
	loading: () => <ContractSkeletonLoading />,
});

interface SymbolContractsProps {
	baseSymbol: Symbol.Info;
	baseSymbolContracts: TSaturnBaseSymbolContracts;
	setBaseSymbol: (value: string) => void;
	setBaseSymbolContracts: (value: TSaturnBaseSymbolContracts) => void;
}

const SymbolContracts = ({
	baseSymbol,
	baseSymbolContracts,
	setBaseSymbol,
	setBaseSymbolContracts,
}: SymbolContractsProps) => {
	const dispatch = useAppDispatch();

	const onLoadContract = (contract: Symbol.Info) => {
		try {
			if (!contract.baseSymbolISIN) return;

			const { baseSymbolISIN, symbolISIN, symbolTitle, isOption } = contract;

			if (baseSymbolISIN === baseSymbol.symbolISIN || (baseSymbolISIN === null && isOption)) return;

			setBaseSymbol(baseSymbolISIN);
			setBaseSymbolContracts([
				{
					activeTab: 'price_information',
					symbolISIN,
					symbolTitle,
				},
				null,
				null,
				null,
			]);
		} catch (e) {
			//
		}
	};

	const onChangeContractTab = (tab: Saturn.OptionTab, index: number) => {
		try {
			const options = JSON.parse(JSON.stringify(baseSymbolContracts)) as typeof baseSymbolContracts;

			if (!options[index]) return;
			options[index]!.activeTab = tab;

			setBaseSymbolContracts(options);
		} catch (e) {
			//
		}
	};

	const handleContracts = (contracts: Option.Root[]) => {
		try {
			const modifiedContracts: Array<Saturn.ContentOption | null> = contracts.map<Saturn.ContentOption>((c) => ({
				activeTab: 'price_information',
				symbolISIN: c.symbolInfo.symbolISIN,
				symbolTitle: c.symbolInfo.symbolTitle,
			}));

			for (let i = modifiedContracts.length + 1; i <= 4; i++) {
				modifiedContracts.push(null);
			}

			setBaseSymbolContracts(modifiedContracts);
		} catch (e) {
			//
		}
	};

	const onClose = (i: number) => {
		const options = JSON.parse(JSON.stringify(baseSymbolContracts)) as typeof baseSymbolContracts;

		options[i] = null;

		setBaseSymbolContracts(options);
	};

	const addNewContract = () => {
		const initialSelectedContracts = baseSymbolContracts
			.filter((item) => item !== null)
			.map((symbol) => symbol!.symbolISIN);

		dispatch(
			setSelectSymbolContractsModal({
				initialBaseSymbolISIN: baseSymbol.symbolISIN,
				initialSelectedContracts,
				suppressBaseSymbolChange: true,
				suppressSendBaseSymbol: true,
				maxContractsLength: 4,
				callback: handleContracts,
			}),
		);
	};

	if (baseSymbolContracts.length === 0) return null;

	return baseSymbolContracts.map((option, index) => (
		<Contract
			key={index}
			option={option}
			baseSymbol={baseSymbol}
			close={() => onClose(index)}
			addNewContract={addNewContract}
			onLoadContract={(contract) => onLoadContract(contract)}
			onChangeContractTab={(tab) => onChangeContractTab(tab, index)}
		/>
	));
};

export default SymbolContracts;
