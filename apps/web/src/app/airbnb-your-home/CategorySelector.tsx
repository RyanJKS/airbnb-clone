import Categories from '../components/Categories'; // Ensure the import path is correct

interface CategorySelectorProps {
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
    error?: string;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ selectedCategory, onSelectCategory, error }) => {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="category">Category</label>
            <Categories
                selectedCategory={selectedCategory}
                onSelectCategory={onSelectCategory}
            />
            {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
        </div>
    );
};

export default CategorySelector;
