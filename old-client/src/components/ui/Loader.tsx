import { Loading03Icon } from "hugeicons-react";

interface LoaderProps {
	size?: string; // Optional size prop
	color?: string; // Optional color prop
}

const Loader = ({ size = "h-5 w-5", color = "text-white" }: LoaderProps) => {
	return (
		<div className="flex justify-center items-center">
			<Loading03Icon
				className={`animate-spin ${size} ${color}`}
				aria-label="Loading..."
			/>
		</div>
	);
};

export default Loader;
