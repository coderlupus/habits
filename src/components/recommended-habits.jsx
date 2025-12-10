import { recommendedHabits } from '@/data/recommended-habits';
import { Card } from '@/components/ui/card';
import { BookOpen, GlassWater, Footprints, BrainCircuit } from 'lucide-react';
import AddRecommendedButton from './add-recommended-button';

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
              <AddRecommendedButton habitName={habit.name} onAddHabit={onAddHabit} />
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default RecommendedHabits;
