import React from "react";

type Props = {
    value: string;
    onChange: (val: string) => void;
    delay?: number;
    placeholder?: string;
    className?: string;
};

export const DebouncedInput: React.FC<Props> = ({ value, onChange, delay = 300, placeholder, className }) => {
    const [inner, setInner] = React.useState(value);

    React.useEffect(() => setInner(value), [value]);

    React.useEffect(() => {
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
};
