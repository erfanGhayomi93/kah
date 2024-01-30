import styled, { keyframes } from 'styled-components';

interface ISymbolStateStyledProps {
	$color: string;
	$bgColor: string;
}

interface SymbolStateProps {
	state: string | null;
}

const pulse = ({ $color }: ISymbolStateStyledProps) => keyframes`
	0% {
		-webkit-transform: scale(0.95);
		transform: scale(0.95);
		-webkit-box-shadow: 0 0 0 0 rgba(${$color}, 0.9);
		box-shadow: 0 0 0 0 rgba(${$color}, 0.9);
	}

	50% {
		-webkit-transform: scale(1);
		transform: scale(1);
		-webkit-box-shadow: 0 0 0 8px rgba(${$color}, 0);
		box-shadow: 0 0 0 8px rgba(${$color}, 0);
	}

	100% {
		-webkit-transform: scale(0.95);
		transform: scale(0.95);
		-webkit-box-shadow: 0 0 0 0 rgba(${$color}, 0);
		box-shadow: 0 0 0 0 rgba(${$color}, 0);
	}
`;

const SS = styled.span<ISymbolStateStyledProps>`
	border-radius: 50%;
	width: 0.8rem;
	height: 0.8rem;
	background-color: rgb(${({ $bgColor }) => $bgColor});
	position: relative;

	&::after {
		content: '';
		position: absolute;
		top: 0%;
		left: 0%;
		width: 100%;
		height: 100%;
		animation: ${(props) => pulse(props)} 2s infinite;
		border-radius: 50%;
	}
`;

const SymbolState = ({ state }: SymbolStateProps) => {
	return (
		<SS
			$color={
				state === 'Open'
					? '12, 175, 130'
					: state === 'Frozen' || state === 'Suspended'
						? '254, 57, 87'
						: '255, 193, 7'
			}
			$bgColor={
				state === 'Open'
					? '0, 194, 136'
					: state === 'Frozen' || state === 'Suspended'
						? '255, 82, 109'
						: '255, 193, 7'
			}
		/>
	);
};

export default SymbolState;
