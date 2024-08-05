// CitySelector.tsx
import React, { useState, useEffect } from "react";
import { Country, City } from "country-state-city";

interface CitySelectorProps {
    selectedCity: string;
    onSelectCity: (city: { name: string; country: string }) => void;
}

const CitySelector: React.FC<CitySelectorProps> = ({ selectedCity, onSelectCity }) => {
    const [filteredCities, setFilteredCities] = useState<{ name: string; country: string }[]>([]);

    useEffect(() => {
        if (selectedCity) {
            const lowercasedFilter = selectedCity.toLowerCase();
            const filteredData = Country.getAllCountries()
                .flatMap((country) => {
                    const cities = City.getCitiesOfCountry(country.isoCode);
                    return cities ? cities.map((city) => ({
                        name: city.name,
                        country: country.name,
                    })) : [];
                })
                .filter(
                    (entry) =>
                        entry.name.toLowerCase().includes(lowercasedFilter) ||
                        entry.country.toLowerCase().includes(lowercasedFilter)
                );
            setFilteredCities(filteredData);
        } else {
            setFilteredCities([]);
        }
    }, [selectedCity]);

    return (
        <div className="absolute top-full left-0 w-full bg-white border rounded-xl shadow-md z-10">
            {filteredCities.length > 0 && (
                filteredCities.map((city, index) => (
                    <div
                        key={index}
                        className="p-2 hover:bg-gray-200 cursor-pointer"
                        onClick={() => onSelectCity(city)}
                    >
                        {city.name}, {city.country}
                    </div>
                ))
            )}
        </div>
    );
};

export default CitySelector;
