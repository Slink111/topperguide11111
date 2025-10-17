
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Board, Subject } from '../types';
import { SUBJECTS, CLASSES } from '../constants';
import { getChapters, addChapter, removeChapter, saveContent, getContent } from '../services/contentService';
import { generateStudyMaterial } from '../services/geminiService';
import { TrashIcon, SparklesIcon, LoadingSpinner, PhotoIcon } from '../components/icons';

type NotificationType = 'success' | 'error';

const AdminPage: React.FC = () => {
    const [board, setBoard] = useState<Board>(Board.CBSE);
    const [subject, setSubject] = useState<Subject>(Subject.Physics);
    const [classNum, setClassNum] = useState<string>('10');
    
    const [chapters, setChapters] = useState<string[]>([]);
    const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
    const [newChapter, setNewChapter] = useState('');
    
    const [content, setContent] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [notification, setNotification] = useState<{ message: string; type: NotificationType } | null>(null);
    
    const [showImageModal, setShowImageModal] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [altText, setAltText] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const showNotification = (message: string, type: NotificationType = 'success') => {
        setNotification({ message, type });
        setTimeout(() => {
            setNotification(null);
        }, 3000);
    };

    const loadChapters = useCallback(() => {
        const loadedChapters = getChapters(board, subject, classNum);
        setChapters(loadedChapters);
    }, [board, subject, classNum]);

    useEffect(() => {
        loadChapters();
        setSelectedChapter(null);
        setContent('');
    }, [board, subject, classNum, loadChapters]);

    useEffect(() => {
        if (selectedChapter) {
            const chapterContent = getContent(board, subject, classNum, selectedChapter);
            setContent(chapterContent);
        } else {
            setContent('');
        }
    }, [selectedChapter, board, subject, classNum]);

    const handleAddChapter = () => {
        if (newChapter.trim()) {
            const added = addChapter(board, subject, classNum, newChapter.trim());
            if (added) {
                showNotification(`Chapter "${newChapter.trim()}" added.`);
                setNewChapter('');
                loadChapters();
            } else {
                showNotification(`Chapter "${newChapter.trim()}" already exists.`, 'error');
            }
        }
    };

    const handleRemoveChapter = (chapter: string) => {
        if (window.confirm(`Are you sure you want to delete the chapter "${chapter}" and its content?`)) {
            removeChapter(board, subject, classNum, chapter);
            loadChapters();
            if (selectedChapter === chapter) {
                setSelectedChapter(null);
            }
            showNotification(`Chapter "${chapter}" removed.`);
        }
    };
    
    const handleSaveContent = () => {
        if (selectedChapter) {
            setIsSaving(true);
            saveContent(board, subject, classNum, selectedChapter, content);
            setTimeout(() => {
                setIsSaving(false);
                showNotification('Content saved successfully!');
            }, 500);
        }
    };

    const handleGenerateContent = async () => {
        if (selectedChapter) {
            setIsGenerating(true);
            setContent('Generating content with AI... Please wait.');
            const generatedContent = await generateStudyMaterial(board, subject, classNum, selectedChapter);
            setContent(generatedContent);
            setIsGenerating(false);
            showNotification('AI content generated!');
        } else {
            showNotification('Please select a chapter first.', 'error');
        }
    };

    const handleInsertImage = () => {
        if (!imageUrl || !altText) {
            showNotification("Please provide both an Image URL and Alt Text.", "error");
            return;
        }

        const imgTag = `\n<img src="${imageUrl}" alt="${altText}" class="my-4 rounded-lg shadow-md max-w-full h-auto mx-auto block" />\n`;
        
        if (textareaRef.current) {
            const textarea = textareaRef.current;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const newContent = content.substring(0, start) + imgTag + content.substring(end);
            setContent(newContent);
            setTimeout(() => {
                textarea.focus();
                textarea.selectionStart = textarea.selectionEnd = start + imgTag.length;
            }, 0);
        } else {
            setContent(currentContent => currentContent + imgTag);
        }

        setShowImageModal(false);
        setImageUrl('');
        setAltText('');
    };

    const wordCount = useMemo(() => {
        if (!content) return 0;
        const text = content.replace(/<[^>]*>?/gm, ' ');
        return text.trim().split(/\s+/).filter(Boolean).length;
    }, [content]);


    const notificationColor = notification?.type === 'success' ? 'bg-green-600' : 'bg-red-600';

    return (
        <div className="space-y-8">
            {notification && (
                <div className={`fixed top-20 right-6 ${notificationColor} text-white text-sm font-medium px-4 py-2 rounded-md shadow-lg z-50 toast-notification`}>
                    {notification.message}
                </div>
            )}

            {showImageModal && (
                 <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md space-y-4">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Add Image</h3>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Image URL</label>
                            <input
                                type="text"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="https://example.com/image.png"
                                className="w-full p-2 rounded-md border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Alt Text (for SEO)</label>
                            <input
                                type="text"
                                value={altText}
                                onChange={(e) => setAltText(e.target.value)}
                                placeholder="A diagram of the solar system"
                                className="w-full p-2 rounded-md border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            />
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button onClick={() => setShowImageModal(false)} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">Cancel</button>
                            <button onClick={handleInsertImage} className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors">Insert Image</button>
                        </div>
                    </div>
                 </div>
            )}

            <h1 className="text-3xl font-bold text-center">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-md">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Board</label>
                    <select value={board} onChange={(e) => setBoard(e.target.value as Board)} className="w-full p-2 rounded-md border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white">
                        {Object.values(Board).map(b => <option key={b} value={b}>{b.toUpperCase()}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                    <select value={subject} onChange={(e) => setSubject(e.target.value as Subject)} className="w-full p-2 rounded-md border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white">
                        {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Class</label>
                    <select value={classNum} onChange={(e) => setClassNum(e.target.value)} className="w-full p-2 rounded-md border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white">
                        {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Chapters</h2>
                    <div className="flex space-x-2 mb-4">
                        <input
                            type="text"
                            value={newChapter}
                            onChange={(e) => setNewChapter(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddChapter()}
                            placeholder="New chapter name"
                            className="flex-grow p-2 rounded-md border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                        />
                        <button onClick={handleAddChapter} className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-all transform hover:scale-105 active:scale-95">Add</button>
                    </div>
                    <ul className="space-y-2 max-h-96 overflow-y-auto">
                        {chapters.map(chapter => (
                            <li key={chapter} className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${selectedChapter === chapter ? 'bg-teal-100 dark:bg-teal-900/50' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                                <span onClick={() => setSelectedChapter(chapter)} className="flex-grow transition-all duration-200 hover:pl-1">{chapter}</span>
                                <button onClick={() => handleRemoveChapter(chapter)} className="ml-2 text-red-500 hover:text-red-700 transition-transform transform hover:scale-110">
                                    <TrashIcon />
                                </button>
                            </li>
                        ))}
                         {chapters.length === 0 && <p className="text-sm text-slate-500 dark:text-slate-400 text-center italic mt-4">No chapters yet. Add one above!</p>}
                    </ul>
                </div>

                <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Content Editor</h2>
                    {selectedChapter ? (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">Editing: <span className="text-teal-500 dark:text-teal-400">{selectedChapter}</span></h3>
                            <textarea
                                ref={textareaRef}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Write your content here in HTML format..."
                                className="w-full h-96 p-2 rounded-md border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white font-mono text-sm"
                            />
                             <div className="text-right text-sm text-slate-500 dark:text-slate-400">
                                Word Count: {wordCount}
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button onClick={() => setShowImageModal(true)} className="flex items-center px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 transition-all transform hover:scale-105 active:scale-95">
                                    <PhotoIcon className="mr-2"/>
                                    Add Image
                                </button>
                                <button onClick={handleGenerateContent} disabled={isGenerating} className="flex items-center px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-all transform hover:scale-105 active:scale-95 disabled:bg-amber-300">
                                    {isGenerating ? <LoadingSpinner /> : <SparklesIcon className="mr-2" />}
                                    {isGenerating ? 'Generating...' : 'Generate with AI'}
                                </button>
                                <button onClick={handleSaveContent} disabled={isSaving} className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-all transform hover:scale-105 active:scale-95 disabled:bg-emerald-400">
                                    {isSaving ? 'Saving...' : 'Save Content'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400">
                            <p>Select a chapter to start editing.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
