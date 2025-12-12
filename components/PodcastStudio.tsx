import React, { useState } from 'react';
import { Book } from '../types';
import {
    PodcastSettings,
    DEFAULT_PODCAST_SETTINGS,
    VOICES,
    VoiceId,
    PodcastTier,
    TIER_FEATURES
} from '../services/audio/VoiceConfig';
import { PodcastService, PodcastResult } from '../services/audio/PodcastService';
import { Mic, Play, Pause, Download, Volume2, Settings, Loader2, Check, Radio } from 'lucide-react';

interface Props {
    book: Book;
}

const PodcastStudio: React.FC<Props> = ({ book }) => {
    const [settings, setSettings] = useState<PodcastSettings>(DEFAULT_PODCAST_SETTINGS);
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('');
    const [result, setResult] = useState<PodcastResult | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSegment, setCurrentSegment] = useState(0);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [previewAudio, setPreviewAudio] = useState<string | null>(null);

    const maleVoices = VOICES.filter(v => v.gender === 'male');
    const femaleVoices = VOICES.filter(v => v.gender === 'female');

    const handleGenerate = async () => {
        setIsGenerating(true);
        setProgress(0);
        setStatus('Starting...');
        setResult(null);

        try {
            const podcast = await PodcastService.generatePodcast(
                book,
                settings,
                (prog, stat) => {
                    setProgress(prog);
                    setStatus(stat);
                }
            );
            setResult(podcast);
        } catch (e) {
            console.error('Podcast generation failed:', e);
            setStatus('Generation failed. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handlePreview = async (voice: VoiceId) => {
        try {
            const audio = await PodcastService.generatePreview(
                "This is a preview of the selected voice. How does it sound?",
                voice,
                settings.speed
            );
            setPreviewAudio(audio);
            const audioEl = new Audio(audio);
            audioEl.play();
        } catch (e) {
            console.error('Preview failed:', e);
        }
    };

    const playSegment = (index: number) => {
        if (!result?.segments[index]?.audioData) return;
        const audio = new Audio(result.segments[index].audioData);
        audio.play();
        setCurrentSegment(index);
        setIsPlaying(true);
        audio.onended = () => setIsPlaying(false);
    };

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 p-4 border-b border-gray-800">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Radio className="text-pink-500" size={24} />
                    Podcast Studio
                </h2>
                <p className="text-sm text-gray-400 mt-1">Transform your book into an audio experience</p>
            </div>

            <div className="p-6 space-y-6">
                {/* Tier Selection */}
                <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Production Tier</label>
                    <div className="grid grid-cols-3 gap-3">
                        {(['BASIC', 'NARRATIVE', 'INTERACTIVE'] as PodcastTier[]).map(tier => (
                            <button
                                key={tier}
                                onClick={() => setSettings(prev => ({ ...prev, tier }))}
                                className={`p-4 rounded-lg border-2 transition-all text-left ${settings.tier === tier
                                        ? 'border-pink-500 bg-pink-500/10'
                                        : 'border-gray-700 hover:border-gray-600'
                                    }`}
                            >
                                <div className="font-bold text-white mb-2">{tier}</div>
                                <ul className="text-xs text-gray-400 space-y-1">
                                    {TIER_FEATURES[tier].slice(0, 3).map((f, i) => (
                                        <li key={i} className="flex items-start gap-1">
                                            <Check size={12} className="text-green-500 mt-0.5 shrink-0" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Voice Selection */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Primary Voice */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Primary Voice</label>
                        <div className="grid grid-cols-2 gap-2">
                            {maleVoices.slice(0, 4).map(voice => (
                                <button
                                    key={voice.id}
                                    onClick={() => setSettings(prev => ({ ...prev, primaryVoice: voice.id }))}
                                    className={`p-2 rounded text-xs border transition-all flex items-center justify-between ${settings.primaryVoice === voice.id
                                            ? 'border-blue-500 bg-blue-500/20 text-white'
                                            : 'border-gray-700 text-gray-400 hover:border-gray-500'
                                        }`}
                                >
                                    <span>{voice.name}</span>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handlePreview(voice.id); }}
                                        className="p-1 hover:bg-gray-700 rounded"
                                    >
                                        <Play size={10} />
                                    </button>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Secondary Voice (for Narrative+) */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                            Secondary Voice {settings.tier === 'BASIC' && <span className="text-gray-600">(Narrative+)</span>}
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {femaleVoices.map(voice => (
                                <button
                                    key={voice.id}
                                    onClick={() => setSettings(prev => ({ ...prev, secondaryVoice: voice.id }))}
                                    disabled={settings.tier === 'BASIC'}
                                    className={`p-2 rounded text-xs border transition-all flex items-center justify-between ${settings.secondaryVoice === voice.id
                                            ? 'border-pink-500 bg-pink-500/20 text-white'
                                            : 'border-gray-700 text-gray-400 hover:border-gray-500'
                                        } ${settings.tier === 'BASIC' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <span>{voice.name}</span>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handlePreview(voice.id); }}
                                        className="p-1 hover:bg-gray-700 rounded"
                                        disabled={settings.tier === 'BASIC'}
                                    >
                                        <Play size={10} />
                                    </button>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Speed Control */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Speed</label>
                        <span className="text-sm text-white font-mono">{settings.speed.toFixed(1)}x</span>
                    </div>
                    <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={settings.speed}
                        onChange={(e) => setSettings(prev => ({ ...prev, speed: parseFloat(e.target.value) }))}
                        className="w-full accent-pink-500"
                    />
                    <div className="flex justify-between text-xs text-gray-600">
                        <span>0.5x (Slow)</span>
                        <span>1.0x (Normal)</span>
                        <span>2.0x (Fast)</span>
                    </div>
                </div>

                {/* Advanced Options Toggle */}
                <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1"
                >
                    <Settings size={12} />
                    {showAdvanced ? 'Hide' : 'Show'} Advanced Options
                </button>

                {showAdvanced && (
                    <div className="space-y-3 p-4 bg-black/30 rounded-lg">
                        <label className="flex items-center gap-3 text-sm text-gray-300 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.includeIntro}
                                onChange={(e) => setSettings(prev => ({ ...prev, includeIntro: e.target.checked }))}
                                className="accent-pink-500"
                            />
                            Include Intro
                        </label>
                        <label className="flex items-center gap-3 text-sm text-gray-300 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.includeOutro}
                                onChange={(e) => setSettings(prev => ({ ...prev, includeOutro: e.target.checked }))}
                                className="accent-pink-500"
                            />
                            Include Outro
                        </label>
                        <label className="flex items-center gap-3 text-sm text-gray-300 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.includeChapterBreaks}
                                onChange={(e) => setSettings(prev => ({ ...prev, includeChapterBreaks: e.target.checked }))}
                                className="accent-pink-500"
                            />
                            Chapter Announcements
                        </label>
                        <label className="flex items-center gap-3 text-sm text-gray-300 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.includePosiBotQuotes}
                                onChange={(e) => setSettings(prev => ({ ...prev, includePosiBotQuotes: e.target.checked }))}
                                className="accent-pink-500"
                            />
                            PosiBot Voice Quotes
                        </label>
                    </div>
                )}

                {/* Generate Button */}
                <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            {status} ({progress}%)
                        </>
                    ) : (
                        <>
                            <Mic size={20} />
                            Generate Podcast
                        </>
                    )}
                </button>

                {/* Progress Bar */}
                {isGenerating && (
                    <div className="w-full bg-gray-800 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                )}

                {/* Results */}
                {result && result.segments.length > 0 && (
                    <div className="space-y-4 mt-6 p-4 bg-black/30 rounded-lg">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <Volume2 size={16} className="text-green-500" />
                            Generated Segments ({result.segments.filter(s => s.audioData).length}/{result.segments.length})
                        </h3>

                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {result.segments.map((segment, i) => (
                                <div
                                    key={i}
                                    className={`flex items-center justify-between p-3 rounded border ${segment.audioData ? 'border-gray-700 bg-gray-800/50' : 'border-red-900 bg-red-900/20'
                                        } ${currentSegment === i && isPlaying ? 'border-pink-500' : ''}`}
                                >
                                    <div>
                                        <span className="text-xs px-2 py-0.5 rounded bg-gray-700 text-gray-300 uppercase mr-2">
                                            {segment.type}
                                        </span>
                                        {segment.chapterNumber && (
                                            <span className="text-xs text-gray-500">Ch {segment.chapterNumber}</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500">{segment.voice}</span>
                                        {segment.audioData ? (
                                            <button
                                                onClick={() => playSegment(i)}
                                                className="p-2 bg-pink-600 hover:bg-pink-500 rounded-full"
                                            >
                                                {currentSegment === i && isPlaying ? <Pause size={14} /> : <Play size={14} />}
                                            </button>
                                        ) : (
                                            <span className="text-xs text-red-400">Failed</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Download All */}
                        <button className="w-full py-3 bg-green-600 hover:bg-green-500 rounded-lg font-bold text-white flex items-center justify-center gap-2">
                            <Download size={18} />
                            Download Full Podcast (Coming Soon)
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PodcastStudio;
