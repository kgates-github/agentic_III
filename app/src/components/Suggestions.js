import React, { useEffect, useMemo, useState } from 'react';
import SuggestionCard from './SuggestionCard';
    
function Suggestions(props) {
  const [suggestions, setSuggestions] = useState([]); 
   
  useEffect(() => {
    setSuggestions([]);
    console.log('useEffect getCurPage()', props.navigator.getCurPage());
    const curPage = props.navigator.getCurPage();
    if (curPage) {
      curPage.suggestions
        .then(data => {
          console.log('->->-> data', data);
          setSuggestions(data);
        });
    }
    // const wikiPage = props.navigator.getCurPage();
    // if (wikiPage) fetchWiki(wikiPage.wikiPage);
    
  }, [props.curIndex]);
  
  return (
    <div style={{ 
      paddingTop:"8px", 
      paddingLeft:"12px", 
      maxWidth:"350px", 
      minWidth:"300px", 
      paddingRight:"12px",
      overflowY: 'scroll',
    }}>
      {props.highlightMode == 'highlight' ? suggestions.map((suggestion, index) => (
        <SuggestionCard key={index} suggestion={suggestion} />
      )) : null}
    </div>
  );
}

export default Suggestions;
