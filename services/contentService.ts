
import { Board, Subject } from '../types';

type ChapterData = {
  [board in Board]?: {
    [subject in Subject]?: {
      [classNum: string]: string[];
    };
  };
};

type ContentData = {
  [key: string]: string;
};

const CHAPTERS_KEY = 'topperGuideChapters';
const CONTENT_KEY = 'topperGuideContent';

// --- Helper Functions ---
const getChaptersData = (): ChapterData => {
  try {
    const data = localStorage.getItem(CHAPTERS_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error("Error reading chapters from localStorage", error);
    return {};
  }
};

const setChaptersData = (data: ChapterData): void => {
  try {
    localStorage.setItem(CHAPTERS_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error writing chapters to localStorage", error);
  }
};

const getContentData = (): ContentData => {
  try {
    const data = localStorage.getItem(CONTENT_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error("Error reading content from localStorage", error);
    return {};
  }
};

const setContentData = (data: ContentData): void => {
  try {
    localStorage.setItem(CONTENT_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error writing content to localStorage", error);
  }
};

const generateContentKey = (board: Board, subject: Subject, classNum: string, chapter: string): string => {
    return `${board}-${subject.toLowerCase().replace(' ', '')}-${classNum}-${chapter.toLowerCase().replace(/ /g, '-')}`;
}

// --- Public API ---

export const getChapters = (board: Board, subject: Subject, classNum: string): string[] => {
  const data = getChaptersData();
  return data[board]?.[subject]?.[classNum] || [];
};

export const addChapter = (board: Board, subject: Subject, classNum:string, chapter: string): boolean => {
  const data = getChaptersData();
  if (!data[board]) data[board] = {};
  if (!data[board]![subject]) data[board]![subject] = {};
  if (!data[board]![subject]![classNum]) data[board]![subject]![classNum] = [];
  
  const chapters = data[board]![subject]![classNum]!;
  if (!chapters.includes(chapter)) {
    chapters.push(chapter);
    setChaptersData(data);
    return true;
  }
  return false;
};

export const removeChapter = (board: Board, subject: Subject, classNum: string, chapter: string): void => {
    const data = getChaptersData();
    if (data[board]?.[subject]?.[classNum]) {
        data[board]![subject]![classNum] = data[board]![subject]![classNum]!.filter(c => c !== chapter);
        setChaptersData(data);
        
        // Also remove associated content
        const contentKey = generateContentKey(board, subject, classNum, chapter);
        const contentData = getContentData();
        delete contentData[contentKey];
        setContentData(contentData);
    }
};

export const getContent = (board: Board, subject: Subject, classNum: string, chapter: string): string => {
  const contentKey = generateContentKey(board, subject, classNum, chapter);
  const data = getContentData();
  return data[contentKey] || '<p>No content available for this chapter yet. Please check back later.</p>';
};

export const saveContent = (board: Board, subject: Subject, classNum: string, chapter: string, material: string): void => {
  const contentKey = generateContentKey(board, subject, classNum, chapter);
  const data = getContentData();
  data[contentKey] = material;
  setContentData(data);
};
