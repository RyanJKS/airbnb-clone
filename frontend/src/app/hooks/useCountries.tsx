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

interface CountrySelectProps {
    selectedCountry: string;
    onSelectCountry: (country: CountryOption | null) => void;
    error?: string;
}

const CountrySelect: React.FC<CountrySelectProps> = ({ selectedCountry, onSelectCountry, error }) => {
    const selectedOption = countryOptions.find(option => option.value === selectedCountry);

    const handleChange = (option: SingleValue<CountryOption>) => {
        onSelectCountry(option);
    };

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="country">Country</label>
            <Select
                id="country"
                isClearable
                placeholder="Anywhere"
                options={countryOptions}
                value={selectedOption}
                onChange={handleChange}
                className={`rounded-lg ${error ? 'border-red-500' : 'border-gray-300'}`}
                classNamePrefix="react-select"
            />
            {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
        </div>
    );
};

export default CountrySelect;
