import { CreditCard, Smartphone } from "lucide-react";

export const isEnrollmentRunning = true; // start/end

export const enrollmentPeriod = {
    startDate: "০১ ফেব্রুয়ারি, ২০২৬",  // enrollment start
    endDate: "২০ ফেব্রুয়ারি, ২০২৬",   // enrollment end
    classStart: "২৫ ফেব্রুয়ারি, ২০২৬" // class start
};

export const enrollmentData = {
    courseFee: {
        bdt: 4000,
        inr: 3200,
    },
    startDate: "2025-09-01T00:00:00+06:00", // enrollment start
    endDate: "2025-09-20T23:59:59+06:00", // enrollment end
    support: {
        facebook: "https://www.facebook.com/misunacademy",
        youtube: "https://www.youtube.com/@misunacademy",
        supportNumber: "01970713708",
        whatsappNumber: "01785542422",
    },
};


export const courseInfo = {
    title: "Complete Graphic Design With Freelancing (Batch-05)",
    subtitle: "From Beginner to Professional Designer",
    shortDescription: "Master Adobe Photoshop and Illustrator with hands-on projects and real-world examples. Learn professional design techniques and start your freelancing career.",
    thumbnailImage: "/images/course-thumbnail.jpg", // Add a default thumbnail path
    price: 4000,
    duration: "4 months",
    durationEstimate: "4", // Add duration estimate as string
    instructor: "Mithun Sarkar",
    features: [
        "50+ hours of premium design tutorials",
        "Hands-on projects with real-world examples",
        "Lifetime access to course materials",
        "Certificate of completion",
        "1-on-1 mentorship sessions",
        "Job placement assistance",
    ],
    highlights: [
        "Adobe Photoshop",
        "Adobe Illustrator"
    ],
};


export const paymentMethods = [
    {
        id: "SSLCommerz",
        name: "SSLCommerz",
        description: "Pay with bKash, Rocket, Nagad, bank, or others",
        icon: CreditCard,
        popular: true,
    },
    {
        id: "phonePay",
        name: "Phone Pay",
        description: "Pay with your phone pay account",
        icon: Smartphone,
        color: "text-pink-600",
    }
];

export const paymentInfo = {
    phoneNumber: "+91 9123944746",
    recipientName: "Khokon Sarkar",
    amount: 3000,
    currency: "INR",
    instructions: [
        "Open your PhonePe app",
        "Send money to the number above",
        "Enter the exact amount: BDT 3,000",
        "Add reference: 'MA-5'",
        "Complete the payment",
        "Fill in your payment details below"
    ]
};
