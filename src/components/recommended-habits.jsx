'use client';

import { recommendedHabits } from '@/data/recommended-habits';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, GlassWater, Footprints, BrainCircuit, Plus } from 'lucide-react';

const iconComponents = {
  BookOpen,
  GlassWater,
  Footprints,
  BrainCircuit,
};

const RecommendedHabits = ({ onAddHabit }) => {
  return (
    <div className="mt-8">
      <h3 className="font-bold text-lg text-gray-900 mb-3">Recommended for you</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {recommendedHabits.map((habit) => {
          const Icon = iconComponents[habit.icon] || Footprints;
          return (
            <Card key={habit.id} className="p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-11 h-11 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                  <Icon className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{habit.name}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center active:bg-blue-200"
                onClick={() => onAddHabit(habit.name)}
              >
                <Plus className="w-5 h-5" />
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default RecommendedHabits;
