import React from 'react';
import styled from 'styled-components';

const Button = styled.button`
	svg {
		path {
			transition: fill 250ms;
		}

		path:nth-child(1),
		path:nth-child(3) {
			fill: rgba(0, 87, 255, 1);
		}

		path:nth-child(2),
		path:nth-child(4) {
			fill: rgb(93, 96, 109);
		}
	}

	&:hover svg {
		path:nth-child(1),
		path:nth-child(3) {
			fill: rgba(0, 182, 237, 1);
		}

		path:nth-child(2),
		path:nth-child(4) {
			fill: rgb(255, 255, 255);
		}
	}
`;

interface OptionWatchlistManagerSVGProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const OptionWatchlistManagerSVG = (props: OptionWatchlistManagerSVGProps) => (
	<Button type='button' {...props}>
		<svg width='2.4rem' height='2.4rem' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
			<path d='M6.46154 8.04651H4.61538C4.18711 8.04602 3.77651 7.87435 3.47367 7.56916C3.17084 7.26398 3.00049 6.8502 3 6.4186V3.62791C3.00049 3.19631 3.17084 2.78253 3.47367 2.47735C3.77651 2.17216 4.18711 2.00049 4.61538 2H7.38462C7.81289 2.00049 8.22349 2.17216 8.52633 2.47735C8.82916 2.78253 8.99951 3.19631 9 3.62791V6.4186C9 6.60364 8.92706 6.7811 8.79723 6.91194C8.66739 7.04277 8.4913 7.11628 8.30769 7.11628C8.12408 7.11628 7.94799 7.04277 7.81816 6.91194C7.68832 6.7811 7.61538 6.60364 7.61538 6.4186V3.62791C7.61538 3.56623 7.59107 3.50708 7.54779 3.46346C7.50452 3.41985 7.44582 3.39535 7.38462 3.39535H4.61538C4.55418 3.39535 4.49548 3.41985 4.45221 3.46346C4.40893 3.50708 4.38462 3.56623 4.38462 3.62791V6.4186C4.38462 6.48028 4.40893 6.53944 4.45221 6.58305C4.49548 6.62666 4.55418 6.65116 4.61538 6.65116H6.46154C6.64515 6.65116 6.82124 6.72467 6.95107 6.85551C7.08091 6.98635 7.15385 7.1638 7.15385 7.34884C7.15385 7.53387 7.08091 7.71133 6.95107 7.84217C6.82124 7.97301 6.64515 8.04651 6.46154 8.04651Z' />
			<path d='M7.38462 15.0231H4.61538C4.18711 15.0226 3.77651 14.8509 3.47367 14.5457C3.17084 14.2405 3.00049 13.8268 3 13.3952V10.6045C3.00049 10.1729 3.17084 9.75909 3.47367 9.45391C3.77651 9.14872 4.18711 8.97705 4.61538 8.97656H7.38462C7.81289 8.97705 8.22349 9.14872 8.52633 9.45391C8.82916 9.75909 8.99951 10.1729 9 10.6045V13.3952C8.99951 13.8268 8.82916 14.2405 8.52633 14.5457C8.22349 14.8509 7.81289 15.0226 7.38462 15.0231ZM4.61538 10.3719C4.55418 10.3719 4.49548 10.3964 4.45221 10.44C4.40893 10.4836 4.38462 10.5428 4.38462 10.6045V13.3952C4.38462 13.4568 4.40893 13.516 4.45221 13.5596C4.49548 13.6032 4.55418 13.6277 4.61538 13.6277H7.38462C7.44582 13.6277 7.50452 13.6032 7.54779 13.5596C7.59107 13.516 7.61538 13.4568 7.61538 13.3952V10.6045C7.61538 10.5428 7.59107 10.4836 7.54779 10.44C7.50452 10.3964 7.44582 10.3719 7.38462 10.3719H4.61538ZM7.38462 21.9998H4.61538C4.18711 21.9993 3.77651 21.8277 3.47367 21.5225C3.17084 21.2173 3.00049 20.8035 3 20.3719V17.5812C3.00049 17.1496 3.17084 16.7358 3.47367 16.4307C3.77651 16.1255 4.18711 15.9538 4.61538 15.9533H7.38462C7.81289 15.9538 8.22349 16.1255 8.52633 16.4307C8.82916 16.7358 8.99951 17.1496 9 17.5812V20.3719C8.99951 20.8035 8.82916 21.2173 8.52633 21.5225C8.22349 21.8277 7.81289 21.9993 7.38462 21.9998ZM4.61538 17.3487C4.55418 17.3487 4.49548 17.3732 4.45221 17.4168C4.40893 17.4604 4.38462 17.5195 4.38462 17.5812V20.3719C4.38462 20.4336 4.40893 20.4927 4.45221 20.5364C4.49548 20.58 4.55418 20.6045 4.61538 20.6045H7.38462C7.44582 20.6045 7.50452 20.58 7.54779 20.5364C7.59107 20.4927 7.61538 20.4336 7.61538 20.3719V17.5812C7.61538 17.5195 7.59107 17.4604 7.54779 17.4168C7.50452 17.3732 7.44582 17.3487 7.38462 17.3487H4.61538Z' />
			<path d='M20.3076 5.72103H11.9999C11.8163 5.72103 11.6402 5.64753 11.5104 5.51669C11.3806 5.38585 11.3076 5.20839 11.3076 5.02336C11.3076 4.83832 11.3806 4.66087 11.5104 4.53003C11.6402 4.39919 11.8163 4.32568 11.9999 4.32568H20.3076C20.4912 4.32568 20.6673 4.39919 20.7972 4.53003C20.927 4.66087 20.9999 4.83832 20.9999 5.02336C20.9999 5.20839 20.927 5.38585 20.7972 5.51669C20.6673 5.64753 20.4912 5.72103 20.3076 5.72103Z' />
			<path d='M20.3076 12.6976H11.9999C11.8163 12.6976 11.6402 12.6241 11.5104 12.4933C11.3806 12.3624 11.3076 12.185 11.3076 11.9999C11.3076 11.8149 11.3806 11.6374 11.5104 11.5066C11.6402 11.3758 11.8163 11.3022 11.9999 11.3022H20.3076C20.4912 11.3022 20.6673 11.3758 20.7972 11.5066C20.927 11.6374 20.9999 11.8149 20.9999 11.9999C20.9999 12.185 20.927 12.3624 20.7972 12.4933C20.6673 12.6241 20.4912 12.6976 20.3076 12.6976ZM20.3076 19.6743H11.9999C11.8163 19.6743 11.6402 19.6008 11.5104 19.47C11.3806 19.3392 11.3076 19.1617 11.3076 18.9767C11.3076 18.7916 11.3806 18.6142 11.5104 18.4833C11.6402 18.3525 11.8163 18.279 11.9999 18.279H20.3076C20.4912 18.279 20.6673 18.3525 20.7972 18.4833C20.927 18.6142 20.9999 18.7916 20.9999 18.9767C20.9999 19.1617 20.927 19.3392 20.7972 19.47C20.6673 19.6008 20.4912 19.6743 20.3076 19.6743Z' />
		</svg>
	</Button>
);

export default OptionWatchlistManagerSVG;
