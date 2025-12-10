import { getHabits } from '@/lib/firestore';
import HabitListClient from './habit-list-client';

export default async function HabitListServer({ userId }) {
  // Simular um delay para demonstrar o streaming (remova em produção)
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const habits = await getHabits(userId);
  
  return <HabitListClient habits={habits} userId={userId} />;
}