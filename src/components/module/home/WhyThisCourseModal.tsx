import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function WhyThisCourseModal({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-full max-w-5xl aspect-[15.15/9] p-0 rounded-none">
        <DialogHeader className="sr-only">
          <DialogTitle>Misun Academy</DialogTitle>
          <DialogDescription>
            কোর্সটি কেন করবেন?
          </DialogDescription>
        </DialogHeader>
        <iframe
          className="w-full h-full"
          src="https://www.youtube.com/embed/JDYJwp8nbew?si=vEdGzIzqKMfBYo23&amp;start=1"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </DialogContent>
    </Dialog>
  );
}
