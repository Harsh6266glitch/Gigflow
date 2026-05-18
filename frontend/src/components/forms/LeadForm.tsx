import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Lead, LeadFormData } from '../../types';
import Input from '../common/Input';
import Button from '../common/Button';

const schema = z.object({
  name:   z.string().min(2, 'Name must be at least 2 characters'),
  email:  z.string().email('Invalid email address'),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']),
  source: z.enum(['Website', 'Instagram', 'Referral']),
  notes:  z.string().max(1000).optional(),
});

interface LeadFormProps {
  defaultValues?: Partial<Lead>;
  onSubmit: (data: LeadFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  mode: 'create' | 'edit';
}

const selectClass =
  'w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 ' +
  'text-sm text-slate-900 dark:text-slate-100 px-3.5 py-2.5 ' +
  'focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all';

export default function LeadForm({ defaultValues, onSubmit, onCancel, isLoading, mode }: LeadFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name:   defaultValues?.name   ?? '',
      email:  defaultValues?.email  ?? '',
      status: defaultValues?.status ?? 'New',
      source: defaultValues?.source ?? 'Website',
      notes:  defaultValues?.notes  ?? '',
    },
  });

  useEffect(() => {
    if (defaultValues) {
      reset({
        name:   defaultValues.name   ?? '',
        email:  defaultValues.email  ?? '',
        status: defaultValues.status ?? 'New',
        source: defaultValues.source ?? 'Website',
        notes:  defaultValues.notes  ?? '',
      });
    }
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <Input
        label="Full Name"
        placeholder="e.g. Rahul Sharma"
        error={errors.name?.message}
        {...register('name')}
      />
      <Input
        label="Email Address"
        type="email"
        placeholder="e.g. rahul@example.com"
        error={errors.email?.message}
        {...register('email')}
      />

      <div className="grid grid-cols-2 gap-4">
        {/* Status */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
          <select className={selectClass} {...register('status')}>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Lost">Lost</option>
          </select>
          {errors.status && <p className="text-xs text-red-500">{errors.status.message}</p>}
        </div>

        {/* Source */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Source</label>
          <select className={selectClass} {...register('source')}>
            <option value="Website">Website</option>
            <option value="Instagram">Instagram</option>
            <option value="Referral">Referral</option>
          </select>
          {errors.source && <p className="text-xs text-red-500">{errors.source.message}</p>}
        </div>
      </div>

      {/* Notes */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Notes <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <textarea
          rows={3}
          placeholder="Any additional notes..."
          className={selectClass + ' resize-none'}
          {...register('notes')}
        />
        {errors.notes && <p className="text-xs text-red-500">{errors.notes.message}</p>}
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1" disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" loading={isLoading} className="flex-1">
          {mode === 'create' ? 'Create Lead' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}
