import { CalendarCheck, CalendarX } from 'lucide-react';

export default function EnrollmentFixed() {
    return (
        <div
            className="
        fixed bottom-5 left-5 
        bg-white bg-opacity-90 
        shadow-lg rounded-md 
        p-4 max-w-xs 
        font-bangla text-gray-700 
        text-sm font-medium
        z-50
      "
            style={{ backdropFilter: 'blur(6px)' }}
        >
            <div className="flex items-center gap-2 mb-2">
                <CalendarCheck size={20} className="text-green-600" />
                <p>
                    এনরোলমেন্ট শুরু: <span className="text-primary font-semibold">১০ সেপ্টেম্বর, ২০২৫</span>
                </p>
            </div>
            <div className="flex items-center gap-2">
                <CalendarX size={20} className="text-red-600" />
                <p>
                    এনরোলমেন্ট শেষ: <span className="text-primary font-semibold">৩০ সেপ্টেম্বর, ২০২৫</span>
                </p>
            </div>
        </div>
    );
}
