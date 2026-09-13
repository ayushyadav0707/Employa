import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import EventsClient from "./EventsClient";

export default async function EventsPage() {
  const session = await getSession();
  if (!session) return null;

  const events = await prisma.event.findMany({
    orderBy: { eventDate: 'asc' },
  });

  return <EventsClient events={events} isAdmin={session.role === 'ADMIN'} />;
}
