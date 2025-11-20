import React from 'react';
import { useStore } from '../store/useStore';

export const PillarHealth: React.FC = () => {
  const { pillarsHealth } = useStore();

  const pillars = [
    { key: 'economy', name: 'Economy', icon: '💰', color: '#FFD700' },
    { key: 'spirituality', name: 'Spirituality', icon: '✝️', color: '#87CEEB' },
    { key: 'family', name: 'Family', icon: '👨‍👩‍👧‍👦', color: '#FF69B4' },
    { key: 'education', name: 'Education', icon: '📚', color: '#9370DB' },
    { key: 'media', name: 'Media', icon: '📰', color: '#FF6347' },
    { key: 'legal', name: 'Legal', icon: '⚖️', color: '#4169E1' },
  ];

  const getHealthColor = (health: number): string => {
    if (health >= 70) return '#00FF00';
    if (health >= 40) return '#FFD700';
    if (health >= 20) return '#FF8C00';
    return '#FF0000';
  };

  return (
    <div className="bg-black/80 border border-amber-500/30 rounded-lg p-4">
      <h3 className="text-amber-400 font-bold mb-4">Six Pillars Health</h3>
      
      <div className="space-y-3">
        {pillars.map(pillar => {
          const health = pillarsHealth[pillar.key as keyof typeof pillarsHealth];
          
          return (
            <div key={pillar.key} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{pillar.icon}</span>
                  <span className="text-sm font-semibold text-gray-300">{pillar.name}</span>
                </div>
                <span className="text-sm font-bold" style={{ color: getHealthColor(health) }}>
                  {health}%
                </span>
              </div>
              
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-500 ease-out"
                  style={{
                    width: `${health}%`,
                    backgroundColor: getHealthColor(health),
                    boxShadow: `0 0 10px ${getHealthColor(health)}80`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded">
        <p className="text-xs text-amber-400/80">
          Pillar health changes based on analyzed content. High-tier content heals pillars, low-tier content damages them.
        </p>
      </div>
    </div>
  );
};
