import React, { useEffect, useMemo, useState } from 'react';
import PreviewCard from './PreviewCard';
    
function LinkPreviews(props) {
  
  return (
    <div style={{ 
      paddingTop:"8px", 
      paddingLeft:"12px", 
      maxWidth:"350px", 
      minWidth:"300px", 
      paddingRight:"12px" 
    }}>
      {props.highlightMode == 'highlight' ? props.highlightedLinks.map((highlightedLink, index) => (
        <PreviewCard 
          key={highlightedLink.id} 
          index={index}
          navigator={props.navigator}
          highlightedLink={highlightedLink} 
          highlightMode={props.highlightMode} 
          isScrolling={props.isScrolling}
        />
      )) : null}
    </div>
  );
}

export default LinkPreviews;
