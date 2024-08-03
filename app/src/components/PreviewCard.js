import React, { useEffect, useState, useMemo } from 'react';
import { motion } from "framer-motion"


function PreviewCard(props) {
  const [HTMLContent, setHTMLContent] = useState({ __html : '' });
  const [titleWidth, setTitleWidth] = useState(Math.floor(Math.random() * 200) + 100);
 

  const fetchWikiSummary = async(wikiPage) => {
    try {
      const response = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${wikiPage}`
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.log('fetchWikiSummary error: ', error.message);
    }
  }

  useEffect(() => {
    if (props.highlightedLink.wikiPage && !props.isScrolling) {
      setHTMLContent({ __html: '' });

      async function fetchWiki() {
        const newWikiSummary = await fetchWikiSummary(props.highlightedLink.wikiPage);
        
        if (props.index === 0) {
          setHTMLContent(
            { __html: `
              <div style="line-height:1.4em;">
                <div style="font-weight:500;  background:#FFE604; padding: 4px 12px;">${newWikiSummary.title}</div>
                <div style="font-weight:300; font-style:italic; padding-left:12px; padding-top:4px;">${newWikiSummary.description}</div> 
                <div style="font-weight:400; padding-left:12px; padding-top:4px;
                overflow:hidden; 
                -webkit-box-orient: vertical;">${newWikiSummary.extract}</div>
              </div>`
            }
          );
        } else {
          setHTMLContent(
            { __html: `
              <div style="line-height:1.4 em;">
                <div style="font-weight:500; display:inline-block; background:#ddd; padding: 4px 12px">${newWikiSummary.title}</div>
                <div style="font-weight:300; font-style:italic; padding-left:12px; padding-top: 4px;">${newWikiSummary.description}</div> 
              </div>`
            }
          );
        }
      }
      fetchWiki();
    } else {
      setHTMLContent({ __html: `
        <div style="line-height:1.4 em;">
          <div style="font-weight:500; display:inline-block; width:${titleWidth}px; height:16px; background:#f6f6f6; padding: 4px 12px"> </div>
          <div style="font-weight:300; font-style:italic; padding-left:12px; padding-top: 4px;"></div> 
        </div>`
      });
    }
  }, [props.highlightedLink.wikiPage, props.isScrolling]);
  
  useEffect(() => {
    //console.log('useEffect props.highlightedLink', props.highlightedLink.text);
  }, [props.highlightedLink.text]);
  
  return (
    <div  
      onClick={() => props.navigator.handleLinkClick(props.highlightedLink.link)}
      style={{ 
        //background:"#FFE604",
        borderBottom:"1px solid #eee",
        paddingTop:"12px",
        paddingBottom:"12px",
        //maxWidth: `400px`,
        minHeight: props.index == 0 ? '140px' : '34px',
        pointerEvents: "auto",
        overflow: "hidden",
        cursor:"pointer",
        //boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.3)",
      }}
      dangerouslySetInnerHTML={HTMLContent} 
    />
  );
}

export default PreviewCard;




