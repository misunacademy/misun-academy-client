'use client';

import { memo, useState, useEffect, type FC } from "react";

type Props = {
    value: string;
    placeholder?: string;
    className?: string;
};

const DebouncedInput: FC<Props> = memo(({ value, placeholder, className }) => {
    const [inner, setInner] = useState(value);

    useEffect(() => {
        setInner(value);
    }, [value]);

    return (
        <input
            className={className}
            value={inner}
            onChange={(e) => setInner(e.target.value)}
            placeholder={placeholder}
        />
    );
});
DebouncedInput.displayName = "DebouncedInput";
export { DebouncedInput };
