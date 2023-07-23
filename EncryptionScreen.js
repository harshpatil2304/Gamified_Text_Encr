import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import './EncryptionScreen.css';

const words = [
  'apple',
  'table',
  'plant',
  'teeth',
  'shirt',
  'sweep',
  'prize',
  'round',
  'house',
  'cloud'
];

function EncryptionScreen() {
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [encryptedText, setEncryptedText] = useState('');
  const [encryptionKey, setEncryptionKey] = useState('');
  const [targetWord, setTargetWord] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [correctPositions, setCorrectPositions] = useState([]);
  const [isWordGuessed, setIsWordGuessed] = useState(false);
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    setTargetWord(selectRandomWord());
  }, []);

  const selectRandomWord = () => {
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
  };

  const handleGuess = () => {
    if (guess.length === 5 && !isWordGuessed) {
      setGuesses([...guesses, guess]);

      const correctPositions = [];
      for (let i = 0; i < guess.length; i++) {
        if (guess[i] === targetWord[i]) {
          correctPositions.push(i);
        }
      }
      setCorrectPositions(correctPositions);

      if (guess === targetWord) {
        setIsWordGuessed(true);
        setIsEncrypting(true);
      }

      setGuess('');
    }
  };

  const handleTextChange = (event) => {
    if (isEncrypting) {
      setMessage(event.target.value.slice(0, 1024));
    } else {
      setGuess(event.target.value.toLowerCase().slice(0, 5));
    }
  };

  const handleEncrypt = () => {
    if (isEncrypting) {
      const combinedText = combineText();
      const { encrypted, key } = encryptText(combinedText);
      setEncryptedText(encrypted);
      setEncryptionKey(key);
      setIsEncrypting(false);
    }
  };

  const combineText = () => {
    const allWords = [...guesses, targetWord];
    const combinedText = allWords.join(' ') + ' ' + message;
    return combinedText;
  };

  const encryptText = (text) => {
    const key = generateEncryptionKey();
    const encrypted = CryptoJS.AES.encrypt(text, key).toString();
    return { encrypted, key };
  };

  const generateEncryptionKey = () => {
    return CryptoJS.SHA256(message).toString();
  };

  const handleNewGame = () => {
    setTargetWord(selectRandomWord());
    setGuesses([]);
    setCorrectPositions([]);
    setIsWordGuessed(false);
    setIsEncrypting(false);
    setGuess('');
    setMessage('');
    setEncryptedText('');
    setEncryptionKey('');
  };

  const handleFileSelection = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleFileEncryption = () => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        const fileContent = reader.result;
        const { encrypted, key } = encryptText(fileContent);
        downloadEncryptedFile(encrypted, selectedFile.name + '.enc');
        setEncryptionKey(key);
      };
      reader.readAsText(selectedFile);
    }
  };

  const downloadEncryptedFile = (encryptedData, fileName) => {
    const encryptedBlob = new Blob([encryptedData], { type: 'text/plain' });
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(encryptedBlob);
    downloadLink.download = fileName;
    downloadLink.click();
  };

  const handleFileDecryption = () => {
    if (selectedFile && encryptionKey) {
      const reader = new FileReader();
      reader.onload = () => {
        const encryptedData = reader.result;
        const decrypted = decryptText(encryptedData);
        downloadDecryptedFile(decrypted, selectedFile.name.replace('.enc', ''));
      };
      reader.readAsText(selectedFile);
    }
  };

  const decryptText = (encryptedData) => {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, encryptionKey).toString(CryptoJS.enc.Utf8);
    return decrypted;
  };

  const downloadDecryptedFile = (decryptedData, fileName) => {
    const decryptedBlob = new Blob([decryptedData], { type: 'text/plain' });
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(decryptedBlob);
    downloadLink.download = fileName;
    downloadLink.click();
  };

  const getLetterColor = (letter, index) => {
    if (correctPositions.includes(index)) {
      return 'green';
    } else if (targetWord.includes(letter)) {
      return 'yellow';
    } else {
      return 'grey';
    }
  };

  return (
    <div className="encryption-screen">
      <h2 className="encryption-screen-title">Text Encryption</h2>
      <div className="game-section">
        <p className="instruction">Guess a five-letter word:</p>
        <div className="guess-input-section">
          <input
            type="text"
            value={guess}
            onChange={handleTextChange}
            placeholder="Enter your guess"
            className="guess-input"
          />
          <button onClick={handleGuess} className="guess-button">Guess</button>
        </div>
        <div className="guess-history">
          {guesses.map((guessedWord, index) => (
            <div key={index} className="guess-item">
              <span className="guess-word">
                {guessedWord.split('').map((letter, i) => (
                  <span key={i} style={{ color: getLetterColor(letter, i) }}>
                    {letter}
                  </span>
                ))}
              </span>
              <div className="guess-feedback">
                {[...Array(5)].map((_, posIndex) => (
                  <span
                    key={posIndex}
                    className={`guess-feedback-dot ${correctPositions.includes(posIndex) ? 'correct' : ''}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        {isWordGuessed && !isEncrypting && (
          <>
            <p className="word-guessed-message">Congratulations! You guessed the word!</p>
            <button onClick={() => setIsEncrypting(true)} className="encryption-encrypt-button">Encrypt</button>
          </>
        )}
        {isEncrypting && (
          <>
            <p className="instruction">Enter a message to encrypt:</p>
            <div className="guess-input-section">
              <input
                type="text"
                value={message}
                onChange={handleTextChange}
                placeholder="Enter your message"
                className="guess-input"
              />
              <button onClick={handleEncrypt} className="guess-button">Encrypt</button>
            </div>
          </>
        )}
      </div>
      {encryptedText && (
        <div className="encryption-result-section">
          <h3 className="encryption-result-title">Encrypted Text:</h3>
          <div className="encryption-encrypted-text">{encryptedText}</div>
          <div className="encryption-key-section">
            <h3 className="encryption-key-title">Encryption Key:</h3>
            <div className="encryption-key">{encryptionKey}</div>
          </div>
        </div>
      )}
      <div className="file-encryption-section">
        <h3 className="file-encryption-title">File Encryption</h3>
        <input type="file" onChange={handleFileSelection} className="file-input" />
        <button onClick={handleFileEncryption} className="file-encryption-button">Encrypt File</button>
      </div>
      <div className="file-decryption-section">
        <h3 className="file-decryption-title">File Decryption</h3>
        <input type="file" onChange={handleFileSelection} className="file-input" />
        <button onClick={handleFileDecryption} className="file-decryption-button">Decrypt File</button>
      </div>
      <button onClick={handleNewGame} className="new-game-button">Start New Game</button>
    </div>
  );
}

export default EncryptionScreen;
