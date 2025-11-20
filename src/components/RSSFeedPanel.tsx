import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Rss, ChevronDown, ChevronRight, Plus } from 'lucide-react';

export const RSSFeedPanel: React.FC = () => {
  const { rssFeeds, toggleRSSFeed, addRSSFeed } = useStore();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['Alternative', 'Mainstream', 'Government']));
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFeed, setNewFeed] = useState({ url: '', name: '', category: 'Custom' });

  const categories = Array.from(new Set(rssFeeds.map(feed => feed.category)));

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const handleAddFeed = () => {
    if (newFeed.url && newFeed.name) {
      addRSSFeed({
        ...newFeed,
        enabled: true,
        color: '#' + Math.floor(Math.random()*16777215).toString(16),
      });
      setNewFeed({ url: '', name: '', category: 'Custom' });
      setShowAddForm(false);
    }
  };

  return (
    <div className="bg-black/80 border border-amber-500/30 rounded-lg p-4 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Rss className="text-amber-400" size={20} />
          <h3 className="text-amber-400 font-bold">RSS Feeds</h3>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="p-1 hover:bg-amber-500/20 rounded transition-colors"
          title="Add RSS Feed"
        >
          <Plus className="text-amber-400" size={18} />
        </button>
      </div>

      {showAddForm && (
        <div className="mb-4 p-3 bg-gray-900/50 border border-amber-500/20 rounded">
          <input
            type="text"
            placeholder="Feed Name"
            value={newFeed.name}
            onChange={(e) => setNewFeed({ ...newFeed, name: e.target.value })}
            className="w-full mb-2 px-2 py-1 bg-black/50 border border-amber-500/30 rounded text-white text-sm"
          />
          <input
            type="text"
            placeholder="Feed URL"
            value={newFeed.url}
            onChange={(e) => setNewFeed({ ...newFeed, url: e.target.value })}
            className="w-full mb-2 px-2 py-1 bg-black/50 border border-amber-500/30 rounded text-white text-sm"
          />
          <input
            type="text"
            placeholder="Category"
            value={newFeed.category}
            onChange={(e) => setNewFeed({ ...newFeed, category: e.target.value })}
            className="w-full mb-2 px-2 py-1 bg-black/50 border border-amber-500/30 rounded text-white text-sm"
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddFeed}
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-black font-semibold py-1 px-3 rounded text-sm transition-colors"
            >
              Add
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-1 px-3 rounded text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {categories.map(category => {
          const categoryFeeds = rssFeeds.filter(feed => feed.category === category);
          const isExpanded = expandedCategories.has(category);
          
          return (
            <div key={category} className="border border-amber-500/20 rounded">
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center justify-between p-2 hover:bg-amber-500/10 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {isExpanded ? <ChevronDown size={16} className="text-amber-400" /> : <ChevronRight size={16} className="text-amber-400" />}
                  <span className="text-amber-400 font-semibold text-sm">{category}</span>
                  <span className="text-gray-500 text-xs">({categoryFeeds.length})</span>
                </div>
              </button>
              
              {isExpanded && (
                <div className="px-2 pb-2 space-y-1">
                  {categoryFeeds.map(feed => (
                    <div
                      key={feed.url}
                      className="flex items-center gap-2 p-2 hover:bg-amber-500/5 rounded transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={feed.enabled}
                        onChange={() => toggleRSSFeed(feed.url)}
                        className="w-4 h-4 accent-amber-500"
                      />
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: feed.color }}
                      />
                      <span className="text-gray-300 text-sm flex-1">{feed.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded">
        <p className="text-xs text-amber-400/80">
          <strong>Note:</strong> RSS feeds are polled every 5 minutes. Events are automatically plotted on the map based on geolocation data or title analysis.
        </p>
      </div>
    </div>
  );
};
