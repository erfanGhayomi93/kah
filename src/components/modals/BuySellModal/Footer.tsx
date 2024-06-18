import Switch from '@/components/common/Inputs/Switch';
import { useTranslations } from 'next-intl';

interface FooterProps {
	validityDays: number | null;
	hold: boolean;
	onHold: (checked: boolean) => void;
}

const Footer = ({ validityDays, hold, onHold }: FooterProps) => {
	const t = useTranslations();

	return (
		<div className='h-40 border-t border-t-light-gray-200 bg-white px-16 flex-justify-between'>
			<div className='flex-1 gap-8 flex-justify-start'>
				<Switch checked={hold} onChange={onHold} />
				<span className='text-tiny text-light-gray-700'>{t('bs_modal.hold_form')}</span>
			</div>

			{validityDays !== null && (
				<div className='flex-1 gap-4 text-tiny text-light-gray-700 flex-justify-end'>
					<span>{t('bs_modal.validity_date')}:</span>
					<span>
						<span className='text-lg font-medium'>{validityDays} </span>
						{t('bs_modal.day')}
					</span>
				</div>
			)}
		</div>
	);
};

export default Footer;
