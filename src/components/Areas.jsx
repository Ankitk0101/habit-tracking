import React, { useState } from 'react';

function Areas() {
  const [areas, setAreas] = useState([
    { id: 1, name: 'Health', color: 'bg-red-500', habits: 4 },
    { id: 2, name: 'Productivity', color: 'bg-blue-500', habits: 3 },
    { id: 3, name: 'Learning', color: 'bg-green-500', habits: 2 },
  ]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Areas</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {areas.map(area => (
          <div key={area.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <div className={`${area.color} w-12 h-12 rounded-full flex items-center justify-center text-white mb-4`}>
              <span className="text-xl font-bold">{area.name.charAt(0)}</span>
            </div>
            <h3 className="text-lg font-semibold">{area.name}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {area.habits} {area.habits === 1 ? 'habit' : 'habits'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Areas;