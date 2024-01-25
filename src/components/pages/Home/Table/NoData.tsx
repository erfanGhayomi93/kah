import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface NoDataProps {
	onAddSymbol: () => void;
}

const NoData = ({ onAddSymbol }: NoDataProps) => {
	const t = useTranslations();
	return (
		<div
			className='absolute flex-col gap-24 flex-justify-center'
			style={{
				top: 'calc(50% + 4.8rem)',
				left: '50%',
				transform: 'translate(-50%, -50%)',
			}}
		>
			<Image width='120' height='120' alt='welcome' src='/static/images/no-data.png' />
			<span className='text-base font-medium text-gray-300'>
				{t.rich('option_page.no_data_table', {
					symbol: (chunk) => (
						<button type='button' className='text-link underline' onClick={onAddSymbol}>
							{chunk}
						</button>
					),
				})}
			</span>
		</div>
	);
};

export default NoData;
