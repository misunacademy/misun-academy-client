export default function CourseDetailLoading() {
    return (
        <div className="flex min-h-[60vh] items-center justify-center">
            <div className="space-y-4 text-center">
                <div className="relative h-16 w-16 mx-auto">
                    <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                </div>
                <p className="text-muted-foreground">কোর্স লোড হচ্ছে...</p>
            </div>
        </div>
    );
}
