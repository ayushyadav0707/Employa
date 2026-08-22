import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function ActivityPage() {
  const session = await getSession();
  if (!session) return null;

  const isAdmin = session.role === "ADMIN";

  const activities = await prisma.activityLog.findMany({
    where: isAdmin ? undefined : { userId: session.id },
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { name: true }
      }
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Activity Log</h1>
        <p className="text-gray-500">History of your actions and notifications.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {activities.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No activity found.</p>
        ) : (
          <div className="space-y-4">
            {activities.map(act => (
              <div key={act.id} className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${act.type === 'Success' ? 'bg-green-500' : act.type === 'Info' ? 'bg-blue-500' : 'bg-amber-500'}`}></div>
                  <p className="text-sm font-semibold text-gray-900">{act.message}</p>
                </div>
                <div className="text-xs text-gray-500 md:text-right">
                  {act.user?.name && <span className="mr-2">User: {act.user.name}</span>}
                  <span>{new Date(act.createdAt).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
