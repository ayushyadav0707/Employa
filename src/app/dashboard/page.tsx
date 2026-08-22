import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Dayflow Dashboard</h1>
        <p className="text-gray-500 mb-8">You are logged in as <span className="font-semibold text-black">{session.role}</span></p>

        <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Your Session Data</h2>
          <pre className="text-sm text-gray-800 overflow-x-auto">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>

        <p className="text-sm text-gray-500 mb-8">
          Auth is 100% complete. We are now ready to build the Attendance tracking features!
        </p>

        {session.role === 'ADMIN' && (
          <div className="pt-6 border-t border-gray-100 flex justify-center">
            <a href="/dashboard/employees/create" className="bg-black text-white px-6 py-2.5 rounded-md font-medium hover:bg-gray-800 transition-colors">
              + Register New Employee
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
