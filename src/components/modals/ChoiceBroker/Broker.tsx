import { useTranslations } from 'next-intl';

interface BrokerProps extends User.Broker {
	onSelect: () => void;
}

const Broker = ({ name, description, logo, ssoUrl, onSelect }: BrokerProps) => {
	const t = useTranslations();

	return (
		<div
			style={{ flex: '0 0 21.2rem' }}
			className='items-center gap-48 rounded-md bg-white px-16 py-24 text-center shadow-card flex-column'
		>
			<div className='items-center gap-4 flex-column'>
				<div style={{ maxWidth: '4rem', maxHeight: '4rem' }} className='h-40'>
					<img
						style={{ maxWidth: '100%', maxHeight: '100%' }}
						src={`data:image/jpeg;base64,${logo}`}
						alt={name}
					/>
				</div>

				<div className='gap-16 flex-column'>
					<h2 className='text-light-gray-700 text-base font-medium'>{name}</h2>
					<span className='text-light-gray-500 text-tiny'>{description}</span>
				</div>
			</div>

			<button
				disabled={!ssoUrl}
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
