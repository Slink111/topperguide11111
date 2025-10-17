import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Board, Subject } from '../types';
import { SUBJECTS, CLASSES, SUBJECT_COLORS } from '../constants';
import { getChapters } from '../services/contentService';
import { ChevronDownIcon } from '../components/icons';

const SubjectCard: React.FC<{ subject: Subject; board: Board }> = ({ subject, board }) => {
    const [activeClass, setActiveClass] = useState<string | null>(null);
    const [chapters, setChapters] = useState<string[]>([]);
    const colors = SUBJECT_COLORS[subject];

    const toggleClass = (classNum: string) => {
        if (activeClass === classNum) {
            setActiveClass(null);
        } else {
            setActiveClass(classNum);
            const fetchedChapters = getChapters(board, subject, classNum);
            setChapters(fetchedChapters);
        }
    };

    return (
        <div className={`rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${colors.bg} overflow-hidden`}>
            <div className={`p-6 border-b-4 ${colors.border}`}>
                <h3 className={`text-2xl font-bold ${colors.text}`}>{subject}</h3>
            </div>
            <div className="p-4 space-y-2">
                {CLASSES.map((classNum) => (
                    <div key={classNum}>
                        <button
                            onClick={() => toggleClass(classNum)}
                            className="w-full text-left font-semibold text-slate-700 dark:text-slate-300 hover:text-teal-500 dark:hover:text-teal-400 p-2 rounded-md flex justify-between items-center transition-colors"
                        >
                            <span>Class {classNum}</span>
                            <ChevronDownIcon className={`transform transition-transform duration-300 ${activeClass === classNum ? 'rotate-180' : ''}`} />
                        </button>
                        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeClass === classNum ? 'max-h-96' : 'max-h-0'}`}>
                            <div className="pl-4 pt-2 pb-2 border-l-2 border-slate-200 dark:border-slate-700 ml-2">
                                {chapters.length > 0 ? (
                                    <ul className="space-y-2">
                                        {chapters.map((chapter) => (
                                            <li key={chapter}>
                                                <Link
                                                    to={`/${board}/${classNum}/${subject}/${encodeURIComponent(chapter)}`}
                                                    className="block text-sm text-slate-600 dark:text-slate-400 hover:text-teal-500 dark:hover:text-teal-300 transition-all duration-200 hover:pl-2"
                                                >
                                                    {chapter}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-slate-500 dark:text-slate-400 italic">No chapters available.</p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


const HomePage: React.FC = () => {
  const [board, setBoard] = useState<Board>(Board.CBSE);

  useEffect(() => {
    document.title = "Topper Guide - Your Ultimate Study Partner for ICSE & CBSE";
  }, []);

  return (
    <div className="space-y-12">
      <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-xl shadow-md">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white">
          Welcome to <span className="text-teal-500 dark:text-teal-400">Topper Guide</span>
        </h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Your one-stop destination for high-quality study materials. Select your board and dive into your subjects!
        </p>
      </div>

      <div className="flex justify-center items-center space-x-4">
        <span className="font-medium text-slate-700 dark:text-slate-300">Select Board:</span>
        <div className="relative inline-block">
          <button
            onClick={() => setBoard(Board.ICSE)}
            className={`px-6 py-2 rounded-l-full font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 ${board === Board.ICSE ? 'bg-teal-500 text-white shadow-lg' : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
          >
            ICSE
          </button>
          <button
            onClick={() => setBoard(Board.CBSE)}
            className={`px-6 py-2 rounded-r-full font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 ${board === Board.CBSE ? 'bg-teal-500 text-white shadow-lg' : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
          >
            CBSE
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {SUBJECTS.map((subject) => (
          <SubjectCard key={subject} subject={subject} board={board} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;