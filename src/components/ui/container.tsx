import { cn } from '@/lib/utils';

interface IProps {
  children: React.ReactNode;
  className?: string;
}

export default function Container({ children, className }: IProps) {
  return (
    <div className={cn('container mx-auto', className)}>{children}</div>
  );
}
