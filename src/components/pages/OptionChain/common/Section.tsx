import clsx from 'clsx';

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
	children?: React.ReactNode;
	className?: string;
}

const Section = ({ children, className, style, ...props }: SectionProps) => (
	<div style={style} className={clsx('rounded bg-white', className)} {...props}>
		{children}
	</div>
);

export default Section;
