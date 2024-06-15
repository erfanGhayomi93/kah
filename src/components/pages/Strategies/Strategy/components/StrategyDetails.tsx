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
				className='flex justify-between rounded bg-white p-16 transition-height'
			>
				<div className='flex-1 justify-between overflow-hidden flex-column'>
					<div className='flex-column'>
						<div className='gap-8 flex-column'>
							<div style={{ flex: '0 0 3.2rem' }} className='gap-8 flex-items-center'>
								<Link href='/strategy' className='text-light-gray-700 size-32 flex-justify-center'>
									<ArrowRightSVG width='2.4rem' height='2.4rem' />
								</Link>

								<div className='text-light-gray-700 flex gap-4 font-medium'>
									<h1 className='text-base'>{t(`${type}.title`)}</h1>
									<h2 className='text-light-gray-500 text-base'>({title})</h2>
								</div>

								<ul style={{ flex: '0 0 3.2rem' }} className='flex gap-4 pr-8'>
									{combinedTags.map(([id, title], i) => (
										<StrategyTag key={i} i={i} id={id} title={title} />
									))}
								</ul>
							</div>

							<span className='text-light-gray-500 gap-4 whitespace-nowrap pr-40 text-tiny flex-items-center'>
								{t.rich(`${type}.desc`, {
									plus: () => (
										<b className='text-light-gray-200'>
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
										<span className='text-light-gray-700 gap-4 text-tiny font-medium flex-items-center'>
											<AdvantagesSVG width='2rem' height='2rem' />
											{t('strategy.advantages')}:
										</span>
										<p className='text-light-gray-800 text-tiny leading-8'>
											{t(`${type}.advantages`)}
										</p>
									</li>
									<li className='flex gap-8'>
										<span className='text-light-gray-700 gap-4 text-tiny font-medium flex-items-center'>
											<DisadvantagesSVG width='2rem' height='2rem' />
											{t('strategy.disadvantages')}:
										</span>
										<p className='text-light-gray-800 text-tiny leading-8'>
											{t(`${type}.disadvantages`)}
										</p>
									</li>
									<li className='flex gap-8'>
										<span className='text-light-gray-700 gap-4 text-tiny font-medium flex-items-center'>
											<MaximumLossSVG width='2rem' height='2rem' />
											{t('strategy.maximum_loss')}:
										</span>
										<p className='text-light-gray-800 text-tiny leading-8'>
											{t(`${type}.maximum_loss`)}
										</p>
									</li>
									<li className='flex gap-8'>
										<span className='text-light-gray-700 gap-4 text-tiny font-medium flex-items-center'>
											<MaximumProfitSVG width='2rem' height='2rem' />
											{t('strategy.maximum_profit')}:
										</span>
										<p className='text-light-gray-800 text-tiny leading-8'>
											{t(`${type}.maximum_profit`)}
										</p>
									</li>
									<li className='flex gap-8'>
										<span className='text-light-gray-700 gap-4 text-tiny font-medium flex-items-center'>
											<GuaranteeSVG width='2rem' height='2rem' />
											{t('strategy.required_margin')}:
										</span>
										<p className='text-light-gray-800 text-tiny leading-8'>
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
								className='text-light-info-100 gap-8 text-base flex-items-center'
							>
								<MenuChocolateSVG width='2.4rem' height='2.4rem' />
								{t('strategy.more_info')}
							</button>
							<button
								onClick={trainingVideo}
								type='button'
								className='text-light-info-100 gap-8 text-base flex-items-center'
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
						className='h-full justify-between gap-8 overflow-hidden rounded p-16 shadow-card flex-column'
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
								<li className='text-light-gray-700 gap-4 flex-items-center'>
									<PlaySVG />
									<h3 className='text-tiny font-medium'>{t('strategy.execution_steps')}:</h3>
								</li>
								{steps.map((step, i) => (
									<Step key={i} id={i + 1} title={step} />
								))}

								{condition && (
									<li className='text-light-gray-700 gap-4 flex-items-center'>
										<RhombicCircleSVG width='1.6rem' height='1.6rem' />
										<h3 className='text-tiny font-medium'>{t('strategy.execution_condition')}:</h3>
										<span className='text-light-gray-800 text-tiny'>{condition}</span>
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
				className='text-light-gray-700 absolute bottom-8 left-1/2 -translate-x-1/2 rounded bg-white flex-justify-center'
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
		<span className='border-light-gray-200 text-light-gray-700 size-16 rounded-circle border text-sm flex-justify-center'>
			{id}
		</span>
		<p className='text-light-gray-800 flex-1 text-tiny leading-8'>{title}</p>
	</li>
);

export default memo(StrategyDetails, () => true);
