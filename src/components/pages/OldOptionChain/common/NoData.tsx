import Image from 'next/image';

interface NoDataProps {
	text: string;
}

const NoData = ({ text }: NoDataProps) => {
	return (
		<div className='h-full items-center justify-center gap-16 text-center flex-column'>
			<Image width='80' height='80' alt='welcome' src='/static/images/no-data.png' />
			<span className='text-gray-900 text-base font-medium'>{text}</span>
		</div>
	);
};

export default NoData;
