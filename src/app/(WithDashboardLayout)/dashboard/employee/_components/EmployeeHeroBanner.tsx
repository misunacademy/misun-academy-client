'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Briefcase, CheckCircle, ShieldCheck } from 'lucide-react';

interface Props {
    name: string;
    email: string;
    avatarUrl?: string;
    initials: string;
    jobTitle?: string;
}

export function EmployeeHeroBanner({ name, email, avatarUrl, initials, jobTitle }: Props) {
    return (
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-400 p-6 md:p-8 shadow-lg">
            {/* decorative circles */}
            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10" />
            <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-white/10" />
            <div className="absolute top-4 right-24 w-16 h-16 rounded-full bg-white/5" />

            <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                    <Avatar className="w-20 h-20 ring-4 ring-white/50 shadow-xl">
                        <AvatarImage src={avatarUrl} alt={name} />
                        <AvatarFallback className="text-xl font-bold bg-white/20 text-white">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-300 border-2 border-white flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-emerald-700" />
                    </div>
                </div>

                {/* Info */}
                <div className="text-white min-w-0">
                    <h1 className="text-2xl md:text-3xl font-extrabold leading-tight truncate">
                        {name}
                    </h1>
                    <p className="text-emerald-100 text-sm mt-0.5 truncate">{email}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                        <Badge className="bg-white/20 text-white border-white/30 text-xs hover:bg-white/30">
                            <Briefcase className="w-3 h-3 mr-1" />
                            {jobTitle || 'Employee'}
                        </Badge>
                        <Badge className="bg-white/20 text-white border-white/30 text-xs hover:bg-white/30">
                            <ShieldCheck className="w-3 h-3 mr-1" />
                            Active Employee
                        </Badge>
                    </div>
                </div>
            </div>
        </div>
    );
}
