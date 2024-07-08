import Switch from '@/components/common/Inputs/Switch';
import { ClockOutlineSVG } from '@/components/icons';
import { useServerDatetime } from '@/hooks';
import dayjs from '@/libs/dayjs';
import { useTranslations } from 'next-intl';

interface FooterProps {
	isHolding: boolean;
	onHold: (checked: boolean) => void;
}

const Footer = ({ isHolding, onHold }: FooterProps) => {
	const t = useTranslations();

	const { timestamp } = useServerDatetime();

	return (
		<div className='h-40 border-t border-t-light-gray-200 bg-white px-16 flex-justify-between'>
			<div className='flex-1 gap-8 flex-justify-start'>
				<Switch checked={isHolding} onChange={onHold} />
				<span className='text-tiny text-light-gray-700'>{t('bs_modal.hold_form')}</span>
			</div>

			<div className='gap-4 text-light-gray-700 flex-justify-end'>
				<span className='text-base'>{dayjs(timestamp).calendar('jalali').format('HH:mm:ss')}</span>
				<ClockOutlineSVG width='2.4rem' height='2.4rem' />
			</div>
		</div>
	);
};

export default Footer;
