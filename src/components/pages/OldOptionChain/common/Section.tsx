import { cn } from '@/utils/helpers';

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
	children?: React.ReactNode;
	className?: string;
}

const Section = ({ children, className, style, ...props }: SectionProps) => (
	<div style={style} className={cn(className)} {...props}>
		{children}
	</div>
);

export default Section;
