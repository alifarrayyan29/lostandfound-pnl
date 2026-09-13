import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={
                'border-gray-100 bg-gray-50/50 rounded-2xl shadow-none focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50 text-sm py-3 px-4 transition-colors ' +
                className
            }
            ref={localRef}
        />
    );
});
