export default function generateKeyComp(pre: string): string {
	// Use performance.now() for higher resolution timestamps
	const timestamp = Date.now(); // or performance.now();
	return `${pre}_${timestamp}`;
}
