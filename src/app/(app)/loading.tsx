export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full min-h-[50vh] animate-in fade-in duration-500">
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
      <p className="text-gray-400 font-bold text-sm tracking-widest uppercase">Loading</p>
    </div>
  );
}
