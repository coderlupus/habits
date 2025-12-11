import { Card } from '@/components/ui/card';

export default function HabitListSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="p-4 rounded-2xl shadow-sm border border-gray-100 animate-pulse">
          <div className="flex items-center">
            <div className="w-11 h-11 bg-gray-200 rounded-lg mr-4"></div>
            <div className="flex-grow space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="flex space-x-2">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}