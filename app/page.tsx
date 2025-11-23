export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col items-center justify-center py-32 px-16 bg-white dark:bg-black">
        <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-6">TinyURL</h1>
        <a href="/dashboard" className="inline-block">
          <button className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">Go to dashboard</button>
        </a>
      </main>
    </div>
  );
}
