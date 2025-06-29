import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Check } from 'lucide-react';

interface MultiSelectProps {
    options?: string[];
    placeholder?: string;
    onChange?: (selectedItems: string[]) => void;
    value?: string[];
    className?: string;
    disabled?: boolean;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
    options = [],
    placeholder = "Select items...",
    onChange = () => { },
    value = [],
    className = "",
    disabled = false
}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedItems, setSelectedItems] = useState<string[]>(value);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        setSelectedItems(value);
    }, [value]);

    const toggleItem = (item: string): void => {
        if (disabled) return;

        const newSelection = selectedItems.includes(item)
            ? selectedItems.filter(selected => selected !== item)
            : [...selectedItems, item];

        setSelectedItems(newSelection);
        onChange(newSelection);
    };

    const removeItem = (item: string, e: React.MouseEvent<HTMLButtonElement>): void => {
        e.stopPropagation();
        if (disabled) return;

        const newSelection = selectedItems.filter(selected => selected !== item);
        setSelectedItems(newSelection);
        onChange(newSelection);
    };

    const clearAll = (e: React.MouseEvent<HTMLButtonElement>): void => {
        e.stopPropagation();
        if (disabled) return;

        setSelectedItems([]);
        onChange([]);
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <div
                className={`
          min-h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm 
          shadow-sm transition-all duration-200 cursor-pointer
          ${disabled
                        ? 'bg-gray-50 border-gray-200 cursor-not-allowed'
                        : 'border-gray-300 hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20'
                    }
          ${isOpen ? 'border-blue-500 ring-2 ring-blue-500/20' : ''}
        `}
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1 flex-1 min-w-0">
                        {selectedItems.length === 0 ? (
                            <span className="text-gray-500 truncate">{placeholder}</span>
                        ) : (
                            selectedItems.map((item: string) => (
                                <span
                                    key={item}
                                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md"
                                >
                                    <span className="truncate max-w-24">{item}</span>
                                    {!disabled && (
                                        <button
                                            onClick={(e) => removeItem(item, e)}
                                            className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                                            type="button"
                                        >
                                            <X size={12} />
                                        </button>
                                    )}
                                </span>
                            ))
                        )}
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                        {selectedItems.length > 0 && !disabled && (
                            <button
                                onClick={clearAll}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                                type="button"
                            >
                                <X size={14} />
                            </button>
                        )}
                        <ChevronDown
                            size={16}
                            className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                                }`}
                        />
                    </div>
                </div>
            </div>

            {isOpen && !disabled && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {options.length === 0 ? (
                        <div className="px-3 py-2 text-gray-500 text-sm">No options available</div>
                    ) : (
                        options.map((option: string) => (
                            <div
                                key={option}
                                className={`
                  px-3 py-2 cursor-pointer text-sm transition-colors
                  hover:bg-gray-50 flex items-center justify-between
                  ${selectedItems.includes(option) ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}
                `}
                                onClick={() => toggleItem(option)}
                            >
                                <span className="truncate">{option}</span>
                                {selectedItems.includes(option) && (
                                    <Check size={16} className="text-blue-600 flex-shrink-0 ml-2" />
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default MultiSelect;