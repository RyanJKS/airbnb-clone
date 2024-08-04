import { useState, useEffect } from 'react';
import Select, { SingleValue } from 'react-select';
import countries from 'world-countries';

const countryOptions = countries.map((country) => ({
    value: country.cca2,
    label: country.name.common,
}));

interface CountryOption {
    value: string;
    label: string;
}

interface SearchDestinationProps {
    selectedCountry: string | null;
    onSelectCountry: (country: CountryOption | null) => void;
}

const SearchDestination: React.FC<SearchDestinationProps> = ({ selectedCountry, onSelectCountry }) => {
    const [inputValue, setInputValue] = useState<string>('');
    const [filteredOptions, setFilteredOptions] = useState<CountryOption[]>(countryOptions);

    useEffect(() => {
        const filtered = countryOptions.filter((option: CountryOption) =>
            option.label.toLowerCase().includes(inputValue.toLowerCase())
        );
        setFilteredOptions(filtered);
    }, [inputValue]);

    const handleInputChange = (newValue: string) => {
        setInputValue(newValue);
        return newValue;
    };

    const handleChange = (option: SingleValue<CountryOption>) => {
        onSelectCountry(option);
        setInputValue(option ? option.label : '');
    };

    return (
        <Select
            isClearable
            placeholder="Search destinations"
            options={filteredOptions}
            value={filteredOptions.find(option => option.label === inputValue)}
            onInputChange={handleInputChange}
            onChange={handleChange}
            inputValue={inputValue}
            className="w-full"
        />
    );
};

export default SearchDestination;
