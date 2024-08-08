import React, { useEffect, useState, useRef, useContext } from 'react';
import { useAnimation, motion } from "framer-motion"
import PageViewer from './PageViewer2';
import WikipediaNavigator from '../utils/WikipediaNavigator';
import TabBar from './TabBar';
import HistoryViewer from './HistoryViewer';
import CoachTips from './CoachTips';
import { randomWikipediaPages } from './helpers';
import { GlobalContext } from './GlobalContext';


function WikipediaExplorer(props) {
  const [tab, setTab] = useState('browse');
  const [navigator, setNavigator] = useState(null);
  const [curIndex, setCurIndex] = useState(null);
  const [wikiPageSummary, setWikiPageSummary] = useState(null);
  const [wikiPageDescription, setWikiPageDescription] = useState(null);
  const [wikiPageTitle, setWikiPageTitle] = useState(null);
  const [wikiPageTableOfContents, setWikiPageTableOfContents] = useState([]); 
  const [pageQueueLength, setPageQueueLength] = useState(0);
  const [wikiPages, setWikiPages] = useState([]);
  const { GLOBAL_WIDTH } = useContext(GlobalContext);
  const scroll_x = useRef(0);
  const scrollXControls = useAnimation();

  function toggleTab(tab) {
    setTab(tab);
  }

  useEffect(() => {
    setNavigator(
      new WikipediaNavigator(
        setWikiPages, 
        scroll_x, 
        scrollXControls, 
        setCurIndex,
        GLOBAL_WIDTH,
        setPageQueueLength,
        props.openAI,
        setWikiPageSummary,
        setWikiPageDescription,
        setWikiPageTitle,
        setWikiPageTableOfContents,
    ));
  }, []);

  useEffect(() => {
    if (!navigator) return;
     // Capture all anchor clicks and prevent default behavior
    document.addEventListener('click', function(event) {
      let target = event.target.closest('a');

      if (target) {
        event.preventDefault();
        navigator.handleLinkClick(target.href)
      }
    });

    const randPage = randomWikipediaPages[
      Math.floor(Math.random() * randomWikipediaPages.length)
    ];

    navigator.addPageToQueue(randPage.page);
  }, [navigator]);

  return (
    <>
      <TabBar toggleTab={toggleTab} tab={tab} />
      {
        (navigator) ? (
          <>
          <div style={{display: tab == 'browse' ? 'block' : 'none'}}>
            <PageViewer 
              navigator={navigator} 
              curIndex={curIndex} 
              wikiPages={wikiPages}
              scroll_x={scroll_x}
              scrollXControls={scrollXControls}
              subscribe={props.subscribe}
              unsubscribe={props.unsubscribe}
              highlightMode={props.highlightMode}
              changeHighlightMode={props.changeHighlightMode}
              openAI={props.openAI}
              pageQueueLength={pageQueueLength}
              wikiPageSummary={wikiPageSummary}
              wikiPageDescription={wikiPageDescription}
              wikiPageTitle={wikiPageTitle}
              wikiPageTableOfContents={wikiPageTableOfContents}
            />
          </div>


          <div 
            style={{
              display:tab == 'history' ? 'flex' : "none", 
              alignItems:'center', 
              flexDirection:"column", 
              marginTop:"20px"
            }}
          >
            <HistoryViewer navigator={navigator} curIndex={curIndex} tab={tab} />
          </div>

          {/*<CoachTips curIndex={curIndex}/>*/}
          </>
        ) : null }
    </>
  );
}

export default WikipediaExplorer;


{/* 
  <PageViewer 
    coords={coords} 
    selectMode={selectMode} 
    scrollLeft={scrollLeft}
    scrollRight={scrollRight}
    controls={controls}
    scroll_x={scroll_x}
    wikiPages={wikiPages}
  /> 
*/}