import { memo, useState, useEffect, type FC } from "react";

type Props = {
    value: string;
    onChange: (val: string) => void;
    delay?: number;
    placeholder?: string;
    className?: string;
};

export const DebouncedInput: FC<Props> = memo(({ value, onChange, delay = 300, placeholder, className }) => {
    const [inner, setInner] = useState(value);

    useEffect(() => setInner(value), [value]);

    useEffect(() => {
        const id = setTimeout(() => onChange(inner), delay);
        return () => clearTimeout(id);
    }, [inner, delay, onChange]);

    return (
        <input
            className={className}
            value={inner}
            onChange={(e) => setInner(e.target.value)}
            placeholder={placeholder}
        />
    );
});
