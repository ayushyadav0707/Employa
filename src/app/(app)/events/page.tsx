import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function EventsPage() {
  const session = await getSession();
  if (!session) return null;

  const events = await prisma.event.findMany({
    orderBy: { eventDate: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Events</h1>
        <p className="text-gray-500">Upcoming company events and schedule.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {events.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No events found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map(event => (
              <div key={event.id} className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-900">{event.title}</h3>
                  <span className="text-xs font-semibold px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md">
                    {event.type}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-4">{event.description}</p>
                <div className="text-xs font-semibold text-gray-400">
                  {new Date(event.eventDate).toLocaleDateString()} at {event.timeString || 'All Day'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
