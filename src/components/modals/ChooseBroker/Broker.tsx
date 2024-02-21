import { useTranslations } from 'next-intl';

interface BrokerProps extends User.Broker {
	onSelect: () => void;
}

const Broker = ({ brokerName, url, onSelect }: BrokerProps) => {
	const t = useTranslations();

	return (
		<div
			style={{ flex: '0 0 20rem' }}
			className='shadow-card items-center gap-48 rounded-md bg-white px-16 py-24 text-center flex-column'
		>
			<h2 className='text-base font-medium text-gray-900'>{brokerName}</h2>

			<button
				disabled={!url}
				onClick={onSelect}
				type='button'
				className='h-48 w-full rounded text-base btn-primary'
			>
				{t('choose_broker_modal.login')}
			</button>
		</div>
	);
};

export default Broker;
