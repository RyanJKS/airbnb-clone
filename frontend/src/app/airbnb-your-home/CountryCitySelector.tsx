import React, { useState, useEffect, useCallback } from 'react';
import Select, { SingleValue } from 'react-select';
import { Country, City } from 'country-state-city';

interface Option {
    value: string;
    label: string;
    countryCode: string;
}

interface CountryCitySelectorProps {
    selectedLocation: string;
    onSelectLocation: (location: Option | null) => void;
    error?: string;
}

const CountryCitySelector: React.FC<CountryCitySelectorProps> = ({ selectedLocation, onSelectLocation, error }) => {
    const [countryOptions, setCountryOptions] = useState<Option[]>([]);
    const [cityOptions, setCityOptions] = useState<Option[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<Option | null>(null);

    useEffect(() => {
        const countries = Country.getAllCountries();
        const countryOptions = countries.map(country => ({
            value: country.isoCode,
            label: country.name,
            countryCode: country.isoCode,
        }));
        setCountryOptions(countryOptions);
    }, []);

    const handleCountryChange = useCallback((option: SingleValue<Option>) => {
        setSelectedCountry(option);
        onSelectLocation(null);

        if (option) {
            const cities = City.getCitiesOfCountry(option.countryCode);
            const cityOptions = cities?.map(city => ({
                value: city.name,
                label: city.name,
                countryCode: option.countryCode,
            })) || [];
            setCityOptions(cityOptions);
        } else {
            setCityOptions([]);
        }
    }, [onSelectLocation]);

    const handleCityChange = useCallback((option: SingleValue<Option>) => {
        if (option && selectedCountry) {
            const selectedOption = {
                value: `${option.value}, ${selectedCountry.label}`,
                label: `${option.value}, ${selectedCountry.label}`,
                countryCode: option.countryCode,
            };
            onSelectLocation(selectedOption);
        } else {
            onSelectLocation(null);
        }
    }, [onSelectLocation, selectedCountry]);

    const selectedOption = cityOptions.find(option => option.value === selectedLocation);

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="country">Country</label>
            <Select
                id="country"
                isClearable
                placeholder="Select Country"
                options={countryOptions}
                value={selectedCountry}
                onChange={handleCountryChange}
                className={`rounded-lg ${error ? 'border-red-500' : 'border-gray-300'}`}
                classNamePrefix="react-select"
            />
            {selectedCountry && (
                <>
                    <label className="block text-sm font-medium text-gray-700 mb-2 mt-4" htmlFor="city">City</label>
                    <Select
                        id="city"
                        isClearable
                        placeholder="Select City"
                        options={cityOptions}
                        value={selectedOption}
                        onChange={handleCityChange}
                        className={`rounded-lg ${error ? 'border-red-500' : 'border-gray-300'}`}
                        classNamePrefix="react-select"
                        isDisabled={!selectedCountry}
                    />
                </>
            )}
            {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
        </div>
    );
};

export default CountryCitySelector;