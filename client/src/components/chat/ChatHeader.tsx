import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface ChatHeaderProps {
  title: string;
  subtitle?: string;
  avatarUrl?: string;
  isOnline?: boolean;
  onBack?: () => void;
  backHref?: string;
  className?: string;
  rightContent?: React.ReactNode;
}

export const ChatHeader = ({
  title,
  subtitle,
  avatarUrl,
  isOnline,
  onBack,
  backHref,
  className,
  rightContent,
}: ChatHeaderProps) => {
  const backButton = (
    <button
      onClick={onBack}
      className="p-1 rounded-full hover:bg-gray-100 mr-2"
      aria-label="Go back"
    >
      <ArrowLeft className="h-5 w-5 text-gray-600" />
    </button>
  );

  return (
    <div className={cn(
      'flex items-center p-4 border-b border-gray-100 bg-white',
      className
    )}>
      {(onBack || backHref) && (
        backHref ? (
          <Link href={backHref} className="mr-2">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
        ) : (
          backButton
        )
      )}
      
      <div className="relative mr-3">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={title}
            width={40}
            height={40}
            className="rounded-full object-cover border border-gray-200"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-[#004B93] flex items-center justify-center text-white">
            {title.charAt(0).toUpperCase()}
          </div>
        )}
        {isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <h2 className="font-semibold text-gray-900 text-sm truncate">{title}</h2>
        {subtitle && (
          <p className="text-xs text-gray-500 truncate">{subtitle}</p>
        )}
      </div>
      
      {rightContent && (
        <div className="ml-2">
          {rightContent}
        </div>
      )}
    </div>
  );
};
