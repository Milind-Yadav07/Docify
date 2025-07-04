
import React, { useState, useEffect } from 'react';
import Dropdown from './components/Dropdown';
import TextArea from './components/TextArea';
import ModeToggle from './components/ModeToggle';
import SwapButton from './components/SwapButton';
import languages from './language/Languages';

import mammoth from 'mammoth';

const App = () => {
  // State for input and output languages, texts, and dark mode toggle
  const [inputLanguage, setInputLanguage] = useState('auto');
  const [outputLanguage, setOutputLanguage] = useState('en');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  // Function to extract text from PDF file using global pdfjsLib
  const extractTextFromPDF = async (file) => {
    const pdfjsLib = window['pdfjsLib'];
    if (!pdfjsLib) {
      alert('PDF.js library is not loaded.');
      return '';
    }
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map(item => item.str);
      text += strings.join(' ') + '\\n';
    }
    return text;
  };

  // Function to extract text from Word document using mammoth
  const extractTextFromDocx = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  };

  // Effect to trigger translation when input language, output language, or input text changes
  useEffect(() => {
    if (inputText.trim()) {
      translate();
    } else {
      setOutputText('');
    }
  }, [inputLanguage, outputLanguage, inputText]);

  // Function to call Google Translate API and update output text
  const translate = async () => {
    try {
      const url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" + inputLanguage + "&tl=" + outputLanguage + "&dt=t&q=" + encodeURI(inputText);
      const response = await fetch(url);
      const json = await response.json();
      setOutputText(json[0].map(item => item[0]).join(''));
    } catch (error) {
      console.error(error);
    }
  };

  // Swap input and output languages and texts
  const swapLanguages = () => {
    setInputLanguage(outputLanguage);
    setOutputLanguage(inputLanguage);
    setInputText(outputText);
    setOutputText(inputText);
  };

  // Effect to add or remove dark mode class on body element
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <>
      <div className="mode">
        <ModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
      </div>
      <div className="container">
        <div className="card input-wrapper">
          <div className="from">
            <span className="heading">From :</span>
            <Dropdown
              languages={languages}
              selected={inputLanguage}
              setSelected={setInputLanguage}
              id="input-language"
            />
          </div>
          <TextArea
            id="input-text"
            value={inputText}
            setValue={setInputText}
            placeholder="Enter your text here"
            maxLength={5000}
            showCharCount={true}
          />
          <div className="card-bottom">
            <p>Or choose your document!</p>
            <label htmlFor="upload-document">
              <span id="upload-title">Upload File</span>
              <input
                type="file"
                id="upload-document"
                hidden
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  if (file.type === 'text/plain') {
                    const reader = new FileReader();
                    reader.readAsText(file);
                    reader.onload = (e) => {
                      setInputText(e.target.result);
                    };
                  } else if (file.type === 'application/pdf') {
                    try {
                      const text = await extractTextFromPDF(file);
                      setInputText(text);
                    } catch (error) {
                      alert('Failed to extract text from PDF file.');
                    }
                  } else if (
                    file.type === 'application/msword' ||
                    file.type ===
                      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                  ) {
                    try {
                      const text = await extractTextFromDocx(file);
                      setInputText(text);
                    } catch (error) {
                      alert('Failed to extract text from Word document.');
                    }
                  } else {
                    alert('Please upload a valid file (txt, pdf, doc, docx)');
                  }
                }}
              />
            </label>
          </div>
        </div>

        <div className="center">
          <SwapButton swapLanguages={swapLanguages} />
        </div>

        <div className="card output-wrapper">
          <div className="to">
            <span className="heading">To :</span>
            <Dropdown
              languages={languages}
              selected={outputLanguage}
              setSelected={setOutputLanguage}
              id="output-language"
            />
          </div>
          <TextArea
            id="output-text"
            value={outputText}
            setValue={setOutputText}
            placeholder="Translated text will appear here"
            disabled={true}
          />
          <div className="card-bottom">
            <p>Download as a document!</p>
            <button
              id="download-btn"
              onClick={() => {
                if (outputText) {
                  // Prepend UTF-8 BOM to help with encoding on mobile devices
                  const bom = '\uFEFF';
                  const blob = new Blob([bom + outputText], { type: 'text/plain;charset=utf-8' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.download = "translated-to-" + outputLanguage + ".txt";
                  a.href = url;
                  a.click();
                }
              }}
            >
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
