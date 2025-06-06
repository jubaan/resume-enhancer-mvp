import * as mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface ParsedContent {
  text: string;
  metadata: {
    fileType: string;
    fileName: string;
    fileSize: number;
  };
}

export async function parseFile(file: File): Promise<ParsedContent> {
  const metadata = {
    fileType: file.type,
    fileName: file.name,
    fileSize: file.size,
  };

  let text = '';

  try {
    if (file.type === 'application/pdf') {
      text = await parsePDF(file);
    } else if (
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.type === 'application/msword'
    ) {
      text = await parseWord(file);
    } else if (file.type === 'text/plain') {
      text = await parseText(file);
    } else {
      throw new Error('Unsupported file type');
    }

    return { text, metadata };
  } catch (error) {
    throw new Error(`Failed to parse file: ${error.message}`);
  }
}

async function parsePDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  let fullText = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    fullText += pageText + '\n';
  }
  
  return fullText.trim();
}

async function parseWord(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

async function parseText(file: File): Promise<string> {
  return await file.text();
}