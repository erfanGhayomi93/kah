import { useTranslations } from 'next-intl';

interface ErrorProps {
	action?: () => void;
	text?: React.ReactNode;
}

const Error = ({ text, action }: ErrorProps) => {
	const t = useTranslations('common');

	return (
		<div className='gap-8 text-base flex-column'>
			<span className='text-gray-700'>{text ?? t('an_error_occurred')}</span>

			{Boolean(action) && (
				<button onClick={action} type='button' className='text-info-100'>
					{t('try_again')}
				</button>
			)}
		</div>
	);
};

export default Error;
