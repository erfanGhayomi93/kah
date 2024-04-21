import Loading from '@/components/common/Loading';
import { useAppDispatch } from '@/features/hooks';
import { setSelectSymbolContractsModal } from '@/features/slices/modalSlice';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';

const Contract = dynamic(() => import('./Contract'), {
	ssr: false,
	loading: () => <Loading />,
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
	const t = useTranslations();

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

	const onContractsAdded = (contracts: Option.Root[]) => {
		try {
			let i = 0;
			const newContracts = baseSymbolContracts.map<Saturn.ContentOption | null>((item) => {
				if (item !== null) return item;

				const contract = contracts[i];
				i++;

				return contract
					? {
							activeTab: 'price_information',
							symbolISIN: contract.symbolInfo.symbolISIN,
							symbolTitle: contract.symbolInfo.symbolTitle,
						}
					: null;
			});

			setBaseSymbolContracts(newContracts);
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
		dispatch(
			setSelectSymbolContractsModal({
				symbolTitle: baseSymbol.symbolTitle,
				symbolISIN: baseSymbol.symbolISIN,
				initialSelectedContracts: baseSymbolContracts
					.filter((item) => item !== null)
					.map<string>((item) => item.symbolISIN),
				canChangeBaseSymbol: false,
				maxContracts: 4,
				callback: onContractsAdded,
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
