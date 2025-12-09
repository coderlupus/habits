import { getHabits, addHabit } from '@/lib/firestore';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');
    const searchTerm = searchParams.get('search');

    if (!uid) {
        return new Response(JSON.stringify({ error: 'User not found' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const habits = await getHabits(uid);

        if (searchTerm) {
            const filteredHabits = habits.filter((habit) =>
                habit.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            return new Response(JSON.stringify(filteredHabits), {
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify(habits), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch habits' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

export async function POST(request) {
    const { uid, habit } = await request.json();

    if (!uid || !habit) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        await addHabit(uid, habit);
        return new Response(JSON.stringify({ message: 'Habit added successfully' }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to add habit' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}