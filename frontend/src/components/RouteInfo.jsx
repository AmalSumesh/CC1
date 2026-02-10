export default function RouteInfo({ visitOrder, totalDistance, totalDuration }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-4 text-gray-800">Route Information</h3>
      
      {totalDistance && totalDuration && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 font-semibold">Total Distance</p>
              <p className="text-2xl font-bold text-blue-600">{totalDistance} km</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-semibold">Estimated Time</p>
              <p className="text-2xl font-bold text-blue-600">{totalDuration} mins</p>
            </div>
          </div>
        </div>
      )}

      <div>
        <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
          <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm">
            📋
          </span>
          Visit Order ({visitOrder?.length || 0} stops)
        </h4>
        <ol className="space-y-2">
          {visitOrder && visitOrder.length > 0 ? (
            visitOrder.map((bin, index) => (
              <li 
                key={bin} 
                className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <span className="bg-green-500 text-white rounded-full w-7 h-7 flex items-center justify-center mr-3 font-semibold text-sm">
                  {index + 1}
                </span>
                <span className="text-gray-700 font-semibold">{bin}</span>
              </li>
            ))
          ) : (
            <li className="text-gray-500 italic">No dustbins in route</li>
          )}
        </ol>
      </div>
    </div>
  )
}
