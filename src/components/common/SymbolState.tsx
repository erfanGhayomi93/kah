import styled from 'styled-components';

interface ISymbolStateStyledProps {
	$color: string;
	$bgColor: string;
}

interface SymbolStateProps {
	state: string | null;
}

const SS = styled.span<ISymbolStateStyledProps>`
	border-radius: 50%;
	width: 0.8rem;
	height: 0.8rem;
	background-color: rgb(${({ $bgColor }) => $bgColor});
	position: relative;
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
