'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { BadgeCheck, Pill, Loader2 } from 'lucide-react';
import { FadeIn } from '@/components/ui/FadeIn';
import { useRegisterForBootcampMutation } from '@/redux/api/bootcampApi';
import { bootcampFormFields } from './bootcampData';
import headerImage from '@/assets/boocamp/paracetamol-for-photoshop-google-header.png';

const validWhatsAppMobile = /^(?:01[3-9]\d{8}|(?:\+?91|0)?[6789]\d{9})$/;

const registrationSchema = z.object({
    name: z.string().trim().min(2, 'আপনার পুরো নাম লিখুন'),
    whatsapp: z
        .string()
        .trim()
        .regex(validWhatsAppMobile, 'সঠিক হোয়াটসঅ্যাপ নম্বর দিন (যেমন: 01712345678 অথবা 9876543210)')
        .optional()
        .or(z.literal('')),
    address: z.string().trim().min(5, 'আপনার বর্তমান ঠিকানা লিখুন'),
    email: z.string().trim().email('সঠিক ইমেইল ঠিকানা দিন'),
    paymentLast4: z.string().trim().regex(/^\d{4}$/, 'ঠিক ৪ ডিজিটের নম্বর দিন'),
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

const inputClasses =
    'mt-2 h-12 w-full rounded-xl border border-white/15 bg-white/[0.05] px-4 text-white placeholder:text-white/30 focus-visible:border-[#ffd60a]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd60a]/40';

interface SlipFieldProps {
    id: string;
    label: string;
    required?: boolean;
    error?: string;
    children: React.ReactNode;
}

const SlipField = ({ id, label, required, error, children }: SlipFieldProps) => (
    <div>
        <label htmlFor={id} className="font-bangla text-sm font-semibold text-white/80">
            {label}
            {required && <span className="ml-1 text-[#e5484d]">*</span>}
        </label>
        {children}
        {error && (
            <p role="alert" className="mt-1.5 font-bangla text-xs font-medium text-[#e5484d]">
                {error}
            </p>
        )}
    </div>
);

export const BootcampRegistrationForm = () => {
    const [registerForBootcamp, { isLoading }] = useRegisterForBootcampMutation();
    const [isRegistered, setIsRegistered] = useState(false);

    const form = useForm<RegistrationFormValues>({
        resolver: zodResolver(registrationSchema),
        defaultValues: {
            name: '',
            whatsapp: '',
            address: '',
            email: '',
            paymentLast4: '',
        },
    });

    const errors = form.formState.errors;

    const onSubmit = async (values: RegistrationFormValues) => {
        try {
            await registerForBootcamp({
                ...values,
                whatsapp: values.whatsapp || undefined,
            }).unwrap();
            setIsRegistered(true);
        } catch (error) {
            const message =
                (error as { data?: { message?: string } })?.data?.message ||
                'রেজিস্ট্রেশন সম্পন্ন হয়নি। আবার চেষ্টা করুন।';
            toast.error(message);
        }
    };

    return (
        <section id="register" className="scroll-mt-20 bg-[#0a0a0b] py-14 text-white">
            <div className="mx-auto max-w-3xl px-4">
                <FadeIn>
                    <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#141416] shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
                        <div className="relative border-b border-white/10">
                            <Image
                                src={headerImage}
                                alt="প্যারাসিটামল ফর ফটোশপ Season 2.0 বুটক্যাম্প ব্যানার"
                                sizes="(max-width: 768px) 100vw, 768px"
                                className="h-32 w-full object-cover object-left sm:h-40"
                            />
                            <span className="absolute right-4 top-4 rounded-full bg-[#ffd60a] px-3 py-1 font-mona text-[10px] font-bold uppercase tracking-widest text-black">
                                Rx · Registration
                            </span>
                        </div>
                        <div className="p-5 sm:p-8">
                            {isRegistered ? (
                                <div className="py-8 text-center">
                                    <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#ffd60a]/15 text-[#ffd60a]">
                                        <BadgeCheck className="h-8 w-8" />
                                    </span>
                                    <h2 className="mt-5 font-bangla text-2xl font-bold">
                                        রেজিস্ট্রেশন সম্পন্ন!
                                    </h2>
                                    <p className="mx-auto mt-3 max-w-md font-bangla text-sm leading-relaxed text-white/60">
                                        আপনার তথ্য পেয়ে গেছি। পেমেন্ট যাচাইয়ের পর বুটক্যাম্পের
                                        জুম লিংক ও প্রয়োজনীয় সব তথ্য আপনাকে জানিয়ে দেওয়া
                                        হবে।
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            form.reset();
                                            setIsRegistered(false);
                                        }}
                                        className="mt-6 rounded-xl border border-white/20 px-5 py-2.5 font-bangla text-sm font-semibold text-white/80 transition-colors hover:border-[#ffd60a]/50 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffd60a]"
                                    >
                                        নতুন রেজিস্ট্রেশন করুন
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-start justify-between gap-4 border-b border-dashed border-white/15 pb-5">
                                        <div>
                                            <h2 className="font-bangla text-xl font-bold sm:text-2xl">
                                                রেজিস্ট্রেশন ফর্ম
                                            </h2>
                                            <p className="mt-1 font-bangla text-sm text-white/55">
                                                ৩৫০ টাকা সেন্ড মানি করে ফর্মটি পূরণ করুন।
                                            </p>
                                        </div>
                                        <Pill aria-hidden className="mt-1 h-8 w-8 shrink-0 text-[#ffd60a]" />
                                    </div>
                                    <form
                                        onSubmit={form.handleSubmit(onSubmit)}
                                        className="mt-6 space-y-5"
                                        noValidate
                                    >
                                        <SlipField
                                            id="bootcamp-name"
                                            label={bootcampFormFields.name}
                                            required
                                            error={errors.name?.message}
                                        >
                                            <input
                                                id="bootcamp-name"
                                                type="text"
                                                autoComplete="name"
                                                placeholder="আপনার পুরো নাম"
                                                {...form.register('name')}
                                                className={`${inputClasses} font-bangla ${
                                                    errors.name ? 'border-[#e5484d]/60' : ''
                                                }`}
                                            />
                                        </SlipField>
                                        <SlipField
                                            id="bootcamp-whatsapp"
                                            label={bootcampFormFields.whatsapp}
                                            error={errors.whatsapp?.message}
                                        >
                                            <input
                                                id="bootcamp-whatsapp"
                                                type="tel"
                                                inputMode="numeric"
                                                autoComplete="tel"
                                                placeholder="01XXXXXXXXX"
                                                {...form.register('whatsapp')}
                                                className={`${inputClasses} font-mona ${
                                                    errors.whatsapp ? 'border-[#e5484d]/60' : ''
                                                }`}
                                            />
                                        </SlipField>
                                        <SlipField
                                            id="bootcamp-address"
                                            label={bootcampFormFields.address}
                                            required
                                            error={errors.address?.message}
                                        >
                                            <input
                                                id="bootcamp-address"
                                                type="text"
                                                autoComplete="street-address"
                                                placeholder="গ্রাম/থানা, জেলা"
                                                {...form.register('address')}
                                                className={`${inputClasses} font-bangla ${
                                                    errors.address ? 'border-[#e5484d]/60' : ''
                                                }`}
                                            />
                                        </SlipField>
                                        <SlipField
                                            id="bootcamp-email"
                                            label={bootcampFormFields.email}
                                            required
                                            error={errors.email?.message}
                                        >
                                            <input
                                                id="bootcamp-email"
                                                type="email"
                                                autoComplete="email"
                                                placeholder="you@example.com"
                                                {...form.register('email')}
                                                className={`${inputClasses} font-mona ${
                                                    errors.email ? 'border-[#e5484d]/60' : ''
                                                }`}
                                            />
                                        </SlipField>
                                        <SlipField
                                            id="bootcamp-payment-last4"
                                            label={bootcampFormFields.paymentLast4}
                                            required
                                            error={errors.paymentLast4?.message}
                                        >
                                            <input
                                                id="bootcamp-payment-last4"
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={4}
                                                placeholder="যেমন: 4567"
                                                {...form.register('paymentLast4')}
                                                className={`${inputClasses} font-mona tracking-[0.4em] ${
                                                    errors.paymentLast4
                                                        ? 'border-[#e5484d]/60'
                                                        : ''
                                                }`}
                                            />
                                        </SlipField>
                                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-white/15 pt-5">
                                            <p className="font-bangla text-xs text-white/40">
                                                <span className="text-[#e5484d]">*</span> চিহ্নিত
                                                ঘরগুলো অবশ্যই পূরণ করতে হবে
                                            </p>
                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="inline-flex items-center gap-2 rounded-xl bg-[#ffd60a] px-6 py-3 font-bangla text-sm font-bold text-black shadow-[0_0_28px_rgba(255,214,10,0.3)] transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffd60a]"
                                            >
                                                {isLoading && (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                )}
                                                {isLoading ? 'পাঠানো হচ্ছে...' : 'রেজিস্ট্রেশন সম্পন্ন করুন'}
                                            </button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
};
