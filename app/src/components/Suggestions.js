import React, { useRef, useEffect, useState } from 'react';
import SuggestionCard from './SuggestionCard';
    
function Suggestions(props) {
  const [suggestions, setSuggestions] = useState([]); 
  const intervalRef = useRef(null);

  useEffect(() => {
    setSuggestions([]);
    const curPage = props.navigator.getCurPage();
    
    if (curPage && curPage.suggestions) {
      setSuggestions(curPage.suggestions);
    } else {
      let tries = 0;
      intervalRef.current = setInterval(() => {
        tries++;
        console.log(`Try ${tries}`);
  
        if (curPage && curPage.suggestions && curPage.suggestions !== null) {
          clearInterval(intervalRef.current);
          console.log('!!!! Suggestions found:');
          setSuggestions(curPage.suggestions);
        } else if (tries >= 20) {
          clearInterval(intervalRef.current);
          console.error('Maximum number of tries reached. Suggestions are still null.');
        }
      }, 500); // Check every 100 milliseconds
    }
    // Cleanup interval on component unmount
    return () => clearInterval(intervalRef.current);
}, [props.curIndex]);
  
  return (
    <div style={{ 
      paddingTop:"20px", 
      paddingLeft:"12px", 
      paddingRight:"12px",
      maxWidth:"350px", 
      minWidth:"300px", 
      overflowY: 'scroll',
    }}>
      {props.highlightMode == 'highlight' ? suggestions.map((suggestion, index) => (
        <SuggestionCard 
          key={index} 
          suggestion={suggestion} 
          navigator={props.navigator}
        />
      )) : null}
    </div>
  );
}

export default Suggestions;