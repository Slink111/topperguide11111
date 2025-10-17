import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Board, Subject } from '../types';
import { getContent, getChapters } from '../services/contentService';

const ContentPage: React.FC = () => {
    const { board, classNum, subject, chapter: encodedChapter } = useParams<{ board: Board; classNum: string; subject: Subject; chapter: string }>();
    const navigate = useNavigate();
    const [content, setContent] = useState('');
    const [chapter, setChapter] = useState('');
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [allChapters, setAllChapters] = useState<string[]>([]);
    
    useEffect(() => {
        if (board && classNum && subject && encodedChapter) {
            const decodedChapter = decodeURIComponent(encodedChapter);
            setChapter(decodedChapter);
            
            const material = getContent(board, subject, classNum, decodedChapter);
            setContent(material);

            const chaptersForClass = getChapters(board, subject, classNum);
            setAllChapters(chaptersForClass);
            setCurrentIndex(chaptersForClass.findIndex(c => c === decodedChapter));

            document.title = `${decodedChapter} - Class ${classNum} ${subject} Notes | Topper Guide`;
        }
    }, [board, classNum, subject, encodedChapter]);

    const navigateToChapter = (index: number) => {
        if (index >= 0 && index < allChapters.length) {
            const nextChapter = allChapters[index];
            navigate(`/${board}/${classNum}/${subject}/${encodeURIComponent(nextChapter)}`);
        }
    };
    
    if (!board || !classNum || !subject || !chapter) {
        return <div className="text-center py-10">Loading...</div>;
    }
    
    const hasPrevious = currentIndex > 0;
    const hasNext = currentIndex < allChapters.length - 1;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 sm:p-8 lg:p-10">
                <div className="prose prose-lg dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
            </div>

            <div className="mt-8 flex justify-between items-center">
                 <button 
                    onClick={() => navigateToChapter(currentIndex - 1)}
                    disabled={!hasPrevious}
                    className="px-6 py-2 bg-teal-500 text-white rounded-md shadow-md hover:bg-teal-600 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
                >
                    &larr; Previous
                </button>
                 <button 
                    onClick={() => navigateToChapter(currentIndex + 1)}
                    disabled={!hasNext}
                    className="px-6 py-2 bg-teal-500 text-white rounded-md shadow-md hover:bg-teal-600 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
                >
                    Next &rarr;
                </button>
            </div>
        </div>
    );
};

export default ContentPage;