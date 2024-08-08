import React, { useEffect, useState, useContext, useRef, useMemo } from 'react';
import { useAnimation, motion } from "framer-motion"
import Page from './Page';
import LinkPreviews from './LinkPreviews';
import Suggestions from './Suggestions';
import { GlobalContext } from './GlobalContext';


function PageViewer(props) {
  const [backButtonDisabled, setBackButtonDisabled] = useState(true);
  const [forwardButtonDisabled, setForwardButtonDisabled] = useState(true);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [highlightedLinks, setHighlightedLinks] = useState([]);
  const [isScrolling, setIsScrolling] = useState(false);  
  const { GLOBAL_WIDTH } = useContext(GlobalContext);
  const pageViewerRef = useRef(null);
  const [toggleStateRight, setToggleStateRight] = useState(props.openAI ? 'suggestions' : 'preview')
  const [toggleStateLeft, setToggleStateLeft] = useState('summary')


  useEffect(() => {
    // Handler to capture keydown events
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        // Left arrow key pressed
        if (!backButtonDisabled) {
          props.navigator.moveBack();
        }
      } else if (event.key === 'ArrowRight') {
        // Right arrow key pressed
        if (!forwardButtonDisabled) {
          props.navigator.moveForward();
        }
      } else if (event.key === ' ' || event.keyCode === 32) {
        event.preventDefault(); 
        props.changeHighlightMode();
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [backButtonDisabled, forwardButtonDisabled, props.navigator, props.highlightMode]);

  useMemo(() => {
    setBackButtonDisabled(props.navigator.getBackButtonDisabled());
    setForwardButtonDisabled(props.navigator.getForwardButtonDisabled());
  }, [props.curIndex, props.pageQueueLength]);

  return (
    <>
      <div style={{
        display:"flex", 
        flexDirection:"row", 
        height:"calc(100vh - 80px)",
        width:"100%",
        position:"fixed",
        pointerEvents: "auto", 
        zIndex: '0',
        background: 'none',
      }}>
        <div style={{flex:1, background:"none", zIndex:"1"}}></div>
        <div 
          id="page-viewer"
          ref={pageViewerRef}
          style={{
            marginBottom:"400px", 
            marginTop:"48px",
            background:"none",
            width:`${GLOBAL_WIDTH.current}px`,
            height:"calc(100vh - 80px)",
            overflowY:"visible",
            overflowX:"visible",
            background:"none",
            opacity: 1,
          }}
        >
          <motion.div 
            animate={props.scrollXControls}
            style={{
              display:"flex", 
              flexDirection:"row", 
              background:"none",
              width: props.wikiPages.length * GLOBAL_WIDTH.current 
            }}>
              
            {props.wikiPages.map((wikiPage, index) => (
              <Page 
                key={"page_"+index} 
                navigator={props.navigator} 
                wikiPage={wikiPage} 
                doRender={wikiPage.doRender}
                highlightMode={props.highlightMode} 
                setHighlightedLinks={setHighlightedLinks}
                highlightedLinks={highlightedLinks}
                toggleStateRight={toggleStateRight}
                curIndex={props.curIndex}
                setIsScrolling={setIsScrolling}
              />
            ))}
          </motion.div>
        </div>
        <div style={{flex:1, background:"none"}}></div>
      </div>
      <div style={{
        display:"flex", 
        flexDirection:"row", 
        height:"calc(100vh - 80px)",
        width:"100%",
        position:"fixed",
        pointerEvents: "none", 
      }}>
        <div style={{ flex:1, background:"white", opacity:"0.8" }}>
          <div style={{
            background:"#f1f1f1",
            height:"48px",
          }}></div>
        </div>
        <div style={{
          background:"none", 
          width:`${GLOBAL_WIDTH.current}px`, 
          height:"calc(100vh - 80px)",
          borderLeft:"1px solid #ccc",
          borderRight:"1px solid #ccc",
        }}>
          <div style={{
            display:"flex", 
            flexDirection:"row", 
            background:"#f6f6f6",
            height:"48px",
            alignItems:"center",
            paddingLeft:"20px",
            paddingRight:"20px",
            pointerEvents: "auto", 
          }}>
            <div id="arrowleft" onClick={() => { props.navigator.moveBack() }} style={{cursor:"pointer",}}>
              <i className="material-icons" style={{fontSize:"28px", color: backButtonDisabled ? "#ccc" : "#555"}}>arrow_circle_left</i>
            </div>
            <div onClick={() => { props.navigator.moveForward() }} style={{cursor:"pointer", marginLeft:"2px"}}>
              <i className="material-icons" style={{fontSize:"28px", color: forwardButtonDisabled ? "#ccc" : "#555"}}>arrow_circle_right</i>
            </div>
            <div style={{flex:1, background:"none"}}></div>
            <div id="toggle" onClick={() => { props.changeHighlightMode() }} 
              style={{cursor:"pointer", display: "flex", alignItems: "center",}}>
              <i className="material-icons" style={{
                fontSize:"40px", 
                color: props.highlightMode == 'highlight' ? "#666" : "#666",
              }}>
                {props.highlightMode == 'highlight' ? "toggle_on" : "toggle_off"}
              </i>
            </div>
          </div>

        </div>
        <div style={{ flex:1, background:"white", opacity:"0.8" }}>
          <div style={{
            background:"#f1f1f1",
            height:"48px",
            //borderBottom:"1px solid #ccc",
          }}></div>
        </div>
      </div>
      
      <div 
        style={{
          position: "fixed", 
          display: props.highlightMode == 'highlight' ? "flex" : "none",
          flexDirection: "row",
          width: "100%",
          height:"calc(100vh - 80px)",
          pointerEvents: "none" ,
          background: "none", 
          //border:"3px solid red",
        }}
      >
        <div style={{ 
          flex: 1, display: 'flex', 
          flexDirection:"column", 
          alignItems: 'flex-end', 
          background:"white",
          borderRight:"1px solid #ccc",
          }}>
          <div style={{ 
            background:"#f1f1f1", 
            height:"48px", 
            width:"100%",
            display: 'flex',
            justifyContent: 'flex-end',
            }}>
            {/* Toggle Control */}
            <div style={{ 
              display: 'flex', 
              alignItems: "center", 
              paddingLeft: "12px", 
              paddingRight: "12px", 
              height: "100%",
              maxWidth: "400px",
              minWidth: "300px",
            }}>
              <button
                onClick={() => setToggleStateLeft(toggleStateLeft == 'summary' ? 'menu' : 'summary')}
                style={{
                  flex:"1",
                  padding: '6px 20px',
                  backgroundColor: toggleStateLeft === 'summary' ? '#555' : '#f1f1f1',
                  color: toggleStateLeft === 'summary' ? '#fff' : '#000',
                  fontWeight: toggleStateLeft === 'menu' ? '600' : '400',
                  borderTopLeftRadius:"4px",
                  borderBottomLeftRadius:"4px",
                  cursor: 'pointer',
                  textTransform: "uppercase",
                  height:"28px",
                  border:"1px solid #999",
                  fontSize: "10px",
                  pointerEvents: "auto",
                }}
              >
                Summary
              </button>
              <button
                onClick={() => setToggleStateLeft(toggleStateLeft == 'summary' ? 'menu' : 'summary')}
                style={{
                  flex:"1",
                  padding: '6px 20px',
                  backgroundColor: toggleStateLeft === 'menu' ? '#555' : '#f1f1f1',
                  color: toggleStateLeft === 'menu' ? '#fff' : '#000',
                  fontWeight: toggleStateLeft === 'summary' ? '600' : '400',
                  borderTopRightRadius:"4px",
                  borderBottomRightRadius:"4px",
                  cursor: 'pointer',
                  textTransform: "uppercase",
                  height:"28px",
                  borderTop:"1px solid #999",
                  borderRight:"1px solid #999",
                  borderLeft:"0px solid #555",
                  borderBottom:"1px solid #999",
                  fontSize: "10px",
                  pointerEvents: "auto",
                }}
              >
                Contents
              </button>
            </div>
          </div>

          <div style={{
            display: (toggleStateLeft == 'summary') ? "block" : "none",
            maxWidth: "300px",
            minWidth: "300px",
            padding: "12px",
            marginTop: "12px",
            lineHeight: "1.5em",
          }}>
            <div style={{fontStyle: "italic", color:"#999", marginBottom:"6px"}}>
              {props.wikiPageTitle }: {props.wikiPageDescription}
            </div> 
            <div>{props.wikiPageSummary}</div>
          </div>
          <div style={{
            display: (toggleStateLeft == 'menu') ? "block" : "none",
            maxWidth: "300px",
            minWidth: "300px",
            height:"calc(100vh - 180px)",
            padding: "12px",
            marginTop: "12 px",
            overflowY: "scroll",
            background: "none",
          }}>
            {props.wikiPageTableOfContents ? props.wikiPageTableOfContents.map((section, index) => (
              <div key={index} style={{
                marginBottom:"8px", 
                paddingLeft:`${(section.level-1)*12}px`,
                cursor: "pointer",
                whiteSpace: "nowrap", 
                overflow: "hidden", 
                textOverflow: "ellipsis",
                //paddingBottom: "1px",
                //paddingTop: "1px",
                //marginTop: section.level == 2 ? "12px" : "none",
                fontWeight: section.level == 2 ? 500 : 400,
                color: section.level == 2 ? "#000" :"#888",
              }}>
                {section.line}
              </div>
            )) : null}
          </div>
        </div>

        <div style={{ width:`${GLOBAL_WIDTH.current}px`, background:"none"}}></div>
        
        <div style={{ flex:1, backgroundColor: "rgba(255, 255, 255, 0.8)", borderLeft:"1px solid #ccc"}}>
          <div style={{ background:"#F9F9F9", height:"48px", }}>
            {/* Toggle Control */}
            {props.openAI ? (
            <div style={{ 
              display: 'flex', 
              alignItems: "center", 
              paddingLeft: "12px", 
              paddingRight: "12px", 
              height: "100%",
              background: "none",
              maxWidth: "300px",
              minWidth: "300px",
            }}>
              <button
                onClick={() => setToggleStateRight(toggleStateRight == 'suggestions' ? 'preview' : 'suggestions')}
                style={{
                  flex:"1",
                  padding: '6px 20px',
                  backgroundColor: toggleStateRight === 'suggestions' ? '#555' : '#f1f1f1',
                  color: toggleStateRight === 'suggestions' ? '#fff' : '#000',
                  fontWeight: toggleStateRight === 'preview' ? '600' : '400',
                  borderTopLeftRadius:"4px",
                  borderBottomLeftRadius:"4px",
                  cursor: 'pointer',
                  textTransform: "uppercase",
                  height:"28px",
                  border:"1px solid #999",
                  fontSize: "10px",
                  pointerEvents: "auto",
                }}
              >
                Suggestions
              </button>
              <button
                onClick={() => setToggleStateRight(toggleStateRight == 'suggestions' ? 'preview' : 'suggestions')}
                style={{
                  flex:"1",
                  padding: '6px 20px',
                  backgroundColor: toggleStateRight === 'preview' ? '#555' : '#f1f1f1',
                  color: toggleStateRight === 'preview' ? '#fff' : '#000',
                  fontWeight: toggleStateRight === 'preview' ? '600' : '400',
                  borderTopRightRadius:"4px",
                  borderBottomRightRadius:"4px",
                  cursor: 'pointer',
                  textTransform: "uppercase",
                  height:"28px",
                  borderTop:"1px solid #999",
                  borderRight:"1px solid #999",
                  borderLeft:"0px solid #555",
                  borderBottom:"1px solid #999",
                  fontSize: "10px",
                  pointerEvents: "auto",
                }}
              >
                Link Previews
              </button>
            </div>) : 
              <div style={{ 
                display: 'flex', 
                alignItems: "center", 
                paddingLeft: "12px", 
                height: "100%",
                fontSize: "10px",
                fontWeight: "600",
                color: "#666",
                textTransform: "uppercase",
              }}>Link Previews</div>
            }
          </div>
          
          <div style={{
            display: (props.openAI && toggleStateRight == 'suggestions') ? "block" : "none",
            maxWidth: "324px",
            minWidth: "324px",
          }}>
            <Suggestions 
              highlightMode={props.highlightMode}
              highlightedLinks={highlightedLinks}
              navigator={props.navigator}
              curIndex={props.curIndex}
              openAI={props.openAI}
            /> 
          </div>
          <div style={{
            display: ((props.openAI && toggleStateRight == 'preview')) || !props.openAI ? "block" : "none",
          }}>
            <LinkPreviews 
              highlightMode={props.highlightMode}
              highlightedLinks={highlightedLinks}
              navigator={props.navigator}
              isScrolling={isScrolling}
            /> 
          </div>

        </div>
      </div>
    </>
  
  );
}

export default PageViewer;



