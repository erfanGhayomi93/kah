import { useTranslations } from 'next-intl';

interface BrokerProps extends User.Broker {
	onSelect: () => void;
}

const Broker = ({ name, description, logo, ssoUrl, onSelect }: BrokerProps) => {
	const t = useTranslations();

	return (
		<div
			style={{ flex: '0 0 21.2rem' }}
			className='items-center gap-48 rounded-md bg-white px-16 py-24 text-center shadow-sm flex-column darkBlue:bg-gray-50 dark:bg-gray-50'
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
					<h2 className='text-base font-medium text-gray-700'>{name}</h2>
					<span className='text-tiny text-gray-500'>{description}</span>
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
