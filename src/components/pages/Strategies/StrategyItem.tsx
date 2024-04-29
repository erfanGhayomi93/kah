import { PlusSVG } from '@/components/icons';
import { StrategyCheapColor } from '@/constants/enums';
import { useRouter } from '@/navigation';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface StrategyItemProps extends Strategy.GetAll {}

const StrategyItem = ({ id, imageUrl, title, type, tags }: StrategyItemProps) => {
	const router = useRouter();

	const t = useTranslations();

	const onStrategyClick = () => {
		router.push(`/strategy/${id}`);
	};

	return (
		<div className='w-full p-8 md:w-6/12 xl:w-4/12 2xl:w-3/12'>
			<div
				onClick={onStrategyClick}
				style={{ height: '32.8rem' }}
				className='cursor-pointer gap-16 overflow-hidden rounded border border-gray-500 bg-white p-16 flex-column'
			>
				<div className='gap-4 flex-column'>
					<div className='h-32 flex-justify-between'>
						<h1 className='text-base font-medium text-gray-900'>
							{t(`strategies.strategy_title_${type}`)}
							<span className='text-gray-700'> ({title})</span>
						</h1>

						<button type='button' className='size-32 text-gray-900 flex-justify-center'>
							{/* <AngleLeftSVG width='2rem' height='2rem' /> */}
						</button>
					</div>

					<h3 className='gap-4 whitespace-nowrap text-tiny text-gray-900 flex-items-center'>
						{t.rich(`strategies.strategy_desc_${type}`, {
							plus: () => (
								<b className='text-gray-1000'>
									<PlusSVG width='1.4rem' height='1.4rem' />
								</b>
							),
						})}
					</h3>
				</div>

				<div className='flex-1 overflow-hidden'>
					<Image
						width='395'
						height='170'
						alt={title}
						src={`${process.env.NEXT_PUBLIC_RLC_URL}/${imageUrl}`}
						style={{
							width: '100%',
							height: 'auto',
						}}
					/>
				</div>

				<ul style={{ flex: '0 0 3.2rem' }} className='flex gap-4'>
					{tags.map((tag, i) => (
						<li key={tag}>
							<button
								type='button'
								className={clsx(
									'h-32 w-96 rounded-oval border border-current text-tiny font-medium flex-justify-center',
									i !== 0 && `border-current text-${StrategyCheapColor[tag]}`,
									i === 0 && `bg-${StrategyCheapColor[tag]}`,
									{
										'border-current text-white': i === 0 && tag !== 'ModerateRisk',
										'border-warning-100 bg-warning-100 text-gray-1000':
											i === 0 && tag === 'ModerateRisk',
									},
								)}
							>
								{t(`strategies.tag_${tag}`)}
							</button>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default StrategyItem;
