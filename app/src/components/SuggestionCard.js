import React, { useEffect, useState, useMemo } from 'react';
import { motion } from "framer-motion"


function SuggestionCard(props) {
  const [HTMLContent, setHTMLContent] = useState({ __html : '' });
  const titleWidth = Math.floor(Math.random() * 100) + 200;

  useMemo(() => {
    
  }, [props.suggestion.wikiPage]);
  
  return (
    <div  
      onClick={() => props.navigator.handleLinkClick(props.suggestion.wikiPage)}
      style={{ 
        borderBottom:"1px solid #eee",
        paddingTop:"12px",
        paddingBottom:"12px",
        maxWidth: `400px`,
        minHeight: props.index == 0 ? '140px' : '34px',
        pointerEvents: "auto",
        overflow: "hidden",
        cursor:"pointer",
        lineHeight:"1.2em",
        display:"flex",
        flexDirection:"column",
        //alignItems:"center",
        justifyContent:"center",
      }}
    >
      <div style={{fontWeight:'600', marginBottom:"6px", justifyContent:"center",}}>
        {props.suggestion.title}
      </div>
      <div style={{marginBottom:"6px"}}>{props.suggestion.summary}</div>
    </div>
  );
}

export default SuggestionCard;

/*
{props.suggestion.topics ? props.suggestion.topics.map((topic, index) => (
        <div>{topic}</div>
      )) : null}
*/


