import React from 'react';
import { useStore } from '../store/useStore';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const MinisterSidebar: React.FC = () => {
  const { ministers, activeMinisterIds, toggleMinister, sidebarCollapsed, toggleSidebar } = useStore();

  return (
    <div className={`relative bg-black/90 border-r border-amber-500/30 transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-4 bg-amber-600 hover:bg-amber-700 rounded-full p-1 transition-colors z-10"
      >
        {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <div className="p-4">
        {!sidebarCollapsed && (
          <h2 className="text-amber-400 font-bold text-lg mb-4">The Seven Ministers</h2>
        )}

        <div className="space-y-3">
          {ministers.map(minister => {
            const isActive = activeMinisterIds.includes(minister.id);
            
            return (
              <button
                key={minister.id}
                onClick={() => toggleMinister(minister.id)}
                className={`w-full p-3 rounded-lg border-2 transition-all ${
                  isActive
                    ? `border-${minister.color} bg-amber-500/20 shadow-lg shadow-amber-500/50`
                    : 'border-gray-700 hover:border-amber-500/50 bg-gray-900/50'
                }`}
                style={{
                  borderColor: isActive ? minister.color : undefined,
                  boxShadow: isActive ? `0 0 20px ${minister.color}40` : undefined,
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{minister.avatar}</div>
                  {!sidebarCollapsed && (
                    <div className="flex-1 text-left">
                      <div className="text-white font-semibold text-sm">{minister.name}</div>
                      <div className="text-gray-400 text-xs capitalize">{minister.pillar}</div>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {!sidebarCollapsed && (
          <div className="mt-6 p-3 bg-amber-500/10 border border-amber-500/30 rounded">
            <p className="text-xs text-amber-400/80">
              <strong>Toggle ministers</strong> to include them in the analysis. Multiple ministers can debate together.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
