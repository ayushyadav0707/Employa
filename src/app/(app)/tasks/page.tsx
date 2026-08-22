import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function TasksPage() {
  const session = await getSession();
  if (!session) return null;

  const isAdmin = session.role === "ADMIN";
  
  const tasks = await prisma.task.findMany({
    where: isAdmin ? { user: { role: 'ADMIN' } } : { userId: session.id },
    orderBy: { dueDate: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
        <p className="text-gray-500">Manage your pending tasks and priorities.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {tasks.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No tasks found.</p>
        ) : (
          <div className="space-y-4">
            {tasks.map(task => (
              <div key={task.id} className="p-4 border border-gray-100 rounded-lg flex justify-between items-center hover:bg-gray-50">
                <div>
                  <h3 className="font-bold text-gray-900">{task.title}</h3>
                  <p className="text-sm text-gray-500">{task.category}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold px-2 py-1 bg-gray-100 rounded-md mr-4">
                    {task.status}
                  </span>
                  <span className="text-sm text-gray-500">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
