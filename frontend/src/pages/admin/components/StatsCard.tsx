import { LucideIcon } from "lucide-react";

interface StatsCardProps {
	icon: LucideIcon;
	label: string;
	value: string;
	bgColor: string;
	iconColor: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
	icon: Icon,
	label,
	value,
	bgColor,
	iconColor,
}) => {
	return (
		<div className={`p-4 rounded-xl shadow ${bgColor}`}>
			<div className="flex items-center space-x-4">
				<Icon className={`w-8 h-8 ${iconColor}`} />
				<div>
					<p className="text-sm font-medium text-muted-foreground">{label}</p>
					<p className="text-lg font-semibold">{value}</p>
				</div>
			</div>
		</div>
	);
};

export default StatsCard;
