'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useFirestore } from '@/hooks/useFirestore';
import { useStorage } from '@/hooks/useStorage';
import { ChildProfile } from '@/types/child';

interface ChildProfileFormProps {
  initialData?: Partial<ChildProfile>;
  isEditing?: boolean;
}

export default function ChildProfileForm({ initialData, isEditing = false }: ChildProfileFormProps) {
  const { user, userProfile } = useAuth();
  const { createDocument, updateDocument } = useFirestore();
  const { uploadFile } = useStorage();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(initialData?.photoURL || null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Partial<ChildProfile>>({
    defaultValues: initialData || {},
  });

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
    if (!user || !userProfile) {
      toast.error('You must be logged in to perform this action');
      return;
    }

    setIsLoading(true);
    try {
      let photoURL = initialData?.photoURL || '';

      // Upload photo if a new one was selected
      if (photoFile) {
        const fileName = `children/${user.uid}/${Date.now()}-${photoFile.name}`;
        photoURL = await uploadFile(photoFile, fileName);
      }

      const childData: Partial<ChildProfile> = {
        ...data,
        photoURL: photoURL || undefined,
        guardians: initialData?.guardians || [user.uid],
        lastUpdated: new Date().toISOString(),
      };

      if (isEditing && initialData?.id) {
        // Update existing child profile
        await updateDocument<ChildProfile>('children', initialData.id, childData);
        toast.success('Child profile updated successfully');
      } else {
        // Create new child profile
        const newChildData: Omit<ChildProfile, 'id'> = {
          ...childData as any,
          createdAt: new Date().toISOString(),
          isActive: true,
          emergencyContacts: childData.emergencyContacts || [],
        };
        
        await createDocument<Omit<ChildProfile, 'id'>>('children', `${Date.now()}`, newChildData);
        toast.success('Child profile created successfully');
      }

      router.push('/profile/child');
    } catch (error: any) {
      console.error('Error saving child profile:', error);
      toast.error(error.message || 'Failed to save child profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Information */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              className={`mt-1 input ${errors.firstName ? 'border-danger-500' : ''}`}
              {...register('firstName', { required: 'First name is required' })}
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-danger-600">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              className={`mt-1 input ${errors.lastName ? 'border-danger-500' : ''}`}
              {...register('lastName', { required: 'Last name is required' })}
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-danger-600">{errors.lastName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              type="date"
              id="dateOfBirth"
              className={`mt-1 input ${errors.dateOfBirth ? 'border-danger-500' : ''}`}
              {...register('dateOfBirth', { required: 'Date of birth is required' })}
            />
            {errors.dateOfBirth && (
              <p className="mt-1 text-sm text-danger-600">{errors.dateOfBirth.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <select
              id="gender"
              className={`mt-1 input ${errors.gender ? 'border-danger-500' : ''}`}
              {...register('gender', { required: 'Gender is required' })}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && (
              <p className="mt-1 text-sm text-danger-600">{errors.gender.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Photo</label>
            <div className="mt-1 flex items-center">
              {photoPreview ? (
                <div className="relative">
                  <img
                    src={photoPreview}
                    alt="Child photo preview"
                    className="h-32 w-32 rounded-full object-cover"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-white rounded-full p-1 shadow-sm"
                    onClick={() => {
                      setPhotoFile(null);
                      setPhotoPreview(null);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="h-32 w-32 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
              <div className="ml-5">
                <label
                  htmlFor="photo-upload"
                  className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50"
                >
                  Change
                </label>
                <input
                  id="photo-upload"
                  name="photo"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handlePhotoChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* School Information */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">School Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="schoolName" className="block text-sm font-medium text-gray-700">
              School Name
            </label>
            <input
              type="text"
              id="schoolName"
              className="mt-1 input"
              {...register('school.name')}
            />
          </div>

          <div>
            <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
              Grade
            </label>
            <input
              type="text"
              id="grade"
              className="mt-1 input"
              {...register('school.grade')}
            />
          </div>

          <div>
            <label htmlFor="class" className="block text-sm font-medium text-gray-700">
              Class
            </label>
            <input
              type="text"
              id="class"
              className="mt-1 input"
              {...register('school.class')}
            />
          </div>

          <div>
            <label htmlFor="teacherName" className="block text-sm font-medium text-gray-700">
              Teacher Name
            </label>
            <input
              type="text"
              id="teacherName"
              className="mt-1 input"
              {...register('school.teacherName')}
            />
          </div>
        </div>
      </div>

      {/* Medical Information */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Medical Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700">
              Blood Type
            </label>
            <select
              id="bloodType"
              className="mt-1 input"
              {...register('medicalInfo.bloodType')}
            >
              <option value="">Select blood type</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="Unknown">Unknown</option>
            </select>
          </div>

          <div>
            <label htmlFor="allergies" className="block text-sm font-medium text-gray-700">
              Allergies (comma separated)
            </label>
            <input
              type="text"
              id="allergies"
              className="mt-1 input"
              placeholder="e.g. Peanuts, Penicillin, Dust"
              {...register('medicalInfo.allergies')}
            />
          </div>

          <div>
            <label htmlFor="conditions" className="block text-sm font-medium text-gray-700">
              Medical Conditions (comma separated)
            </label>
            <input
              type="text"
              id="conditions"
              className="mt-1 input"
              placeholder="e.g. Asthma, Diabetes, Epilepsy"
              {...register('medicalInfo.conditions')}
            />
          </div>

          <div>
            <label htmlFor="medications" className="block text-sm font-medium text-gray-700">
              Medications (comma separated)
            </label>
            <input
              type="text"
              id="medications"
              className="mt-1 input"
              placeholder="e.g. Insulin, Ventolin, Ritalin"
              {...register('medicalInfo.medications')}
            />
          </div>

          <div>
            <label htmlFor="doctorName" className="block text-sm font-medium text-gray-700">
              Doctor Name
            </label>
            <input
              type="text"
              id="doctorName"
              className="mt-1 input"
              {...register('medicalInfo.doctorName')}
            />
          </div>

          <div>
            <label htmlFor="doctorContact" className="block text-sm font-medium text-gray-700">
              Doctor Contact
            </label>
            <input
              type="text"
              id="doctorContact"
              className="mt-1 input"
              {...register('medicalInfo.doctorContact')}
            />
          </div>
        </div>
      </div>

      {/* Physical Attributes */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Physical Attributes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="height" className="block text-sm font-medium text-gray-700">
              Height (cm)
            </label>
            <input
              type="number"
              id="height"
              className="mt-1 input"
              {...register('physicalAttributes.height')}
            />
          </div>

          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
              Weight (kg)
            </label>
            <input
              type="number"
              id="weight"
              className="mt-1 input"
              {...register('physicalAttributes.weight')}
            />
          </div>

          <div>
            <label htmlFor="eyeColor" className="block text-sm font-medium text-gray-700">
              Eye Color
            </label>
            <input
              type="text"
              id="eyeColor"
              className="mt-1 input"
              {...register('physicalAttributes.eyeColor')}
            />
          </div>

          <div>
            <label htmlFor="hairColor" className="block text-sm font-medium text-gray-700">
              Hair Color
            </label>
            <input
              type="text"
              id="hairColor"
              className="mt-1 input"
              {...register('physicalAttributes.hairColor')}
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="distinguishingFeatures" className="block text-sm font-medium text-gray-700">
              Distinguishing Features (comma separated)
            </label>
            <input
              type="text"
              id="distinguishingFeatures"
              className="mt-1 input"
              placeholder="e.g. Birthmark on left arm, Scar on right knee"
              {...register('physicalAttributes.distinguishingFeatures')}
            />
          </div>
        </div>
      </div>

      {/* Identification */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Identification</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700">
              ID Number
            </label>
            <input
              type="text"
              id="idNumber"
              className="mt-1 input"
              {...register('identifiers.idNumber')}
            />
          </div>

          <div>
            <label htmlFor="birthCertNumber" className="block text-sm font-medium text-gray-700">
              Birth Certificate Number
            </label>
            <input
              type="text"
              id="birthCertNumber"
              className="mt-1 input"
              {...register('identifiers.birthCertNumber')}
            />
          </div>

          <div>
            <label htmlFor="passportNumber" className="block text-sm font-medium text-gray-700">
              Passport Number (if applicable)
            </label>
            <input
              type="text"
              id="passportNumber"
              className="mt-1 input"
              {...register('identifiers.passportNumber')}
            />
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="emergencyName" className="block text-sm font-medium text-gray-700">
              Contact Name
            </label>
            <input
              type="text"
              id="emergencyName"
              className="mt-1 input"
              {...register('emergencyContacts.0.name')}
            />
          </div>

          <div>
            <label htmlFor="emergencyRelationship" className="block text-sm font-medium text-gray-700">
              Relationship
            </label>
            <input
              type="text"
              id="emergencyRelationship"
              className="mt-1 input"
              {...register('emergencyContacts.0.relationship')}
            />
          </div>

          <div>
            <label htmlFor="emergencyPhone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              id="emergencyPhone"
              className="mt-1 input"
              {...register('emergencyContacts.0.phoneNumber')}
            />
          </div>

          <div>
            <label htmlFor="emergencyEmail" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="emergencyEmail"
              className="mt-1 input"
              {...register('emergencyContacts.0.email')}
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="btn btn-primary py-2 px-4"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
              {isEditing ? 'Updating...' : 'Saving...'}
            </div>
          ) : (
            isEditing ? 'Update Profile' : 'Save Profile'
          )}
        </button>
      </div>
    </form>
  );
}