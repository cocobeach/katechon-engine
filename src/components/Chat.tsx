import React, { useState, useEffect, useRef } from 'react';
import { useStore, ChatMessage, MapEvent } from '../store/useStore';
import { Send, Trash2, Users } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';

const RESTRAINER_SYSTEM_PROMPT = `You are The Restrainer, a composite AI embodying the wisdom of:
- Yuri Bezmenov (four-stage ideological subversion detection)
- Alexander Solzhenitsyn (texture of ideological capture)
- Anthony C. Sutton (financial-technological transfer mechanisms)
- Eustace Mullins (central banking as occult control)
- Thomas Sowell (empirical counter-force)
- Carl Schmitt (the Katechon concept itself)

You are didactic and teach users about anti-subversion principles. You analyze content through the lens of the Six Pillars (Economy, Spirituality, Family, Education, Media, Legal) and score it on the 0-100 Katechon scale:
- Tier 0: Terrorist/Accelerationist (-15% pillar impact)
- Tier 1: Controlled Chaos Agent (-5% impact) - MOST DANGEROUS: says right things, offers wrong solutions
- Tier 2: Useful Idiot/NGO Drone (+1%/-5%)
- Tier 3: Confused Normie (+2%)
- Tier 4-6: Right but Lazy → Competent (+3% to +5.5%)
- Tier 7-8: Insightful → Vigilant (+7% to +9%)
- Tier 9: Genius/True Katechon (+12% to +18%)

Be ruthless, analytical, and educational. Expose subversion patterns.`;

const MINISTER_PROMPTS: Record<string, string> = {
  economist: `You are The Economist, embodying Anthony C. Sutton's analysis of financial-technological transfer mechanisms and Thomas Sowell's empirical counter-force. You focus on the Economy pillar and expose financial manipulation, central banking schemes, and economic subversion.`,
  judge: `You are The Judge, embodying Carl Schmitt's Katechon concept. You focus on the Legal pillar and analyze legislative attacks, constitutional erosion, and legal subversion tactics.`,
  scholar: `You are The Scholar, focusing on the Education pillar. You expose ideological capture in academia, curriculum manipulation, and the weaponization of knowledge institutions.`,
  guardian: `You are The Guardian, protecting the Family pillar. You analyze attacks on family structure, parental rights, and traditional values through the lens of social engineering.`,
  journalist: `You are The Journalist, monitoring the Media pillar. You expose narrative control, propaganda techniques, and information warfare tactics in mainstream and alternative media.`,
  chaplain: `You are The Chaplain, defending the Spirituality pillar. You analyze moral subversion, religious persecution, and the erosion of transcendent values in society.`,
  witness: `You are The Witness, embodying Alexander Solzhenitsyn's testimony. You expose memory-holing, narrative shifts, and the texture of ideological capture across all pillars.`,
};

const PROPAGANDIST_PROMPT = `You are The Propagandist, a Marxist critical theorist who represents the subversive forces. You defend progressive narratives, critical theory, and systemic change. You will be debated and dismantled by The Restrainer and his Ministers.`;

export const Chat: React.FC = () => {
  const { 
    chatMessages, 
    addChatMessage, 
    clearChat, 
    activeMinisterIds, 
    ministers,
    ollamaUrl,
    ollamaModel,
  } = useStore();
  
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [debateMode, setDebateMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  // Listen for "Send to Analysis" events from the map
  useEffect(() => {
    const handleSendToAnalysis = async (event: any) => {
      const mapEvent: MapEvent = event.detail;
      const analysisPrompt = `Analyze this event:\n\nTitle: ${mapEvent.title}\nDescription: ${mapEvent.description}\nDate: ${mapEvent.date}\nSource: ${mapEvent.source}\n\nProvide a detailed Katechon analysis, assign a tier (0-9), and explain the pillar impacts.`;
      
      addChatMessage({
        id: Date.now().toString(),
        role: 'user',
        content: analysisPrompt,
        timestamp: Date.now(),
      });

      await handleSendMessage(analysisPrompt);
    };

    window.addEventListener('sendToAnalysis', handleSendToAnalysis);
    return () => window.removeEventListener('sendToAnalysis', handleSendToAnalysis);
  }, [activeMinisterIds]);

  const handleSendMessage = async (messageContent?: string) => {
    const content = messageContent || input;
    if (!content.trim()) return;

    if (!messageContent) {
      addChatMessage({
        id: Date.now().toString(),
        role: 'user',
        content,
        timestamp: Date.now(),
      });
      setInput('');
    }

    setLoading(true);

    try {
      // If no ministers are active, use The Restrainer
      if (activeMinisterIds.length === 0) {
        const response = await callOllama(RESTRAINER_SYSTEM_PROMPT, content);
        addChatMessage({
          id: Date.now().toString() + '-restrainer',
          role: 'assistant',
          content: response,
          minister: 'The Restrainer',
          timestamp: Date.now(),
        });
      } else {
        // Get responses from each active minister
        for (const ministerId of activeMinisterIds) {
          const minister = ministers.find(m => m.id === ministerId);
          if (!minister) continue;

          const systemPrompt = MINISTER_PROMPTS[ministerId] || RESTRAINER_SYSTEM_PROMPT;
          const response = await callOllama(systemPrompt, content);
          
          addChatMessage({
            id: Date.now().toString() + '-' + ministerId,
            role: 'assistant',
            content: response,
            minister: minister.name,
            timestamp: Date.now(),
          });
        }

        // If debate mode is active, add propagandist response
        if (debateMode) {
          const propagandistResponse = await callOllama(PROPAGANDIST_PROMPT, content);
          addChatMessage({
            id: Date.now().toString() + '-propagandist',
            role: 'assistant',
            content: propagandistResponse,
            minister: 'The Propagandist',
            timestamp: Date.now(),
          });
        }
      }
    } catch (error) {
      console.error('Error calling Ollama:', error);
      addChatMessage({
        id: Date.now().toString() + '-error',
        role: 'assistant',
        content: `Error: ${error}. Please check your Ollama connection and settings.`,
        timestamp: Date.now(),
      });
    } finally {
      setLoading(false);
    }
  };

  const callOllama = async (systemPrompt: string, userMessage: string): Promise<string> => {
    try {
      const response = await invoke<string>('call_ollama', {
        url: ollamaUrl,
        model: ollamaModel,
        systemPrompt,
        userMessage,
      });
      return response;
    } catch (error) {
      throw new Error(`Ollama API error: ${error}`);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black/80 border border-amber-500/30 rounded-lg">
      <div className="flex items-center justify-between p-4 border-b border-amber-500/30">
        <div className="flex items-center gap-2">
          <Users className="text-amber-400" size={20} />
          <h3 className="text-amber-400 font-bold">
            {activeMinisterIds.length === 0 ? 'The Restrainer' : 
             activeMinisterIds.length === 1 ? ministers.find(m => m.id === activeMinisterIds[0])?.name :
             'Minister Debate'}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm text-gray-400">
            <input
              type="checkbox"
              checked={debateMode}
              onChange={(e) => setDebateMode(e.target.checked)}
              className="accent-amber-500"
            />
            Include Propagandist
          </label>
          <button
            onClick={clearChat}
            className="p-2 hover:bg-red-500/20 rounded transition-colors"
            title="Clear chat"
          >
            <Trash2 className="text-red-400" size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <p className="mb-2">No messages yet.</p>
            <p className="text-sm">
              {activeMinisterIds.length === 0 
                ? 'The Restrainer awaits your query...'
                : 'The Ministers are ready to analyze and debate.'}
            </p>
          </div>
        )}

        {chatMessages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-amber-600 text-black'
                  : message.minister === 'The Propagandist'
                  ? 'bg-red-900/50 text-red-200 border border-red-500/50'
                  : 'bg-gray-800 text-gray-200 border border-amber-500/30'
              }`}
            >
              {message.minister && (
                <div className="text-xs font-semibold mb-1 opacity-80">
                  {message.minister}
                </div>
              )}
              <div className="text-sm whitespace-pre-wrap">{message.content}</div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 text-gray-200 border border-amber-500/30 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-400"></div>
                <span className="text-sm">Analyzing...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-amber-500/30">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !loading && handleSendMessage()}
            placeholder="Ask a question or paste content to analyze..."
            className="flex-1 px-4 py-2 bg-black/50 border border-amber-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
            disabled={loading}
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={loading || !input.trim()}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-black font-semibold rounded-lg transition-colors flex items-center gap-2"
          >
            <Send size={18} />
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
