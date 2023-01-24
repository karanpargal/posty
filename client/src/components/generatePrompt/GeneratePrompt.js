import React, { useState, useEffect } from 'react';

function GeneratePrompt() {
  const [result, setResult] = useState([]);
  const prompt = "Can you try to rephrase this prompt?"

  const handleClick = () => {
    fetch(`http://localhost:8000/api/rephrasePrompt/?prompt=${prompt}`)
      .then(response => response.json())
      .then(data => setResult(data.message))
  }

  return (
    <div>
      <h1>Rephrase Prompt</h1>
      <p>{result}</p>
      <button onClick={handleClick}>Click me</button>
    </div>
  );
}
export default GeneratePrompt;