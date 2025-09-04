export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <h2 className="mt-4 text-lg font-medium text-gray-900">
              Loading...
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Please wait while we load the content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
