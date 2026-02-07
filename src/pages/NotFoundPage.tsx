import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-md text-center">
        <p className="text-6xl font-extrabold text-indigo-600">404</p>
        <h1 className="mt-4 text-2xl font-semibold text-gray-900">
          Page not found
        </h1>
        <p className="mt-3 text-sm text-gray-600">
          Sorry, we couldn&rsquo;t find the page you&rsquo;re looking for.
          It might have been removed or the URL may be incorrect.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-block rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  )
}
