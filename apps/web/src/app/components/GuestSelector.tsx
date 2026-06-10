import { useState } from 'react';

interface GuestSelectorProps {
    onGuestsChange: (count: number) => void;
}

const GuestSelector: React.FC<GuestSelectorProps> = ({ onGuestsChange }) => {
    const [adults, setAdults] = useState<number>(1);
    const [children, setChildren] = useState<number>(0);
    const [infants, setInfants] = useState<number>(0);
    const [pets, setPets] = useState<number>(0);

    const increment = (setter: React.Dispatch<React.SetStateAction<number>>, value: number) => {
        setter(value + 1);
        onGuestsChange(adults + children + 1);
    };

    const decrement = (setter: React.Dispatch<React.SetStateAction<number>>, value: number) => {
        const newValue = Math.max(0, value - 1);
        setter(newValue);
        onGuestsChange(adults + children - 1);
    };

    return (
        <div className="w-[220px] bg-white border rounded-xl shadow-md flex flex-col cursor-pointer p-4">
            <div className="flex justify-between items-center mb-4">
                <p className="text-sm">Adults <span className="text-gray-500">(Ages 13 or above)</span></p>
                <div className="flex items-center">
                    <button onClick={() => decrement(setAdults, adults)}>-</button>
                    <span className="mx-2">{adults}</span>
                    <button onClick={() => increment(setAdults, adults)}>+</button>
                </div>
            </div>
            <div className="flex justify-between items-center mb-4">
                <p className="text-sm">Children <span className="text-gray-500">(Ages 2–12)</span></p>
                <div className="flex items-center">
                    <button onClick={() => decrement(setChildren, children)}>-</button>
                    <span className="mx-2">{children}</span>
                    <button onClick={() => increment(setChildren, children)}>+</button>
                </div>
            </div>
            <div className="flex justify-between items-center mb-4">
                <p className="text-sm">Infants <span className="text-gray-500">(Under 2)</span></p>
                <div className="flex items-center">
                    <button onClick={() => decrement(setInfants, infants)}>-</button>
                    <span className="mx-2">{infants}</span>
                    <button onClick={() => increment(setInfants, infants)}>+</button>
                </div>
            </div>
            <div className="flex justify-between items-center mb-4">
                <p className="text-sm">Pets</p>
                <div className="flex items-center">
                    <button onClick={() => decrement(setPets, pets)}>-</button>
                    <span className="mx-2">{pets}</span>
                    <button onClick={() => increment(setPets, pets)}>+</button>
                </div>
            </div>
        </div>
    );
};

export default GuestSelector;
