
import React, { useState } from 'react';
import { Book, Chapter, VisualElement, ImageModelID } from '../types';
import { ChevronLeft, ChevronRight, Image as ImageIcon, BarChart2, AlertCircle, Wand2, RefreshCw, Edit3, Upload, X, Zap } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ImageService } from '../src/services/media/ImageService';

interface Props {
  book: Book;
  visualStyle?: string;
  imageModelHierarchy?: ImageModelID[];
  onUpdateBook: (updatedBook: Book) => void;
}

const BookReader: React.FC<Props> = ({ book, visualStyle, imageModelHierarchy, onUpdateBook }) => {
  // Use -1 for Front Cover, chapters.length for Back Cover
  const [activePageIndex, setActivePageIndex] = useState(-1);
  const [generatingImages, setGeneratingImages] = useState<Record<string, boolean>>({});
  
  // Track which visual is currently being "Studio Edited"
  // Key format: "chapterIndex-visualIndex" or "cover-front" / "cover-back"
  const [expandedStudioKey, setExpandedStudioKey] = useState<string | null>(null);
  
  // State for the studio inputs
  const [studioPrompt, setStudioPrompt] = useState('');
  const [studioMode, setStudioMode] = useState<'GENERATE' | 'EDIT' | 'UPLOAD'>('GENERATE');

  const isFrontCover = activePageIndex === -1;
  const isBackCover = activePageIndex === book.chapters.length;
  const activeChapterIndex = (!isFrontCover && !isBackCover) ? activePageIndex : null;
  const activeChapter = activeChapterIndex !== null ? book.chapters[activeChapterIndex] : null;

  const toggleStudio = (key: string, defaultPrompt: string) => {
    if (expandedStudioKey === key) {
        setExpandedStudioKey(null);
    } else {
        setExpandedStudioKey(key);
        setStudioPrompt(defaultPrompt);
        setStudioMode('GENERATE'); // Default to Generate
    }
  };

  const handleStudioAction = async (key: string, chapterIndex: number | 'front' | 'back', visualIndex?: number) => {
      // Prevent double click/execution if already generating this key
      if (generatingImages[key]) return;

      setGeneratingImages(prev => ({ ...prev, [key]: true }));
      
      try {
        let imageUrl = "";
        
        // 1. Upload Logic is handled instantly by file input, so this action is for Gen/Edit
        if (studioMode === 'GENERATE') {
             // High Res Generation
             imageUrl = await ImageService.generateImage(studioPrompt, visualStyle, true, imageModelHierarchy); // true = High Res
        } else if (studioMode === 'EDIT') {
             // Image Editing
             // Need current image.
             let currentImage = "";
             if (chapterIndex === 'front') currentImage = book.frontCover?.imageUrl || "";
             else if (chapterIndex === 'back') currentImage = book.backCover?.imageUrl || "";
             else if (typeof chapterIndex === 'number' && visualIndex !== undefined) {
                 currentImage = book.chapters[chapterIndex].visuals?.[visualIndex].imageUrl || "";
             }

             if (!currentImage) {
                 alert("Cannot edit - no image exists yet. Generate one first.");
                 setGeneratingImages(prev => ({ ...prev, [key]: false }));
                 return;
             }
             
             imageUrl = await ImageService.editImage(currentImage, studioPrompt, imageModelHierarchy);
        }

        // Update Book State
        const newBook = JSON.parse(JSON.stringify(book)) as Book;
        
        if (chapterIndex === 'front' && newBook.frontCover) {
            newBook.frontCover.imageUrl = imageUrl;
        } else if (chapterIndex === 'back' && newBook.backCover) {
            newBook.backCover.imageUrl = imageUrl;
        } else if (typeof chapterIndex === 'number' && visualIndex !== undefined) {
            if (newBook.chapters[chapterIndex].visuals) {
                newBook.chapters[chapterIndex].visuals![visualIndex].imageUrl = imageUrl;
            }
        }
        
        onUpdateBook(newBook);
        setExpandedStudioKey(null); // Close studio on success

      } catch (e) {
          console.error("Studio action failed", e);
      } finally {
          setGeneratingImages(prev => ({ ...prev, [key]: false }));
      }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, chapterIndex: number | 'front' | 'back', visualIndex?: number) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              const result = reader.result as string;
              const newBook = JSON.parse(JSON.stringify(book)) as Book;
              
              if (chapterIndex === 'front' && newBook.frontCover) {
                  newBook.frontCover.imageUrl = result;
              } else if (chapterIndex === 'back' && newBook.backCover) {
                  newBook.backCover.imageUrl = result;
              } else if (typeof chapterIndex === 'number' && visualIndex !== undefined) {
                  if (newBook.chapters[chapterIndex].visuals) {
                      newBook.chapters[chapterIndex].visuals![visualIndex].imageUrl = result;
                  }
              }
              onUpdateBook(newBook);
              setExpandedStudioKey(null);
          };
          reader.readAsDataURL(file);
      }
  };

  const renderStudioPanel = (key: string, chapterIndex: number | 'front' | 'back', visualIndex?: number) => {
      if (expandedStudioKey !== key) return null;
      
      const isGenerating = generatingImages[key];

      return (
          <div className="mt-4 p-4 bg-gray-900 text-white rounded-lg shadow-2xl border border-gray-700 animate-slideDown z-20 relative">
              <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                      <Zap size={14} className="text-yellow-500"/>
                      Image Studio (Pro)
                  </h4>
                  <button onClick={() => setExpandedStudioKey(null)} className="text-gray-400 hover:text-white"><X size={16}/></button>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mb-4">
                  <button 
                    onClick={() => setStudioMode('GENERATE')}
                    className={`px-3 py-1 rounded text-xs font-bold ${studioMode === 'GENERATE' ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-gray-400'}`}
                  >
                    Regenerate (High Res)
                  </button>
                  <button 
                    onClick={() => setStudioMode('EDIT')}
                    className={`px-3 py-1 rounded text-xs font-bold ${studioMode === 'EDIT' ? 'bg-purple-500 text-white' : 'bg-gray-800 text-gray-400'}`}
                  >
                    Edit Existing (AI)
                  </button>
                  <button 
                    onClick={() => setStudioMode('UPLOAD')}
                    className={`px-3 py-1 rounded text-xs font-bold ${studioMode === 'UPLOAD' ? 'bg-green-500 text-white' : 'bg-gray-800 text-gray-400'}`}
                  >
                    Upload File
                  </button>
              </div>

              {/* Content */}
              {studioMode !== 'UPLOAD' ? (
                  <div className="space-y-3">
                      <textarea
                          value={studioPrompt}
                          onChange={(e) => setStudioPrompt(e.target.value)}
                          placeholder={studioMode === 'GENERATE' ? "Describe the image..." : "Describe changes (e.g. 'Make it darker', 'Add a robot')..."}
                          className="w-full h-24 bg-black border border-gray-700 rounded p-3 text-sm focus:border-yellow-500 focus:outline-none"
                      />
                      <button
                          onClick={() => handleStudioAction(key, chapterIndex, visualIndex)}
                          disabled={isGenerating}
                          className={`w-full py-2 rounded font-bold text-sm flex items-center justify-center gap-2 ${
                              studioMode === 'GENERATE' ? 'bg-white text-black hover:bg-gray-200' : 'bg-purple-600 text-white hover:bg-purple-500'
                          } disabled:opacity-50`}
                      >
                          {isGenerating ? <RefreshCw className="animate-spin" size={14} /> : <Wand2 size={14} />}
                          {isGenerating ? "Processing..." : (studioMode === 'GENERATE' ? "Generate High Quality (2K)" : "Apply AI Edits")}
                      </button>
                      <p className="text-[10px] text-gray-500 text-center">
                          Powered by Gemini Pro Vision. Optimized for KDP 6x9 Print.
                      </p>
                  </div>
              ) : (
                  <div className="space-y-3">
                      <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-green-500 transition-colors cursor-pointer relative">
                          <input 
                              type="file" 
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, chapterIndex, visualIndex)}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <Upload className="mx-auto mb-2 text-gray-500" size={24} />
                          <p className="text-xs text-gray-400">Click to upload or drag and drop</p>
                          <p className="text-[10px] text-gray-600 mt-1">Recommended: 1800x2700px (300dpi) for full page</p>
                      </div>
                  </div>
              )}
          </div>
      )
  };

  const renderVisual = (visual: VisualElement, vIdx: number, chapterIndex: number) => {
    const key = `${chapterIndex}-${vIdx}`;
    
    return (
        <div key={key} className="my-8 group relative">
             {visual.imageUrl ? (
                 <div className="rounded-xl overflow-hidden shadow-2xl bg-gray-100 relative">
                     <img src={visual.imageUrl} alt={visual.description} className="w-full h-auto object-cover" />
                     {visual.caption && <div className="bg-gray-100 p-2 text-xs text-gray-500 text-center italic border-t border-gray-200">{visual.caption}</div>}
                     
                     <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => toggleStudio(key, visual.description)} className="bg-black/70 hover:bg-black text-white p-2 rounded-