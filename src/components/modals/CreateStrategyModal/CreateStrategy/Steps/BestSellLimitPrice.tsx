import ipcMain from '@/classes/IpcMain';
import { sepNumbers } from '@/utils/helpers';
import { useEffect, useState } from 'react';

interface BestSellLimitPriceProps {
	lsKey: IpcMainChannels['execute_strategy:symbol_data']['fieldName'];
	initialValue: number;
	symbolISIN: string;
}

const BestSellLimitPrice = ({ lsKey, symbolISIN, initialValue }: BestSellLimitPriceProps) => {
	const [value, setValue] = useState(initialValue);

	useEffect(() => {
		setTimeout(() => {
			ipcMain
				.sendAsync<
					IpcMainChannels['execute_strategy:symbol_data'] | null
				>('execute_strategy:get_symbol_data', [symbolISIN, lsKey])
				.then((data) => {
					if (data) setValue(data.value ?? 0);
				});
		}, 100);
	}, []);

	useEffect(() => {
		const abort = ipcMain.handle('execute_strategy:symbol_data', ({ itemName, fieldName, value }) => {
			if (itemName === symbolISIN && fieldName === lsKey) {
				setValue(value);
			}
		});

		return () => {
			abort();
		};
	}, [symbolISIN]);

	return sepNumbers(String(value));
};

export default BestSellLimitPrice;
