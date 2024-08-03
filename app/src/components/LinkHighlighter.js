import React, { useEffect, useMemo} from 'react';
import HighlightedLink from './HighlightedLink';
import { motion } from "framer-motion"

function LinkHighlighter(props) {
  
  const highlightLinks = (retryCount = 0) => {
    const curPage = props.navigator.getCurPage();
    const links = document.querySelectorAll(`#${curPage.id} a`);

    if (!links.length && retryCount < 3) { // Check if no links are found and retry count is less than 3
      setTimeout(() => {
        highlightLinks(retryCount + 1); 
      }, 500); 
      return;
    }
    
    const visibleLinks = Array.from(links).filter(link => {
      if (!link) return false; // If we can't get the bounding rect, return false

      const rect = link.getBoundingClientRect() ? link.getBoundingClientRect() : {top: 0, left: 0, bottom: 0, right: 0};
      const isVisible = rect.top >= 180 && rect.left >= 0 && 
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && 
        rect.right <= (window.innerWidth || document.documentElement.clientWidth);
      
        const isNotImageOrSVG = !/\.(svg|png|gif|jpeg|jpg)$/i.test(link.href) && 
          !/(Special|Help|Wikipedia):/i.test(link.href) && !/google\.com/i.test(link.href);
      return isVisible && isNotImageOrSVG;
    });

    if (!props.containerRef.current) return false;
    const containerRect = props.containerRef.current.getBoundingClientRect();

    props.setHighlightedLinks(visibleLinks.splice(0, 6).map((link, index) => {
      const linkRect = link.getBoundingClientRect();

      return {
        link: link.href,
        id: 'highlighted-link-' + index,
        wikiPage: link.href.split('/wiki/')[1],
        text: link.innerText,
        left: linkRect.left - containerRect.left - 8,
        top:  linkRect.top - containerRect.top - 6
      }
    }));
  }

  /*useMemo(() => {
    if (props.highlightMode === 'dormant') {
      props.setHighlightedLinks([]);
    } else {
        highlightLinks();
    }
  }, [props.curIndex, props.highlightMode]);*/

  useEffect(() => {
    if (props.highlightMode === 'highlight' && props.toggleStateRight === 'preview') {
      highlightLinks();
      const page = props.pageRef.current;
      let scrollTimeout = null; 
        
      const handleScroll = () => {
        props.setIsScrolling(true);
        highlightLinks();
        clearTimeout(scrollTimeout);

        // Set a new timeout
        scrollTimeout = setTimeout(() => {
          props.setIsScrolling(false); 
        }, 150);
      };

      if (page) page.addEventListener("scroll", handleScroll);
      
      return () => {
        if (page) {
          page.removeEventListener("scroll", handleScroll);
        }
      };
    } else {
      props.setHighlightedLinks([]);
    }
  }, [props.highlightMode, props.pageRef, props.curIndex]); 

  
  return (
    <div>
      {props.highlightedLinks.map((link, index) => (
        <HighlightedLink 
          key={index} 
          link={link} 
          highlightMode={props.highlightMode} 
          navigator={props.navigator}
          index={index}
          containerRef={props.containerRef}
        />
      ))}
    </div>
  );
}

export default LinkHighlighter;

/*
{
    "<p>The <b>Old Swiss Confederacy</b>, also known as <b>Switzerland</b> or the <b>Swiss Confederacy</b>, was a loose confederation of independent small states, initially within the Holy Roman Empire. It is the precursor of the modern state of Switzerland.</p>"
}*/



