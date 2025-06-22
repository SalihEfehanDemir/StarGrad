import { useState } from 'react';
import { FaClipboard } from 'react-icons/fa';
import { motion } from 'framer-motion';

const PasswordGenerator = () => {
  const [length, setLength] = useState(12);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    let charset = 'abcdefghijklmnopqrstuvwxyz';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+~`|}{[]:;?><,./-=';
    
    let newPassword = '';
    for (let i = 0; i < length; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(newPassword);
    setCopied(false);
  };

  const copyToClipboard = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 max-w-2xl">
      <motion.div 
        className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-xl shadow-lg p-6 sm:p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-white">Password Generator</h1>
        
        <div className="relative flex items-center mb-6">
          <input 
            type="text" 
            readOnly 
            value={password} 
            className="p-3 sm:p-4 border border-white/20 rounded-lg w-full bg-black/30 text-white focus:ring-2 focus:ring-brand-blue text-sm sm:text-base" 
            placeholder="Your password will appear here" 
          />
          <button 
            onClick={copyToClipboard} 
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-blue p-2 transition-colors touch-manipulation"
          >
            {copied ? <span className="text-brand-cyan text-xs sm:text-sm font-medium">Copied!</span> : <FaClipboard size="1.2em" />}
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="length" className="block mb-2 font-medium text-gray-200">Password Length: {length}</label>
            <input
              type="range"
              id="length"
              min="4"
              max="32"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
          <div className="space-y-3">
            <div className="flex items-center">
              <input type="checkbox" id="symbols" checked={includeSymbols} onChange={(e) => setIncludeSymbols(e.target.checked)} className="w-4 h-4 text-brand-blue bg-gray-700 border-gray-600 rounded focus:ring-brand-blue" />
              <label htmlFor="symbols" className="ml-2 text-sm font-medium text-gray-200">Include Symbols</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="numbers" checked={includeNumbers} onChange={(e) => setIncludeNumbers(e.target.checked)} className="w-4 h-4 text-brand-blue bg-gray-700 border-gray-600 rounded focus:ring-brand-blue" />
              <label htmlFor="numbers" className="ml-2 text-sm font-medium text-gray-200">Include Numbers</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="uppercase" checked={includeUppercase} onChange={(e) => setIncludeUppercase(e.target.checked)} className="w-4 h-4 text-brand-blue bg-gray-700 border-gray-600 rounded focus:ring-brand-blue" />
              <label htmlFor="uppercase" className="ml-2 text-sm font-medium text-gray-200">Include Uppercase</label>
            </div>
          </div>
        </div>

        <button 
          onClick={generatePassword} 
          className="w-full bg-brand-blue hover:bg-blue-700 text-white font-bold py-3 sm:py-4 px-4 rounded-lg flex items-center justify-center transition-all duration-300 shadow-glow-blue hover:shadow-glow-blue-hover touch-manipulation text-sm sm:text-base"
        >
                      Generate Password
        </button>
      </motion.div>
    </div>
  );
};

export default PasswordGenerator; 