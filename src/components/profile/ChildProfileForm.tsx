import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import { useFirestore } from '@/hooks/useFirestore';
import { useStorage } from '@/hooks/useStorage';
import { ChildProfile } from '@/types/child';

interface ChildProfileFormProps {
  initialData?: Partial<ChildProfile>;
  isEditing?: boolean;
}

export default function ChildProfileForm({ initialData, isEditing = false }: ChildProfileFormProps) {
  const { register, handleSubmit, control, formState: { errors } } = useForm<Partial<ChildProfile>>({
    defaultValues: initialData || {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: 'male',
      guardians: [],
      emergencyContacts: [],
      isActive: true
    }
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(initialData?.photoURL || null);
  
  const router = useRouter();
  const { user, userProfile } = useAuth();
  const { createDocument, updateDocument } = useFirestore();
  const { uploadFile } = useStorage();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: Partial<ChildProfile>) => {
    if (!user) {
      toast.error('You must be logged in to add a child');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Upload photo if provided
      let photoURL = initialData?.photoURL;
      if (photoFile) {
        const path = `children/${user.uid}/${Date.now()}_${photoFile.name}`;
        photoURL = await uploadFile(photoFile, path);
      }
      
      const childData: Partial<ChildProfile> = {
        ...data,
        photoURL,
        guardians: [user.uid, ...(data.guardians || [])],
        lastUpdated: new Date().toISOString(),
      };
      
      if (isEditing && initialData?.id) {
        // Update existing child profile
        await updateDocument('children', initialData.id, childData);
        toast.success('Child profile updated successfully');
      } else {
        // Create new child profile
        const createdAt = new Date().toISOString();
        await createDocument('children', `${user.uid}_${Date.now()}`, {
          ...childData,
          createdAt,
          lastUpdated: createdAt,
        });
        toast.success('Child profile created successfully');
      }
      
      router.push('/dashboard/parent/children');
    } catch (error) {
      console.error('Error saving child profile:', error);
      toast.error('Failed to save child profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="space-y-6">
        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">Basic Information</h3>
          <p className="mt-1 text-sm text-gray-500">
            Please provide the basic details of the child.
          </p>
          
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="firstName" className="label">
                First name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="firstName"
                  {...register('firstName', { required: 'First name is required' })}
                  className={`input ${errors.firstName ? 'border-red-300 focus:ring-red-500' : ''}`}
                />
                {errors.firstName && (
                  <p className="mt-2 text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="lastName" className="label">
                Last name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="lastName"
                  {...register('lastName', { required: 'Last name is required' })}
                  className={`input ${errors.lastName ? 'border-red-300 focus:ring-red-500' : ''}`}
                />
                {errors.lastName && (
                  <p className="mt-2 text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="dateOfBirth" className="label">
                Date of birth
              </label>
              <div className="mt-1">
                <input
                  type="date"
                  id="dateOfBirth"
                  {...register('dateOfBirth', { required: 'Date of birth is required' })}
                  className={`input ${errors.dateOfBirth ? 'border-red-300 focus:ring-red-500' : ''}`}
                />
                {errors.dateOfBirth && (
                  <p className="mt-2 text-sm text-red-600">{errors.dateOfBirth.message}</p>
                )}
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="gender" className="label">
                Gender
              </label>
              <div className="mt-1">
                <select
                  id="gender"
                  {...register('gender', { required: 'Gender is required' })}
                  className={`input ${errors.gender ? 'border-red-300 focus:ring-red-500' : ''}`}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && (
                  <p className="mt-2 text-sm text-red-600">{errors.gender.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Photo Upload */}
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">Photo</h3>
          <p className="mt-1 text-sm text-gray-500">
            Upload a recent photo of the child.
          </p>
          
          <div className="mt-6 flex items-center space-x-6">
            <div className="flex-shrink-0">
              <div className="relative h-40 w-40">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Child preview"
                    className="h-40 w-40 rounded-md object-cover"
                  />
                ) : (
                  <div className="h-40 w-40 rounded-md bg-gray-200 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex-1">
              <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
                {photoPreview ? 'Change photo' : 'Upload photo'}
              </label>
              <input
                id="photo"
                name="photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="mt-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-medium
                  file:bg-primary-50 file:text-primary-700
                  hover:file:bg-primary-100"
              />
              <p className="mt-2 text-xs text-gray-500">
                JPG, PNG or GIF up to 5MB
              </p>
            </div>
          </div>
        </div>

        {/* School Information */}
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">School Information</h3>
          <p className="mt-1 text-sm text-gray-500">
            Provide details about the child's school.
          </p>
          
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="schoolName" className="label">
                School name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="schoolName"
                  {...register('school.name')}
                  className="input"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="grade" className="label">
                Grade
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="grade"
                  {...register('school.grade')}
                  className="input"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="class" className="label">
                Class
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="class"
                  {...register('school.class')}
                  className="input"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="teacherName" className="label">
                Teacher's name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="teacherName"
                  {...register('school.teacherName')}
                  className="input"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">Emergency Contact</h3>
          <p className="mt-1 text-sm text-gray-500">
            Add at least one emergency contact besides yourself.
          </p>
          
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="emergencyName" className="label">
                Contact name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="emergencyName"
                  {...register('emergencyContacts.0.name')}
                  className="input"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="emergencyRelationship" className="label">
                Relationship
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="emergencyRelationship"
                  {...register('emergencyContacts.0.relationship')}
                  className="input"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="emergencyPhone" className="label">
                Phone number
              </label>
              <div className="mt-1">
                <input
                  type="tel"
                  id="emergencyPhone"
                  {...register('emergencyContacts.0.phoneNumber')}
                  className="input"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="emergencyEmail" className="label">
                Email address
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  id="emergencyEmail"
                  {...register('emergencyContacts.0.email')}
                  className="input"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Medical Information */}
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">Medical Information</h3>
          <p className="mt-1 text-sm text-gray-500">
            Provide any relevant medical information that may be needed in an emergency.
          </p>
          
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-2">
              <label htmlFor="bloodType" className="label">
                Blood type
              </label>
              <div className="mt-1">
                <select
                  id="bloodType"
                  {...register('medicalInfo.bloodType')}
                  className="input"
                >
                  <option value="">Unknown</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="allergies" className="label">
                Allergies
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="allergies"
                  placeholder="Separate with commas"
                  {...register('medicalInfo.allergies')}
                  className="input"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="conditions" className="label">
                Medical conditions
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="conditions"
                  placeholder="Separate with commas"
                  {...register('medicalInfo.conditions')}
                  className="input"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="medications" className="label">
                Current medications
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="medications"
                  placeholder="Separate with commas"
                  {...register('medicalInfo.medications')}
                  className="input"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="doctorName" className="label">
                Doctor's name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="doctorName"
                  {...register('medicalInfo.doctorName')}
                  className="input"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="doctorContact" className="label">
                Doctor's contact
              </label>
              <div className="mt-1">
                <input
                  type="tel"
                  id="doctorContact"
                  {...register('medicalInfo.doctorContact')}
                  className="input"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Physical Attributes */}
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">Physical Attributes</h3>
          <p className="mt-1 text-sm text-gray-500">
            These details can help identify the child in case of emergency.
          </p>
          
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-2">
              <label htmlFor="height" className="label">
                Height (cm)
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  id="height"
                  {...register('physicalAttributes.height', { 
                    valueAsNumber: true,
                    min: { value: 30, message: 'Height must be at least 30cm' },
                    max: { value: 220, message: 'Height must be less than 220cm' }
                  })}
                  className="input"
                />
                {errors.physicalAttributes?.height && (
                  <p className="mt-2 text-sm text-red-600">{errors.physicalAttributes.height.message}</p>
                )}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="weight" className="label">
                Weight (kg)
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  id="weight"
                  {...register('physicalAttributes.weight', { 
                    valueAsNumber: true,
                    min: { value: 1, message: 'Weight must be at least 1kg' },
                    max: { value: 150, message: 'Weight must be less than 150kg' }
                  })}
                  className="input"
                />
                {errors.physicalAttributes?.weight && (
                  <p className="mt-2 text-sm text-red-600">{errors.physicalAttributes.weight.message}</p>
                )}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="eyeColor" className="label">
                Eye color
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="eyeColor"
                  {...register('physicalAttributes.eyeColor')}
                  className="input"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="hairColor" className="label">
                Hair color
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="hairColor"
                  {...register('physicalAttributes.hairColor')}
                  className="input"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="distinguishingFeatures" className="label">
                Distinguishing features
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="distinguishingFeatures"
                  placeholder="Birthmarks, scars, etc. (separate with commas)"
                  {...register('physicalAttributes.distinguishingFeatures')}
                  className="input"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Identification */}
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">Identification</h3>
          <p className="mt-1 text-sm text-gray-500">
            Official identification details if available.
          </p>
          
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="idNumber" className="label">
                ID Number
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="idNumber"
                  {...register('identifiers.idNumber')}
                  className="input"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="birthCertNumber" className="label">
                Birth Certificate Number
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="birthCertNumber"
                  {...register('identifiers.birthCertNumber')}
                  className="input"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="passportNumber" className="label">
                Passport Number
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="passportNumber"
                  {...register('identifiers.passportNumber')}
                  className="input"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-5 border-t border-gray-200">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Child Profile' : 'Save Child Profile'}
          </button>
        </div>
      </div>
    </form>
  );
}