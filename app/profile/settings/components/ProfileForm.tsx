'use client';

import { useActionState, useEffect, useState } from 'react';
import { updateProfileSettings } from '@/app/actions/profile';
import SubmitButton from './SubmitButton';

interface ProfileFormProps {
  initialData: {
    fullName: string;
    phone: string;
    email: string;
  };
}

export default function ProfileForm({ initialData }: ProfileFormProps) {
  const [state, formAction] = useActionState(updateProfileSettings, null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (state) {
      // Use a small delay to avoid "synchronous setState within effect" warning
      const showTimer = setTimeout(() => setVisible(true), 10);
      const hideTimer = setTimeout(() => setVisible(false), 5010);
      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-6">
      {visible && state && (
        <div className={`p-4 rounded-xl border ${
          state.success 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        } animate-in fade-in slide-in-from-top-4 duration-300`}>
          <div className="flex items-center gap-3">
            <span className="material-icons text-xl">
              {state.success ? 'check_circle' : 'error'}
            </span>
            <p className="font-medium">{state.message}</p>
          </div>
        </div>
      )}

      <div className="bg-nordic/5 p-6 rounded-xl border border-nordic/10">
        <h3 className="text-lg font-medium text-nordic mb-4">Personal Information</h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-nordic mb-1">Email Address</label>
            <input 
              type="email" 
              id="email" 
              value={initialData.email} 
              disabled 
              className="w-full px-4 py-2 border border-nordic/20 rounded-lg bg-gray-100 text-nordic/60 cursor-not-allowed"
            />
            <p className="text-xs text-nordic/50 mt-1">Your email address cannot be changed here.</p>
          </div>

          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-nordic mb-1">Full Name</label>
            <input 
              type="text" 
              id="full_name" 
              name="full_name"
              defaultValue={initialData.fullName}
              placeholder="John Doe"
              className="w-full px-4 py-2 border border-nordic/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-mosque focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-nordic mb-1">Phone Number</label>
            <input 
              type="tel" 
              id="phone" 
              name="phone"
              defaultValue={initialData.phone}
              placeholder="+1 (555) 000-0000"
              className="w-full px-4 py-2 border border-nordic/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-mosque focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <SubmitButton label="Save Changes" />
      </div>
    </form>
  );
}
