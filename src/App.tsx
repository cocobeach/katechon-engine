import React, { useState, useEffect } from 'react';
import { useStore } from './store/useStore';
import { Map } from './components/Map';
import { MinisterSidebar } from './components/MinisterSidebar';
import { Chat } from './components/Chat';
import { RSSFeedPanel } from './components/RSSFeedPanel';
import { PillarHealth } from './components/PillarHealth';
import { Settings } from './components/Settings';
import { Settings as SettingsIcon, FileText, Share2 } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';

function App() {
  const { currentTab, setCurrentTab, rssFeeds, addMapEvent } = useStore();
  const [showSettings, setShowSettings] = useState(false);
  const [rssPollingActive, setRssPollingActive] = useState(true);

  // Poll RSS feeds every 5 minutes
  useEffect(() => {
    if (!rssPollingActive) return;

    const pollFeeds = async () => {
      const enabledFeeds = rssFeeds.filter(feed => feed.enabled);
      
      for (const feed of enabledFeeds) {
        try {
          const items = await invoke<any[]>('fetch_rss_feed', { url: feed.url });
          
          for (const item of items) {
            // Try to get location from item or guess from title
            let lat = item.lat;
            let lng = item.lng;
            
            if (!lat || !lng) {
              try {
                const location = await invoke<[number, number]>('guess_location_from_text', {
                  text: item.title + ' ' + item.description,
                });
                [lat, lng] = location;
              } catch (e) {
                // Default location if guessing fails
                lat = 30.0;
                lng = -30.0;
              }
            }
            
            // Add event to map
            addMapEvent({
              id: `rss-${feed.url}-${item.link}`,
              title: item.title,
              description: item.description.substring(0, 500),
              lat,
              lng,
              date: item.published,
              source: feed.name,
              tier: 3, // Default to "Confused Normie" - will be updated by analysis
              pillarImpacts: {
                economy: 0,
                spirituality: 0,
                family: 0,
                education: 0,
                media: 0,
                legal: 0,
              },
              feedUrl: feed.url,
              link: item.link,
            });
          }
        } catch (error) {
          console.error(`Failed to fetch RSS feed ${feed.name}:`, error);
        }
      }
    };

    // Initial poll
    pollFeeds();

    // Poll every 5 minutes
    const interval = setInterval(pollFeeds, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [rssFeeds, rssPollingActive]);

  return (
    <div className="h-screen w-screen bg-black text-white flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="h-16 bg-gradient-to-r from-black via-amber-900/20 to-black border-b border-amber-500/50 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-amber-400 tracking-wider">KATECHON ENGINE</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentTab('map')}
              className={`px-4 py-2 rounded transition-colors ${
                currentTab === 'map'
                  ? 'bg-amber-600 text-black font-semibold'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Map View
            </button>
            <button
              onClick={() => setCurrentTab('persona-studio')}
              className={`px-4 py-2 rounded transition-colors ${
                currentTab === 'persona-studio'
                  ? 'bg-amber-600 text-black font-semibold'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Persona Studio
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-400">
            <span className="text-amber-400 font-semibold">Status:</span> Operational
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 hover:bg-amber-500/20 rounded transition-colors"
            title="Settings"
          >
            <SettingsIcon className="text-amber-400" size={20} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Ministers */}
        <MinisterSidebar />

        {/* Center - Map or Persona Studio */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {currentTab === 'map' ? (
            <div className="flex-1 relative">
              <Map />
            </div>
          ) : (
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-amber-400 mb-6">Persona Studio</h2>
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-6">
                  <p className="text-gray-300 mb-4">
                    The Persona Studio allows you to create custom AI personas based on specific authors, 
                    books, or ideological frameworks. This feature will be available in a future release.
                  </p>
                  <p className="text-gray-400 text-sm">
                    For the MVP, you can use the seven default Ministers who embody the composite wisdom of:
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-gray-300">
                    <li>• <strong>Yuri Bezmenov</strong> - Four-stage ideological subversion detection</li>
                    <li>• <strong>Alexander Solzhenitsyn</strong> - Texture of ideological capture</li>
                    <li>• <strong>Anthony C. Sutton</strong> - Financial-technological transfer mechanisms</li>
                    <li>• <strong>Eustace Mullins</strong> - Central banking as occult control</li>
                    <li>• <strong>Thomas Sowell</strong> - Empirical counter-force</li>
                    <li>• <strong>Carl Schmitt</strong> - The Katechon concept itself</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - RSS Feeds, Pillar Health, and Chat */}
        <div className="w-96 flex flex-col gap-4 p-4 bg-black/50 border-l border-amber-500/30 overflow-hidden">
          {/* RSS Feeds */}
          <div className="h-64 overflow-hidden">
            <RSSFeedPanel />
          </div>

          {/* Pillar Health */}
          <div className="flex-shrink-0">
            <PillarHealth />
          </div>

          {/* Chat */}
          <div className="flex-1 min-h-0">
            <Chat />
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
    </div>
  );
}

export default App;
