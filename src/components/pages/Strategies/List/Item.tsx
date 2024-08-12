import StrategyTag from '@/components/common/Strategy/StrategyTag';
import { AngleLeftSVG, PlusSVG } from '@/components/icons';
import { useTheme } from '@/hooks';
import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useMemo } from 'react';

interface StrategyItemProps extends Strategy.GetAll {}

const StrategyItem = ({ title, type, tags }: StrategyItemProps) => {
	const t = useTranslations();

	const theme = useTheme();

	const combinedTags = useMemo(() => {
		const result: Array<[Strategy.Cheap, string]> = [
			[tags[0], t(`strategy_cheaps.${tags[0]}`)],
			[tags[1], t(`strategy_cheaps.${tags[1]}`)],
			[tags[2], t(`strategy_cheaps.${tags[2]}`)],
		];

		if (tags.length === 4 && tags[3] === 'AllMarket') {
			result.push([tags[3], t('strategy_cheaps.AllMarket')]);
		} else {
			result.push([tags[3], t('strategy_cheaps.Market') + ' ' + t(`strategy_cheaps.${tags[3]}`)]);

			if (tags.length > 4) {
				result[3][1] +=
					'/' +
					tags
						.slice(4)
						.map((tag) => t(`strategy_cheaps.${tag}`))
						.join('/');
			}
		}

		return result;
	}, []);

	return (
		<Link href={`/strategy/${type}`} className='w-full p-8 md:w-6/12 xl:w-4/12 2xl:w-3/12' target='_blank'>
			<div className='h-328 cursor-pointer gap-16 overflow-hidden rounded border border-gray-200 bg-white p-16 flex-column darkBlue:bg-gray-50 dark:bg-gray-50'>
				<div className='gap-4 flex-column'>
					<div className='h-32 flex-justify-between'>
						<h1 className='text-base font-medium text-gray-700'>
							{t(`${type}.title`)}
							<span className='text-gray-500'> ({title})</span>
						</h1>

						<button type='button' className='size-32 text-gray-700 flex-justify-center'>
							<AngleLeftSVG width='2rem' height='2rem' />
						</button>
					</div>

					<h3 className='gap-4 whitespace-nowrap text-tiny text-gray-700 flex-items-center'>
						{t.rich(`${type}.desc`, {
							plus: () => (
								<b className='text-gray-800'>
									<PlusSVG width='1.4rem' height='1.4rem' />
								</b>
							),
						})}
					</h3>
				</div>

				<div className='flex-1 overflow-hidden flex-justify-center'>
					<Image
						width='395'
						height='170'
						alt={title}
						src={`/static/images/strategies/${type}_${theme}.svg`}
						style={{
							width: '99%',
							height: 'auto',
						}}
					/>
				</div>

				<ul style={{ flex: '0 0 3.2rem' }} className='gap-4 flex-justify-center'>
					{combinedTags.map(([id, title], i) => (
						<StrategyTag key={i} i={i} id={id} title={title} />
					))}
				</ul>
			</div>
		</Link>
	);
};

export default StrategyItem;
