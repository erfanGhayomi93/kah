interface DetailPartProps {
	title: string;
	items?: string[];
}

const DetailPart = ({ title, items }: DetailPartProps) => {
	return (
		<div className='gap-8 flex-column'>
			<p className='whitespace-pre-line text-justify'>{title}</p>

			{items?.length && (
				<ul style={{ listStyleType: 'disc' }} className='gap-8 pr-24 flex-column'>
					{items.map((item, i) => (
						<li key={i}>
							<p className='whitespace-pre-line text-justify'>{item}</p>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default DetailPart;
