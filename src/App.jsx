import React, { useState, useEffect } from 'react';
import Dropdown from './components/Dropdown';
import TextArea from './components/TextArea';
import ModeToggle from './components/ModeToggle';
import SwapButton from './components/SwapButton';
import languages from './language/Languages';

const App = () => {
  // State for input and output languages, texts, and dark mode toggle
  const [inputLanguage, setInputLanguage] = useState('auto');
  const [outputLanguage, setOutputLanguage] = useState('en');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [darkMode, setDarkMode] = useState(false);

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
              <span id="upload-title">Choose File</span>
              <ion-icon name="cloud-upload-outline"></ion-icon>
              <input
                type="file"
                id="upload-document"
                hidden
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (
                    file.type === 'application/pdf' ||
                    file.type === 'text/plain' ||
                    file.type === 'application/msword' ||
                    file.type ===
                      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                  ) {
                    const reader = new FileReader();
                    reader.readAsText(file);
                    reader.onload = (e) => {
                      setInputText(e.target.result);
                    };
                  } else {
                    alert('Please upload a valid file');
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
                  const blob = new Blob([outputText], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.download = "translated-to-" + outputLanguage + ".txt";
                  a.href = url;
                  a.click();
                }
              }}
            >
              <span>Download</span>
              <ion-icon name="cloud-download-outline"></ion-icon>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
