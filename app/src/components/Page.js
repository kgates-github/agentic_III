import React, { useEffect, useState, useRef, useContext, } from 'react';
import LinkHighlighter from './LinkHighlighter';
import { GlobalContext } from './GlobalContext';


function Page(props) {
  const [HTMLContent, setHTMLConent] = useState({ __html: '' });
  const { GLOBAL_WIDTH } = useContext(GlobalContext);
  const containerRef = useRef(null);
  const pageRef = useRef(null);
  

  const getFilters = (highlightMode, isCurPage) => {
    if (highlightMode == "dormant" && !isCurPage) return "grayscale(100%)";
    if (highlightMode == "preview") return "grayscale(100%) opacity(0.3)";
    if (highlightMode == "highlight") return "grayscale(100%)"; 
    return "none";
  }

  const replacementFunction = (match, href) => {
    if (href.includes('wiki')) {
      return match;
    } else {
      return '';
    }
  };

  const fetchWikiSummary = async(wikiPage) => {
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${wikiPage}`
    );

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const data = await response.json();
  }

  const fetchWikiPage = async(wikiPage) => {
    try {
      const pattern = /<a\s+[^>]*href=["'][^"']*?([^"']*wiki[^"']*|[^"'>]*)["'][^>]*>(.*?)<\/a>/gi;
    
      // https://en.wikipedia.org/w/api.php?action=query&format=json&titles=OpenAI&prop=info&inprop=url&origin=*
      // https://en.wikipedia.org/w/api.php?action=query&format=json&pageids=12345678&prop=revisions&rvprop=content&origin=*

      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=parse&page=${wikiPage.wikiPage}&format=json&origin=*`
      );

      if (!response.ok) throw new Error(`Error fetching data: ${response.statusText}`);
    
      const data = await response.json();
      let truncatedText = data.parse.text["*"].split("References")[0];
      const title = data.parse.title;

      if (!wikiPage.wordCount) {
        wikiPage.wordCount = truncatedText.split(/\s+/).length;
        wikiPage.title = title;
        props.navigator.updateHistory(wikiPage);
      }
      
      // Apply the replacement function to the truncatedText
      let cleanedText = truncatedText.replace(pattern, replacementFunction);
      cleanedText = cleanedText.replace(/\[|\]/g, '');

      // Once we have text, update wordCount

      return {
        title: title,
        text: cleanedText
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const isRendered = () => {
    return HTMLContent && HTMLContent.__html && HTMLContent.__html.trim() !== '';
  }

  useEffect(() => {
    if (props.doRender && (!isRendered() || 
      props.wikiPage.prevWikiPage != props.wikiPage.wikiPage)) {
      setHTMLConent({ __html: ``});
      
      async function fetchWiki() {
        const newWikiPage = await fetchWikiPage(props.wikiPage);
        
        try {
          setHTMLConent(
            { __html: `
              <div class="title-header">${newWikiPage.title}</div>
              ${newWikiPage.text}`  
            }
          );
        } catch (error) {
          console.log('Error setting HTMLContent: ', error.message);
          setHTMLConent(
            { __html: `
              <div class="title-header">Error</div>
              There was an error loading the page: ${props.wikiPage.wikiPage}. <br/>You may need to check you internet connection`  
            }
          );
        }
        
      }
      fetchWiki();
    } else {
      setHTMLConent({ __html: '' });
    }
  }, [props.doRender, props.wikiPage.wikiPage]);

  
  return (
   <div 
    id={props.wikiPage.id}
    ref={pageRef}
    style={{
      position: 'relative',
      lineHeight:"1.6em",
      width:`${GLOBAL_WIDTH.current}px`, 
      paddingRight:"20px",
      paddingLeft:"20px", 
      height:"calc(100vh - 80px)", 
      overflowY:"scroll", 
      overflowX:"hidden", 
      pointerEvents:"auto",
      background:"none",
    }}>  
      <div 
        style={{ 
          position:'absolute', 
          width:`${GLOBAL_WIDTH.current}px`,
          paddingRight:"20px",
          paddingBottom: `${window.innerHeight}px`,
          filter: getFilters(props.highlightMode, props.wikiPage.isCurPage),  pointerEvents: "auto",}}
        dangerouslySetInnerHTML={HTMLContent} 
      />
      {props.wikiPage.isCurPage && props.toggleStateRight == "preview" && (
        <div 
          ref={containerRef} 
          style={{
            position:'absolute', zIndex:'100000',
            top:'0', left:'0', 
            width:'100%', height:'100%',   
            background:'none',
            pointerEvents: "none"
          }}
        >
          <LinkHighlighter 
            navigator={props.navigator}
            highlightMode={props.highlightMode} 
            setHighlightedLinks={props.setHighlightedLinks}
            highlightedLinks={props.highlightedLinks}
            toggleStateRight={props.toggleStateRight}
            curIndex={props.curIndex}
            containerRef={containerRef}
            pageRef={pageRef}
            setIsScrolling={props.setIsScrolling}
          />
        </div>
      )}
    </div>
  );
}

export default Page;

/*
 {props.wikiPage.isCurPage && (
        <LinkHighlighter 
          navigator={props.navigator} 
          highlightMode={props.highlightMode} 
          curIndex={props.curIndex}
        />
      )}
{
    "<p>The <b>Old Swiss Confederacy</b>, also known as <b>Switzerland</b> or the <b>Swiss Confederacy</b>, was a loose confederation of independent small states, initially within the Holy Roman Empire. It is the precursor of the modern state of Switzerland.</p>"
}*/



