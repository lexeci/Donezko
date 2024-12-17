import styles from "./checkbox.module.scss";

export default function Checkbox(props: { id?: string; extra?: string; [x: string]: any })  {
	const { extra, id, ...rest } = props;
	return (
		<input
		id={id}
		type='checkbox'
		className={`${styles.defaultCheckbox} ${extra}`}
		name='weekly'
		{...rest}
	/>
	);
};
