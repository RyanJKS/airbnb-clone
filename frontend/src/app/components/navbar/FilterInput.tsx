import React from 'react';

interface FilterInputProps {
    label: string;
    value: string;
    placeholder?: string;
    onClick: () => void;
    showModal: boolean;
    onInputChange?: (value: string) => void;
    debouncedInput?: string;
    renderModal: () => JSX.Element;
}

const FilterInput: React.FC<FilterInputProps> = ({
    label,
    value,
    placeholder = '',
    onClick,
    showModal,
    onInputChange,
    debouncedInput,
    renderModal
}) => (
    <div
        className="h-[48px] lg:h-[64px] px-8 flex flex-col justify-center rounded-full hover:bg-gray-200 cursor-pointer relative"
        onClick={onClick}
    >
        <p className="text-xs font-semibold">{label}</p>
        {onInputChange ? (
            <div className="relative">
                <input
                    type="text"
                    placeholder={placeholder}
                    onClick={(e) => e.stopPropagation()}
                    onFocus={onClick}
                    value={value}
                    onChange={(e) => onInputChange(e.target.value)}
                    className="w-full rounded-full border-none focus:outline-none focus:ring-0"
                />
                {showModal && debouncedInput && renderModal()}
            </div>
        ) : (
            <p className="text-sm">{value}</p>
        )}
        {showModal && !onInputChange && renderModal()}
    </div>
);

export default FilterInput;
