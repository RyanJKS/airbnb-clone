import React, { ReactNode } from 'react';

interface FilterModalContainerProps {
    children: ReactNode;
}

const FilterModalContainer: React.FC<FilterModalContainerProps> = ({ children }) => (
    <div className="w-[220px] absolute top-[100%] left-0 bg-white border rounded-xl shadow-md flex flex-col cursor-pointer z-10">
        {children}
    </div>
);

export default FilterModalContainer;
