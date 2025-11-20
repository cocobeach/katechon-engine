import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useStore } from '../store/useStore';
import { Send } from 'lucide-react';

const INITIAL_EVENTS = [
  {
    id: '1',
    title: 'The Titanic Sinks',
    description: 'On board: John Jacob Astor IV, Benjamin Guggenheim, Isidor Straus. All wealthy. All opposed to the creation of a central bank. J.P. Morgan owned the ship. He canceled last minute. They didn\'t. The resistance sank. The system rose.',
    lat: 41.7325,
    lng: -49.9469,
    date: '1912-04-15',
    source: 'Historical',
    tier: 0,
    pillarImpacts: { economy: -15, spirituality: -5, family: -5, education: 0, media: 0, legal: -10 },
  },
  {
    id: '2',
    title: 'The Federal Reserve Created',
    description: 'Not federal. No reserves. A private banking cartel now controls America\'s money. They print. They lend. You owe. The U.S. dollar became a tool. And your time became their interest.',
    lat: 38.8951,
    lng: -77.0364,
    date: '1913-12-23',
    source: 'Historical',
    tier: 0,
    pillarImpacts: { economy: -15, spirituality: 0, family: -5, education: 0, media: 0, legal: -15 },
  },
  {
    id: '3',
    title: 'IRS Established',
    description: 'The same year they took over money... They started taxing your income. You work. They print. You pay them back... With interest. It\'s not about funding government. It\'s about keeping you in the system.',
    lat: 38.8951,
    lng: -77.0364,
    date: '1913-10-03',
    source: 'Historical',
    tier: 0,
    pillarImpacts: { economy: -10, spirituality: 0, family: -5, education: 0, media: 0, legal: -10 },
  },
  {
    id: '4',
    title: 'Rockefeller Foundation Established',
    description: 'The oil kings go "philanthropic." The Rockefeller Foundation begins reshaping: Medicine, Education, Science, World health. They didn\'t donate money. They bought influence. Result? People are sicker and more dependent than ever.',
    lat: 40.7589,
    lng: -73.9851,
    date: '1913-05-14',
    source: 'Historical',
    tier: 1,
    pillarImpacts: { economy: -5, spirituality: -5, family: -5, education: -10, media: -5, legal: 0 },
  },
  {
    id: '5',
    title: 'American Cancer Society Founded',
    description: 'Marketed as charity. But tied to the same forces pushing: Patented drugs, Industrial food, Fear, Chemotherapy (came from war chemicals that were later banned in wars). They built the cancer industry. Not a cure.',
    lat: 40.7589,
    lng: -73.9851,
    date: '1913-05-22',
    source: 'Historical',
    tier: 1,
    pillarImpacts: { economy: -5, spirituality: -3, family: -8, education: -5, media: -5, legal: 0 },
  },
];

export const Map: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  const { mapEvents, addMapEvent, setSelectedEvent, selectedEvent } = useStore();

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'carto-dark': {
            type: 'raster',
            tiles: [
              'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
              'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
              'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
            ],
            tileSize: 256,
          },
        },
        layers: [
          {
            id: 'carto-dark-layer',
            type: 'raster',
            source: 'carto-dark',
            minzoom: 0,
            maxzoom: 22,
          },
        ],
      },
      center: [-20, 30],
      zoom: 2,
      pitch: 45,
      bearing: 0,
    });

    map.current.on('load', () => {
      setMapLoaded(true);
      
      // Add initial historical events
      INITIAL_EVENTS.forEach(event => addMapEvent(event));
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  // Add markers for events
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing markers
    const existingMarkers = document.querySelectorAll('.custom-marker');
    existingMarkers.forEach(marker => marker.remove());

    // Add markers for all events
    mapEvents.forEach((event) => {
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.cssText = `
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: ${getTierColor(event.tier)};
        border: 2px solid ${getTierBorderColor(event.tier)};
        cursor: pointer;
        box-shadow: 0 0 20px ${getTierColor(event.tier)}80;
        transition: all 0.3s ease;
      `;
      
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.3)';
        el.style.boxShadow = `0 0 30px ${getTierColor(event.tier)}`;
      });
      
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
        el.style.boxShadow = `0 0 20px ${getTierColor(event.tier)}80`;
      });

      el.addEventListener('click', () => {
        setSelectedEvent(event);
      });

      new maplibregl.Marker({ element: el })
        .setLngLat([event.lng, event.lat])
        .addTo(map.current!);
    });
  }, [mapEvents, mapLoaded]);

  const getTierColor = (tier: number): string => {
    const colors = [
      '#FF0000', // Tier 0: Terrorist/Accelerationist
      '#FF4500', // Tier 1: Controlled Chaos Agent
      '#FF8C00', // Tier 2: Useful Idiot
      '#FFA500', // Tier 3: Confused Normie
      '#FFD700', // Tier 4-6: Right but Lazy → Competent
      '#ADFF2F', // Tier 7-8: Insightful → Vigilant
      '#00FF00', // Tier 9: Genius/True Katechon
    ];
    
    if (tier <= 0) return colors[0];
    if (tier === 1) return colors[1];
    if (tier === 2) return colors[2];
    if (tier === 3) return colors[3];
    if (tier <= 6) return colors[4];
    if (tier <= 8) return colors[5];
    return colors[6];
  };

  const getTierBorderColor = (tier: number): string => {
    return tier <= 2 ? '#8B0000' : tier <= 6 ? '#FFD700' : '#00FF00';
  };

  const handleSendToAnalysis = () => {
    if (selectedEvent) {
      // This will be handled by the chat component
      const event = new CustomEvent('sendToAnalysis', { detail: selectedEvent });
      window.dispatchEvent(event);
    }
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      
      {selectedEvent && (
        <div className="absolute top-4 left-4 bg-black/90 border border-amber-500/50 rounded-lg p-4 max-w-md backdrop-blur-sm">
          <h3 className="text-amber-400 font-bold text-lg mb-2">{selectedEvent.title}</h3>
          <p className="text-gray-300 text-sm mb-2">{selectedEvent.description}</p>
          <div className="text-xs text-gray-400 mb-3">
            <div>Date: {selectedEvent.date}</div>
            <div>Source: {selectedEvent.source}</div>
            <div className="mt-2">
              <span className="font-semibold">Tier {selectedEvent.tier}</span>
              <span className={`ml-2 px-2 py-1 rounded ${
                selectedEvent.tier <= 2 ? 'bg-red-900/50 text-red-300' :
                selectedEvent.tier <= 6 ? 'bg-yellow-900/50 text-yellow-300' :
                'bg-green-900/50 text-green-300'
              }`}>
                {selectedEvent.tier === 0 ? 'Terrorist/Accelerationist' :
                 selectedEvent.tier === 1 ? 'Controlled Chaos Agent' :
                 selectedEvent.tier === 2 ? 'Useful Idiot' :
                 selectedEvent.tier === 3 ? 'Confused Normie' :
                 selectedEvent.tier <= 6 ? 'Competent' :
                 selectedEvent.tier <= 8 ? 'Vigilant' : 'True Katechon'}
              </span>
            </div>
          </div>
          
          <div className="mb-3">
            <div className="text-xs font-semibold text-amber-400 mb-1">Pillar Impacts:</div>
            <div className="grid grid-cols-2 gap-1 text-xs">
              {Object.entries(selectedEvent.pillarImpacts).map(([pillar, impact]) => (
                <div key={pillar} className="flex justify-between">
                  <span className="capitalize text-gray-400">{pillar}:</span>
                  <span className={impact < 0 ? 'text-red-400' : 'text-green-400'}>
                    {impact > 0 ? '+' : ''}{impact}%
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <button
            onClick={handleSendToAnalysis}
            className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-black font-semibold py-2 px-4 rounded transition-colors"
          >
            <Send size={16} />
            Send to Analysis
          </button>
          
          <button
            onClick={() => setSelectedEvent(null)}
            className="w-full mt-2 bg-gray-700 hover:bg-gray-600 text-white py-1 px-4 rounded text-sm transition-colors"
          >
            Close
          </button>
        </div>
      )}
      
      <div className="absolute bottom-4 right-4 bg-black/90 border border-amber-500/50 rounded-lg p-3 backdrop-blur-sm">
        <div className="text-xs text-gray-400 mb-1">Legend:</div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-600 border-2 border-red-900"></div>
            <span className="text-gray-300">Tier 0-1: Dangerous</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-orange-500 border-2 border-orange-900"></div>
            <span className="text-gray-300">Tier 2-3: Misguided</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-400 border-2 border-yellow-600"></div>
            <span className="text-gray-300">Tier 4-6: Competent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-400 border-2 border-green-600"></div>
            <span className="text-gray-300">Tier 7-9: Katechon</span>
          </div>
        </div>
      </div>
    </div>
  );
};
