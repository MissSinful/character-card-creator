import React from 'react';
import { Sparkles, Wifi, Brain, PenTool } from 'lucide-react';

/**
 * Full-screen overlay shown during AI generation
 * Provides clear feedback that work is happening
 */
export default function GeneratingOverlay({ isVisible, status, wordCount = 0, streamStatus = 'idle' }) {
  if (!isVisible) return null;

  const statusMessages = {
    description: 'Crafting character description',
    firstMessage: 'Writing first message',
    altGreeting: 'Generating alternate greeting',
    tags: 'Generating tags',
  };

  const streamStatusConfig = {
    idle: { icon: Sparkles, text: 'Starting...', color: 'text-zinc-400' },
    connecting: { icon: Wifi, text: 'Connecting to AI...', color: 'text-yellow-400' },
    connected: { icon: Wifi, text: 'Connected, waiting...', color: 'text-green-400' },
    thinking: { icon: Brain, text: 'AI is thinking...', color: 'text-blue-400' },
    writing: { icon: PenTool, text: 'Writing content...', color: 'text-purple-400' },
  };

  const taskMessage = statusMessages[status] || 'Generating';
  const streamConfig = streamStatusConfig[streamStatus] || streamStatusConfig.idle;
  const StatusIcon = streamConfig.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6 p-8">
        {/* Animated icon */}
        <div className="relative">
          <div className="absolute inset-0 animate-ping">
            <Sparkles className="w-12 h-12 text-purple-500 opacity-30" />
          </div>
          <Sparkles className="w-12 h-12 text-purple-400 animate-pulse" />
        </div>

        {/* Task being performed */}
        <p className="text-lg font-medium text-zinc-100">{taskMessage}</p>

        {/* Live word count - only show when writing */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-4xl font-bold text-purple-400 tabular-nums">
            {wordCount.toLocaleString()}
          </span>
          <span className="text-sm text-zinc-500">words</span>
        </div>

        {/* Animated progress bar */}
        <div className="w-64 h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-purple-500 rounded-full animate-loading-bar" />
        </div>

        {/* Stream status with icon */}
        <div className={`flex items-center gap-2 ${streamConfig.color}`}>
          <StatusIcon className="w-4 h-4 animate-pulse" />
          <span className="text-sm">{streamConfig.text}</span>
        </div>
      </div>
    </div>
  );
}
