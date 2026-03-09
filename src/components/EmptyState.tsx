import { Sparkles } from 'lucide-react';
import { Button } from './ui/button';

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ 
  icon: Icon = Sparkles, 
  title, 
  description, 
  actionLabel, 
  onAction 
}: EmptyStateProps) {
  return (
    <div className="py-12 px-6 text-center">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mx-auto mb-4">
        <Icon className="w-10 h-10 text-blue-600" />
      </div>
      <h3 className="mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-6 max-w-sm mx-auto">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="rounded-full">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
