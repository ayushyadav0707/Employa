'use client';

import { useState } from 'react';
import { Plus, Trash2, Calendar as CalendarIcon, Clock, AlignLeft, User } from 'lucide-react';
import { createEvent, deleteEvent } from '@/app/actions/events';
import { useRouter } from 'next/navigation';

export default function EventsClient({ events, isAdmin }: { events: any[], isAdmin: boolean }) {
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await createEvent(formData);
    setLoading(false);
    if (res.success) {
      setIsAdding(false);
      router.refresh();
    } else {
      alert(res.error);
    }
  }

  async function handleDelete(id: string) {
    if(!confirm('Delete this event?')) return;
    setLoading(true);
    const res = await deleteEvent(id);
    setLoading(false);
    if (res.success) {
      router.refresh();
    } else {
      alert(res.error);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-[24px] border border-border shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events & Schedule</h1>
          <p className="text-[13px] text-gray-500 font-medium">Manage upcoming company events, holidays, and birthdays.</p>
        </div>
        {isAdmin && !isAdding && (
          <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 bg-primary text-black font-bold px-4 py-2 rounded-xl text-sm transition-colors hover:bg-[#e6b826]">
            <Plus className="w-4 h-4" /> Add Event
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white rounded-[24px] shadow-sm border border-border p-6 max-w-2xl">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Create New Event</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Event Title</label>
                <input type="text" name="title" required placeholder="e.g. John's Birthday" className="w-full border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Event Type</label>
                <select name="type" className="w-full border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary bg-white">
                  <option value="Meeting">Meeting</option>
                  <option value="Birthday">Birthday</option>
                  <option value="Holiday">Holiday</option>
                  <option value="Social">Social</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Date</label>
                <input type="date" name="eventDate" required className="w-full border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Time (Optional)</label>
                <input type="text" name="timeString" placeholder="e.g. All Day or 2:00 PM" className="w-full border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Description (Optional)</label>
              <textarea name="description" rows={2} className="w-full border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary resize-none"></textarea>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 rounded-xl text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200">Cancel</button>
              <button type="submit" disabled={loading} className="px-6 py-2 rounded-xl text-sm font-bold text-black bg-primary hover:bg-[#e6b826]">{loading ? 'Saving...' : 'Save Event'}</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-[24px] shadow-sm border border-border p-2">
        {events.length === 0 ? (
          <div className="text-center py-16">
            <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No upcoming events scheduled.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
            {events.map(event => (
              <div key={event.id} className="p-5 border border-border rounded-xl hover:shadow-md transition-shadow bg-gray-50/50 relative group">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-gray-900 text-[15px]">{event.title}</h3>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                    event.type === 'Birthday' ? 'bg-pink-100 text-pink-700' :
                    event.type === 'Holiday' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-primary/20 text-yellow-800'
                  }`}>
                    {event.type}
                  </span>
                </div>
                
                {event.description && (
                  <p className="text-[13px] text-gray-500 mb-4 font-medium flex items-start gap-2">
                    <AlignLeft className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    {event.description}
                  </p>
                )}
                
                <div className="flex items-center gap-4 text-[12px] font-bold text-gray-400 mt-auto pt-2">
                  <span className="flex items-center gap-1.5"><CalendarIcon className="w-3.5 h-3.5" /> {new Date(event.eventDate).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {event.timeString || 'All Day'}</span>
                </div>

                {isAdmin && (
                  <button 
                    onClick={() => handleDelete(event.id)}
                    disabled={loading}
                    className="absolute top-4 right-4 p-2 bg-white rounded-lg shadow-sm text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 border border-red-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
