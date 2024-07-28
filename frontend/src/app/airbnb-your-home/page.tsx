'use client';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import TextInput from './TextInput';
import TextAreaInput from './TextAreaInput';
import CategorySelector from './CategorySelector';
import ImageUploader from './ImageUploader';
import CountrySelect from '../hooks/useCountries';
import CustomButton from '../components/forms/CustomButton';
import apiService from '../api/apiService';
import { useRouter } from 'next/navigation';

const validationSchema = yup.object().shape({
    category: yup.string().required('Category is required'),
    title: yup.string().required('Title is required').max(255, 'Title must be 255 characters or less'),
    description: yup.string().required('Description is required'),
    price_per_night: yup.number()
        .transform((value, originalValue) => originalValue === '' ? NaN : value)
        .typeError('Must be a number')
        .required('Price per night is required')
        .positive('Price must be a positive number'),
    bedrooms: yup.number()
        .transform((value, originalValue) => originalValue === '' ? NaN : value)
        .typeError('Must be a number')
        .required('Number of bedrooms is required')
        .positive('Must be a positive number')
        .integer('Must be an integer'),
    bathrooms: yup.number()
        .transform((value, originalValue) => originalValue === '' ? NaN : value)
        .typeError('Must be a number')
        .required('Number of bathrooms is required')
        .positive('Must be a positive number')
        .integer('Must be an integer'),
    guests: yup.number()
        .transform((value, originalValue) => originalValue === '' ? NaN : value)
        .typeError('Must be a number')
        .required('Number of guests is required')
        .positive('Must be a positive number')
        .integer('Must be an integer'),
    country: yup.string().required('Country is required'),
    country_code: yup.string().required('Country code is required').max(5, 'Country code must be 5 characters or less'),
    image: yup.array().min(1, 'At least one image is required').required('Images are required')
});

interface IFormInputs {
    category: string;
    title: string;
    description: string;
    price_per_night: number;
    bedrooms: number;
    bathrooms: number;
    guests: number;
    country: string;
    country_code: string;
    image: File[];
}

const PropertyDetailPage: React.FC = () => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema)
    });

    const router = useRouter();

    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [imagePreviews, setImagePreviews] = useState<Array<{ file: File, url: string }>>([]);
    const [selectedCountry, setSelectedCountry] = useState<{ value: string; label: string } | null>(null);
    const [errorMessage, setErrorMessage] = useState<string[]>([]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const newImagePreviews = files.map(file => ({
            file,
            url: URL.createObjectURL(file)
        }));
        setImagePreviews(prev => [...prev, ...newImagePreviews]);
        setValue('image', [...imagePreviews, ...newImagePreviews].map(img => img.file));
    };

    const removeImage = (url: string) => {
        const updatedImagePreviews = imagePreviews.filter(image => image.url !== url);
        setImagePreviews(updatedImagePreviews);
        setValue('image', updatedImagePreviews.map(img => img.file));
    };

    const submitProperty: SubmitHandler<IFormInputs> = async (data) => {
        try {
            const response = await apiService.post('/api/properties/create/', data);

            if (response.success) {
                // handleLogin(response.user.pk, response.access, response.refresh)
                // await refreshUserId(); // Update userId in context using getUserId
                // loginModal.close();
                console.log("hi")
                router.push('/');
            } else {
                const tempErrors: string[] = Object.values(response.data).flat() as string[];
                setErrorMessage(tempErrors);
            }
        } catch (error: any) {
            if (error.response && error.response.data) {
                const tempErrors: string[] = Object.values(error.response.data).flat() as string[];
                setErrorMessage(tempErrors);
            } else {
                setErrorMessage([error.message]);

            }
        }
    };

    return (
        <div className="max-w-[1000px] mx-auto px-6 pb-6 bg-white">
            <h1 className="text-2xl font-bold mb-4">Host Your Home</h1>
            <form onSubmit={handleSubmit(submitProperty)}>
                <CategorySelector
                    selectedCategory={selectedCategory}
                    onSelectCategory={(category) => {
                        const newCategory = selectedCategory === category ? '' : category;
                        setSelectedCategory(newCategory);
                        setValue('category', newCategory);
                    }}
                    error={errors.category?.message}
                />
                <ImageUploader
                    handleImageChange={handleImageChange}
                    imagePreviews={imagePreviews}
                    removeImage={removeImage}
                    error={errors.image?.message}
                />
                <TextInput
                    label="Title"
                    id="title"
                    register={register}
                    error={errors.title?.message}
                />
                <TextAreaInput
                    label="Description"
                    id="description"
                    register={register}
                    error={errors.description?.message}
                />
                <TextInput
                    label="Price per Night"
                    id="price_per_night"
                    type="number"
                    register={register}
                    error={errors.price_per_night?.message}
                />
                <TextInput
                    label="Bedrooms"
                    id="bedrooms"
                    type="number"
                    register={register}
                    error={errors.bedrooms?.message}
                />
                <TextInput
                    label="Bathrooms"
                    id="bathrooms"
                    type="number"
                    register={register}
                    error={errors.bathrooms?.message}
                />
                <TextInput
                    label="Guests"
                    id="guests"
                    type="number"
                    register={register}
                    error={errors.guests?.message}
                />
                <CountrySelect
                    selectedCountry={selectedCountry?.value || ''}
                    onSelectCountry={(country) => {
                        setSelectedCountry(country);
                        setValue('country', country ? country.label : ''); // sets value for this field to be country full name by country.label
                        setValue('country_code', country ? country.value : ''); // sets value for country_code field to be country code by country.value
                    }}
                    error={errors.country?.message}
                />
                <TextInput
                    label="Country Code"
                    id="country_code"
                    register={register}
                    error={errors.country_code?.message}
                />

                {errorMessage.map((error, index) => {
                    return (
                        <div
                            key={`error_${index}`}
                            className="p-5 mb-2 bg-airbnb text-white rounded-xl opacity-80"
                        >
                            {error}
                        </div>
                    )
                })}

                <CustomButton label='Submit' onClick={handleSubmit(submitProperty)} />
            </form>
        </div>
    );
};

export default PropertyDetailPage;