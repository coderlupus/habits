import { getHabit } from '@/lib/firestore';
import { getCurrentUser } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Target, Calendar, CheckCircle, Droplet, Footprints, Leaf } from 'lucide-react';

const habitIcons = {
  water: <Droplet className="w-8 h-8 text-blue-500" />,
  walk: <Footprints className="w-8 h-8 text-orange-500" />,
  run: <Footprints className="w-8 h-8 text-orange-500" />,
  plant: <Leaf className="w-8 h-8 text-green-500" />,
  read: <Droplet className="w-8 h-8 text-purple-500" />,
  default: <Target className="w-8 h-8 text-gray-500" />
};

const getHabitIcon = (name) => {
  const lowerCaseName = name.toLowerCase();
  for (const key in habitIcons) {
    if (lowerCaseName.includes(key)) {
      return habitIcons[key];
    }
  }
  return habitIcons.default;
};

export default async function HabitPage({ params }) {
  const { id } = params;
  const user = await getCurrentUser();

  if (!user || !user.id) {
    return <div className="p-4">Usuário não autenticado.</div>;
  }

  const habit = await getHabit(user.id, id);

  if (!habit) {
    return (
        <div className="p-4">
            <h1 className="text-xl font-bold">Hábito não encontrado.</h1>
            <p className="text-sm text-gray-500 mt-4">Isso acontece porque o ID do usuário usado na busca não corresponde ao "dono" do hábito no banco de dados.</p>
            <div className="mt-2 p-2 bg-gray-100 rounded text-xs text-gray-700">
                <p><strong>ID do Hábito (URL):</strong> {id}</p>
                <p><strong>ID do Usuário (usado na busca):</strong> {user.id}</p>
            </div>
            <p className="text-sm text-gray-500 mt-2">Verifique o ID de usuário no seu Firebase Authentication e atualize o arquivo <code>src/lib/auth.js</code>.</p>
        </div>
    );
  }

  const progressPercentage = habit.goal > 0 ? (habit.progress / habit.goal) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/main">
            <Button variant="ghost" className="text-gray-600 hover:bg-gray-200">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para a lista
            </Button>
          </Link>
        </div>

        <Card className="overflow-hidden rounded-2xl shadow-lg border-none bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="p-6 bg-white border-b border-gray-100">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                {getHabitIcon(habit.name)}
              </div>
              <div>
                <CardTitle className="text-3xl font-extrabold tracking-tight text-gray-900">{habit.name}</CardTitle>
                <CardDescription className="text-lg text-gray-500 mt-1">
                  Meta diária: {habit.goal} {habit.goal > 1 ? 'vezes' : 'vez'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-8">
            {/* Progress Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Progresso Hoje</h3>
              <div className="flex items-center gap-4">
                <span className="font-bold text-2xl text-indigo-600">{habit.progress}</span>
                <div className="flex-grow">
                  <Progress value={progressPercentage} className="h-3" />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0</span>
                    <span>{habit.goal}</span>
                  </div>
                </div>
              </div>
               {habit.progress >= habit.goal && (
                <div className="mt-4 flex items-center gap-2 text-green-600 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-5 w-5" />
                  <p className="font-semibold">Parabéns! Você completou sua meta de hoje.</p>
                </div>
              )}
            </div>

            {/* History Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-gray-500" />
                Histórico de Conclusão
              </h3>
              {habit.history && habit.history.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {habit.history.map((entry, index) => (
                    <div key={index} className="flex flex-col items-center justify-center p-3 bg-green-100 rounded-lg text-green-800">
                      <span className="font-bold text-lg">
                        {new Date(entry.date).toLocaleDateString('pt-BR', { day: '2-digit' })}
                      </span>
                      <span className="text-xs">
                        {new Date(entry.date).toLocaleDateString('pt-BR', { month: 'short' })}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 px-4 bg-gray-100 rounded-lg">
                  <p className="text-gray-500">Ainda não há dias completos no histórico.</p>
                  <p className="text-gray-400 text-sm mt-1">Continue focado para construir uma sequência!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
