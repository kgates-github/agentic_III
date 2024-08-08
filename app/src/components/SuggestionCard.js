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
        borderBottom:"1px solid #ccc",
        paddingTop:"12px",
        paddingBottom:"12px",
        width: `100%`,
        minHeight: props.index == 0 ? '140px' : '34px',
        pointerEvents: "auto",
        overflow: "hidden",
        cursor:"pointer",
        lineHeight:"1.2em",
        display:"flex",
        flexDirection:"column",
        justifyContent:"center",
      }}
    >
      <div style={{fontWeight:'600', marginBottom:"6px", justifyContent:"center",}}>
        {props.suggestion.title}
      </div>
      <div style={{marginBottom:"6px"}}>{props.suggestion.summary}</div>
      {/*<div style={{marginBottom:"6px", color:"#999"}}>{props.suggestion.topics ? props.suggestion.topics.join(', ') : ''}</div>*/}
    </div>
  );
}

export default SuggestionCard;

/*
{props.suggestion.topics ? props.suggestion.topics.map((topic, index) => (
        <div>{topic}</div>
      )) : null}
*/


