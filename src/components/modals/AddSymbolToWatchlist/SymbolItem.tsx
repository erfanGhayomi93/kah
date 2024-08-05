interface SymbolItemProps extends Option.CustomWatchlistSearch {
	onClick: () => void;
}

const SymbolItem = ({ symbolTitle, isInWatchlist, onClick }: SymbolItemProps) => {
	return (
		<li
			onClick={onClick}
			className='w-full flex-48 cursor-pointer px-8 transition-bg flex-justify-between hover:bg-secondary-100'
		>
			<h4 className='text-gray-800'>{symbolTitle}</h4>

			<button type='button' className={isInWatchlist ? 'text-warning-100' : 'text-gray-700'}>
				<svg width='2.4rem' height='2.4rem' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
					<path
						d='M19.9583 10.0463C19.9071 9.8808 19.8104 9.73472 19.6803 9.62621C19.5501 9.51771 19.3922 9.45159 19.2263 9.43609L14.6087 8.99846L12.7828 4.538C12.7172 4.37826 12.6081 4.24213 12.4691 4.1465C12.33 4.05086 12.1672 3.99993 12.0007 4C11.8341 4.00007 11.6713 4.05116 11.5323 4.14692C11.3934 4.24267 11.2844 4.3789 11.2189 4.53869L9.39307 8.99846L4.77476 9.43609C4.60869 9.45148 4.45063 9.5175 4.32024 9.62595C4.18986 9.73439 4.09291 9.88047 4.04147 10.046C3.99003 10.2115 3.98636 10.3892 4.03093 10.5568C4.0755 10.7245 4.16634 10.8748 4.29213 10.989L7.78253 14.1839L6.75328 18.9157C6.71627 19.0851 6.72773 19.2621 6.78625 19.4247C6.84476 19.5874 6.94774 19.7285 7.08242 19.8306C7.2171 19.9327 7.37754 19.9913 7.54383 19.9991C7.71012 20.0069 7.87495 19.9636 8.01785 19.8744L12.0009 17.3899L15.9826 19.8744C16.1255 19.9634 16.2903 20.0067 16.4566 19.9988C16.6229 19.991 16.7833 19.9324 16.918 19.8304C17.0527 19.7283 17.1557 19.5873 17.2143 19.4247C17.273 19.2621 17.2846 19.0851 17.2478 18.9157L16.2186 14.1839L19.709 10.9897C19.9656 10.7552 20.0636 10.3851 19.9583 10.0463Z'
						stroke='currentColor'
						fill={isInWatchlist ? 'currentColor' : 'transparent'}
						style={{
							transition: 'fill 250ms, border-color 250ms',
							WebkitTransition: 'fill 250ms, border-color 250ms',
						}}
					/>
				</svg>
			</button>
		</li>
	);
};

export default SymbolItem;
