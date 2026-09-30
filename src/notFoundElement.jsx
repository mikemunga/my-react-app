import { Link } from 'react-router'; 

export const NotFoundElement = (
  <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-12 text-center">
    <div 
      className="flex w-full max-w-md flex-col items-center"
      role="status"
      aria-live="polite"
    >
    
      <span className="text-6xl font-extrabold tracking-tight text-slate-300 dark:text-slate-800" aria-hidden="true">
        404
      </span>

      
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
        Page Not Found
      </h1>
      
      <p className="mt-2 text-base leading-relaxed text-slate-500 dark:text-slate-400">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>

      <div className="mt-8">
        <Link 
          to="/" 
          className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm transition-colors hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200 dark:focus-visible:outline-slate-50"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  </main>
);
