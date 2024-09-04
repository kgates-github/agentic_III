import React, { useEffect, useState, useMemo } from 'react';
import { stringToColor } from './helpers';
import { motion } from "framer-motion"


function SuggestionCard(props) {
  const [HTMLContent, setHTMLContent] = useState({ __html : '' });
  const [backgroundColor, setBackgroundColor] = useState(null);
  const titleWidth = Math.floor(Math.random() * 100) + 200;

  useMemo(() => {
    const rgb = stringToColor(props.suggestion.subjectArea);
    setBackgroundColor(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`);
  }, [props.suggestion]);
  
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
      <div style={{fontWeight:'500', marginBottom:"6px", justifyContent:"center", fontFamily:"roboto"}}>
        {props.suggestion.title}
      </div>
      <div style={{marginBottom:"6px"}}>{props.suggestion.summary}</div>
      <div style={{display:"flex", flexDirection:"row", justifyContent:"flex-start", alignItems:"center"}}>
        <span style={{
          padding:"2px 8px",
          borderRadius:"2px",
          background: backgroundColor,
          marginRight:"4px",
          marginBottom:"4px",
          fontSize:"11px",
          color:"#000",
          display:"inline-block",
          textTransform:"capitalize",
        }}>
          {props.suggestion.subjectArea}
        </span>
      </div>
    </div>
  );
}

export default SuggestionCard;

/*
{props.suggestion.topics ? props.suggestion.topics.map((topic, index) => (
        <div>{topic}</div>
      )) : null}
*/


