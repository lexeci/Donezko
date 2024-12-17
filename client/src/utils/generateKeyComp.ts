export default function generateKeyComp(pre: unknown) {
	return `${pre}_${new Date().getTime()}`;
}
