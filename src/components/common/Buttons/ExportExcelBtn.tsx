import { ExcelSVG } from '@/components/icons';
import { forwardRef, type ButtonHTMLAttributes } from 'react';
import styled from 'styled-components';

const Button = styled.button`
	svg {
		path {
			transition: fill 250ms;
		}

		path:nth-child(1),
		path:nth-child(2) {
			fill: rgb(0, 194, 136);
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

interface ExportExcelBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const ExportExcelBtn = forwardRef<HTMLButtonElement, ExportExcelBtnProps>((props, ref) => (
	<Button ref={ref} className='btn-icon size-40 rounded' type='button' {...props}>
		<ExcelSVG />
	</Button>
));

export default ExportExcelBtn;
