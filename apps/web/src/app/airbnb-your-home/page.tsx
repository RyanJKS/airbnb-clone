'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import apiService from '../api/apiService';
import TextInput from './TextInput';
import TextAreaInput from './TextAreaInput';
import ImageUploader from './ImageUploader';
import CategorySelector from './CategorySelector';
import CountryCitySelector from './CountryCitySelector';
import CustomButton from '../components/forms/CustomButton';

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
    image_files: yup.array().min(1, 'At least one image is required').required('Images are required')
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
    image_files: File[];
}

const AirbnbYourHomePage: React.FC = () => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema)
    });

    const router = useRouter();

    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [imagePreviews, setImagePreviews] = useState<Array<{ file: File, url: string }>>([]);
    const [errorMessage, setErrorMessage] = useState<string[]>([]);

    const [selectedLocation, setSelectedLocation] = useState<{ value: string; countryCode: string } | null>(null)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const newImagePreviews = files.map(file => ({
            file,
            url: URL.createObjectURL(file)
        }));
        setImagePreviews(prev => [...prev, ...newImagePreviews]);
        setValue('image_files', [...imagePreviews, ...newImagePreviews].map(img => img.file));
    };

    const removeImage = (url: string) => {
        const updatedImagePreviews = imagePreviews.filter(image => image.url !== url);
        setImagePreviews(updatedImagePreviews);
        setValue('image_files', updatedImagePreviews.map(img => img.file));
    };
    const submitProperty: SubmitHandler<IFormInputs> = async (data) => {
        try {
            const formData = new FormData();
            formData.append('category', data.category);
            formData.append('title', data.title);
            formData.append('description', data.description);
            formData.append('price_per_night', data.price_per_night.toString());
            formData.append('bedrooms', data.bedrooms.toString());
            formData.append('bathrooms', data.bathrooms.toString());
            formData.append('guests', data.guests.toString());
            formData.append('country', data.country);
            formData.append('country_code', data.country_code);
            data.image_files.forEach((file) => {
                formData.append('image_files', file);
            });

            const response = await apiService.postWithFiles('/api/properties/create/', formData);

            if (response.success) {
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
                setErrorMessage(["Error creating new property"]);
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
                    error={errors.image_files?.message}
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
                <CountryCitySelector
                    selectedLocation={selectedLocation?.value || ''}
                    onSelectLocation={(location) => {
                        setSelectedLocation(location);
                        setValue('country', location ? location.value : '');
                        setValue('country_code', location ? location.countryCode : '');
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

export default AirbnbYourHomePage;