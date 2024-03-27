import { ExcelSVG, FilterSVG } from '@/components/icons';
import OptionWatchlistManagerSVG from '@/components/icons/OptionWatchlistManagerSVG';
import { useAppDispatch } from '@/features/hooks';
import { setManageWatchlistColumnsPanel } from '@/features/slices/panelSlice';
import styled from 'styled-components';

interface ActionsProps {
	filtersCount: number;
	onShowFilters: () => void;
	onExportExcel: () => void;
}

const Badge = styled.span`
	width: 2.4rem;
	height: 2.4rem;
	position: absolute;
	border-radius: 50%;
	font-size: 1.4rem;
	padding-top: 0.3rem;
	top: -1.4rem;
	right: -0.8rem;
`;

const ExcelBtn = styled.button`
	svg {
		path {
			transition: fill 250ms;
		}

		path:nth-child(1),
		path:nth-child(2) {
			fill: rgb(32, 116, 74);
		}

		path:nth-child(3) {
			fill: rgb(255, 255, 255);
		}
	}

	&:hover svg {
		path:nth-child(1),
		path:nth-child(2) {
			fill: rgb(255, 255, 255);
		}

		path:nth-child(3) {
			fill: rgb(0, 142, 186);
		}
	}
`;

const Actions = ({ filtersCount, onShowFilters, onExportExcel }: ActionsProps) => {
	const dispatch = useAppDispatch();

	const manageWatchlistColumns = () => {
		dispatch(setManageWatchlistColumnsPanel(true));
	};

	return (
		<ul className='flex gap-8'>
			<li>
				<ExcelBtn
					onClick={onExportExcel}
					className='size-40 rounded border border-gray-500 transition-colors flex-justify-center hover:border-primary-400 hover:bg-primary-400'
					type='button'
				>
					<ExcelSVG />
				</ExcelBtn>
			</li>
			<li>
				<button
					onClick={onShowFilters}
					className='relative size-40 rounded border border-gray-500 transition-colors flex-justify-center hover:border-primary-400 hover:bg-primary-400 hover:text-white'
					type='button'
				>
					{filtersCount > 0 && <Badge className='bg-primary-300 text-white'>{filtersCount}</Badge>}
					<FilterSVG />
				</button>
			</li>
			<li>
				<OptionWatchlistManagerSVG
					onClick={manageWatchlistColumns}
					className='size-40 rounded border border-gray-500 bg-transparent transition-colors flex-justify-center hover:border-primary-400 hover:bg-primary-400'
					type='button'
				/>
			</li>
		</ul>
	);
};

export default Actions;
