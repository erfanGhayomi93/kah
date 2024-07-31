'use client';

import StrategyTag from '@/components/common/Strategy/StrategyTag';
import {
	AdvantagesSVG,
	ArrowDownSVG,
	ArrowRightSVG,
	DisadvantagesSVG,
	GuaranteeSVG,
	MaximumLossSVG,
	MaximumProfitSVG,
	MenuChocolateSVG,
	PlaySVG,
	PlusSVG,
	RhombicCircleSVG,
	TeachVideoSVG,
} from '@/components/icons';
import { useLocalstorage } from '@/hooks';
import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { memo, useMemo } from 'react';

interface StepProps {
	id: number;
	title: string;
}

interface StrategyDetailsProps {
	steps: string[];
	strategy: Strategy.GetAll;
	condition?: string;
	readMore?: () => void;
	trainingVideo?: () => void;
}

const StrategyDetails = ({ strategy, condition, steps, readMore, trainingVideo }: StrategyDetailsProps) => {
	const { title, type, imageUrl, tags } = strategy;

	const t = useTranslations();

	const [isExpand, setIsExpand] = useLocalstorage(`${type}Expand`, true);

	const combinedTags = useMemo(() => {
		const result: Array<[Strategy.Cheap, string]> = [
			[tags[0], t(`strategy_cheaps.${tags[0]}`)],
			[tags[1], t(`strategy_cheaps.${tags[1]}`)],
			[tags[2], t(`strategy_cheaps.${tags[2]}`)],
			[tags[3], t('strategy_cheaps.Market') + ' ' + t(`strategy_cheaps.${tags[3]}`)],
		];

		if (tags.length > 4)
			result[3][1] +=
				'/' +
				tags
					.slice(4)
					.map((tag) => t(`strategy_cheaps.${tag}`))
					.join('/');

		return result;
	}, []);

	const length = steps.length + Number(Boolean(condition));
	let sectionHeight = 344;
	sectionHeight += length - 1 > 0 ? Math.max((length - 3) * 28, 0) : 0;
	sectionHeight /= 10;

	return (
		<div className='relative overflow-hidden pb-16 flex-column'>
			<div
				style={{
					height: isExpand ? `${sectionHeight}rem` : '9.6rem',
				}}
				className='flex justify-between rounded bg-white p-16 transition-height darkBlue:bg-gray-50 dark:bg-gray-50'
			>
				<div className='flex-1 justify-between overflow-hidden flex-column'>
					<div className='flex-column'>
						<div className='gap-8 flex-column'>
							<div style={{ flex: '0 0 3.2rem' }} className='gap-8 flex-items-center'>
								<Link href='/strategy' className='size-32 text-gray-700 flex-justify-center'>
									<ArrowRightSVG width='2.4rem' height='2.4rem' />
								</Link>

								<div className='flex gap-4 font-medium text-gray-700'>
									<h1 className='text-base'>{t(`${type}.title`)}</h1>
									<h2 className='text-base text-gray-500'>({title})</h2>
								</div>

								<ul style={{ flex: '0 0 3.2rem' }} className='flex gap-4 pr-8'>
									{combinedTags.map(([id, title], i) => (
										<StrategyTag key={i} i={i} id={id} title={title} />
									))}
								</ul>
							</div>

							<span className='gap-4 whitespace-nowrap pr-40 text-tiny text-gray-500 flex-items-center'>
								{t.rich(`${type}.desc`, {
									plus: () => (
										<b className='text-gray-200'>
											<PlusSVG width='1.4rem' height='1.4rem' />
										</b>
									),
								})}
							</span>
						</div>

						{isExpand && (
							<div className='gap-16 flex-column'>
								<div className='flex-items-center'>
									<h1 className='text-base font-medium'>{t(`${type}.summary`)}</h1>
									<Image width='42' height='50' alt={title} src='/static/images/astronaut-hint.png' />
								</div>

								<ul className='gap-8 flex-column'>
									<li className='flex gap-8'>
										<span className='gap-4 text-tiny font-medium text-gray-700 flex-items-center'>
											<AdvantagesSVG width='2rem' height='2rem' />
											{t('strategy.advantages')}:
										</span>
										<p className='text-tiny leading-8 text-gray-800'>{t(`${type}.advantages`)}</p>
									</li>
									<li className='flex gap-8'>
										<span className='gap-4 text-tiny font-medium text-gray-700 flex-items-center'>
											<DisadvantagesSVG width='2rem' height='2rem' />
											{t('strategy.disadvantages')}:
										</span>
										<p className='text-tiny leading-8 text-gray-800'>
											{t(`${type}.disadvantages`)}
										</p>
									</li>
									<li className='flex gap-8'>
										<span className='gap-4 text-tiny font-medium text-gray-700 flex-items-center'>
											<MaximumLossSVG width='2rem' height='2rem' />
											{t('strategy.maximum_loss')}:
										</span>
										<p className='text-tiny leading-8 text-gray-800'>{t(`${type}.maximum_loss`)}</p>
									</li>
									<li className='flex gap-8'>
										<span className='gap-4 text-tiny font-medium text-gray-700 flex-items-center'>
											<MaximumProfitSVG width='2rem' height='2rem' />
											{t('strategy.maximum_profit')}:
										</span>
										<p className='text-tiny leading-8 text-gray-800'>
											{t(`${type}.maximum_profit`)}
										</p>
									</li>
									<li className='flex gap-8'>
										<span className='gap-4 text-tiny font-medium text-gray-700 flex-items-center'>
											<GuaranteeSVG width='2rem' height='2rem' />
											{t('strategy.required_margin')}:
										</span>
										<p className='text-tiny leading-8 text-gray-800'>
											{t(`${type}.required_margin`)}
										</p>
									</li>
								</ul>
							</div>
						)}
					</div>

					{isExpand && (
						<div className='flex items-center gap-16'>
							<button
								onClick={readMore}
								type='button'
								className='gap-8 text-base text-info-100 flex-items-center'
							>
								<MenuChocolateSVG width='2.4rem' height='2.4rem' />
								{t('strategy.more_info')}
							</button>
							<button
								onClick={trainingVideo}
								type='button'
								className='gap-8 text-base text-info-100 flex-items-center'
							>
								<TeachVideoSVG width='2.4rem' height='2.4rem' />
								{t('strategy.teach_video')}
							</button>
						</div>
					)}
				</div>

				{isExpand && (
					<div
						style={{ flex: '0 0 43.2rem' }}
						className='h-full justify-between gap-8 overflow-hidden rounded p-16 shadow-sm flex-column'
					>
						<div className='flex-1 flex-justify-center'>
							<Image
								width='399'
								height='176'
								alt={title}
								src={`${process.env.NEXT_PUBLIC_RLC_URL}/${imageUrl}`}
								style={{
									width: '100%',
									height: 'auto',
								}}
							/>
						</div>

						{steps.length > 0 && (
							<ul className='gap-8 text-right flex-column'>
								<li className='gap-4 text-gray-700 flex-items-center'>
									<PlaySVG />
									<h3 className='text-tiny font-medium'>{t('strategy.execution_steps')}:</h3>
								</li>
								{steps.map((step, i) => (
									<Step key={i} id={i + 1} title={step} />
								))}

								{condition && (
									<li className='gap-4 text-gray-700 flex-items-center'>
										<RhombicCircleSVG width='1.6rem' height='1.6rem' />
										<h3 className='text-tiny font-medium'>{t('strategy.execution_condition')}:</h3>
										<span className='text-tiny text-gray-800'>{condition}</span>
									</li>
								)}
							</ul>
						)}
					</div>
				)}
			</div>

			<button
				type='button'
				onClick={() => setIsExpand(!isExpand)}
				style={{ width: '6.6rem', height: '2.2rem' }}
				className='absolute bottom-8 left-1/2 -translate-x-1/2 rounded bg-white text-gray-700 flex-justify-center darkBlue:bg-gray-50 dark:bg-gray-50'
			>
				<ArrowDownSVG
					width='1.8rem'
					height='1.8rem'
					className='transition-transform'
					style={{ transform: `rotate(${isExpand ? 180 : 0}deg)` }}
				/>
			</button>
		</div>
	);
};

const Step = ({ id, title }: StepProps) => (
	<li className='gap-4 flex-items-center'>
		<span className='size-16 rounded-circle border border-gray-200 text-sm text-gray-700 flex-justify-center'>
			{id}
		</span>
		<p className='flex-1 text-tiny leading-8 text-gray-800'>{title}</p>
	</li>
);

export default memo(StrategyDetails, () => true);
