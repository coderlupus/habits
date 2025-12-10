'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const AddRecommendedButton = ({ habitName, onAddHabit }) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center active:bg-blue-200"
      onClick={() => onAddHabit(habitName)}
    >
      <Plus className="w-5 h-5" />
    </Button>
  );
};

export default AddRecommendedButton;
