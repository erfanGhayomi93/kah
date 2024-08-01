import { numFormatter } from '@/utils/helpers';
import { useTranslations } from 'next-intl';

interface InflowAndOutflowProps {
	value: number;
}

const InflowAndOutflow = ({ value }: InflowAndOutflowProps) => {
	const t = useTranslations('symbol_info_panel');

	return (
		<div className='h-48 text-tiny flex-justify-between'>
			<span className={value < 0 ? 'text-success-100' : 'text-error-100'}>
				{t(value < 0 ? 'liquid_inflow' : 'liquid_outflow')}
			</span>
			<span className={value < 0 ? 'text-success-100' : 'text-error-100'}>{numFormatter(Math.abs(value))}</span>
		</div>
	);
};

export default InflowAndOutflow;
