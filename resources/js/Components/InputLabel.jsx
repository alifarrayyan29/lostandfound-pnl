export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={
                `block text-xs font-bold text-gray-500 uppercase tracking-wide ` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}
