import React, { useEffect, useState, useRef, useContext } from 'react';
import { testContent } from './helpers';
import { useAnimation, motion, transform } from "framer-motion"
import PageViewer from './PageViewer';
//import axios from 'axios';


function WikipediaExplorer(props) {
  const [selectedLink, setSelectedLink] = useState(null);
  const [cockedState, setCockedState] = useState('dormant'); // dormant, partial, cocked
  const [goToNewPage, setGoToNewPage] = useState(false);
  const [clickedLink, setClickedLink] = useState(false);
  const [preloadedPage, setPreloadedPage] = useState(false);
  const linkCount = useRef(0)
  
  const [selectMode, setSelectMode] = useState('dormant'); // dormant, active, selected
  const [coords, setCoords] = useState(null);
  const [wikiPages, setWikiPages] = useState([]);
  const [curPageIndex, setCurPageIndex] = useState(0);

  const elementSelectedRef = useRef(false);
  const anchor_x = useRef(-10);
  const cock_anchor_x = useRef(-10);
  const selectables = useRef([]);
  const index = useRef(0);
  const scroll_x = useRef(0);
  const cockedStateRef = useRef(cockedState)
  
  const controls = useAnimation();
  
  const variants = {
    dormant: {
      translateX: 0,
      rotate: 0,
    },
    partial: {
      translateX: -40,
      rotate: -1,
      transition: { duration: 0.1, ease: 'easeInOut' }
    },
    cocked: {
      translateX: -40,
      rotate: 1,
      transition: { duration: 0.1, ease: 'easeInOut' }
    },
  }

  function addPage(pageContent) {
    
    // Get curid and truncate all pages after it
    const newWikiPages = [...wikiPages];
    newWikiPages.push(pageContent);
    setWikiPages(newWikiPages);
    console.log('newWikiPages', newWikiPages)
    //setCurPage(newWikiPage.id)
  }

  const scrollLeft = () => {
    // Take curId and determine if it is at end, then don't scroll
    //const index = wikiPages.findIndex(page => page.id === curPageId);
    //console.log('-- scrollLeft index, curPageId', index, curPageId, wikiPages)
   
    //if (index === wikiPages.length-1) return;

    // If wikiPages[curPageIndex + 1] exists, then scroll
    setCurPageIndex(curPageIndex + 1)

    scroll_x.current -= 800;
    controls.start({ 
      x: scroll_x.current, 
      transition: { 
        duration: 0.3,
        ease: "easeInOut"
      }  
    });
  };

  const scrollRight = () => {
    // Take curId and determine if it is at end, then don't scroll (also set button opacity)
    //const index = wikiPages.findIndex(page => page.id === curPageId);
    //console.log('-- scrollRight index, curPageId', index, curPageId, wikiPages)
    // if (index === 0) return;
    setCurPageIndex(curPageIndex - 1)

    scroll_x.current += 800;
    controls.start({ 
      x: scroll_x.current, 
      transition: { 
        duration: 0.3,
        ease: 'easeInOut'
      }   
    });
  };
  
  function handleOpenPalm(e) {
    /*console.log('handleOpenPalm', cockedStateRef.current)
    props.unsubscribe("Hand_Coords", handleDetectCocking);

    if (cockedStateRef.current == 'partial') {
      setCockedState('dormant')
      handleOpenPalmRelease();
      handleNoGesture();
      return
    } else {
      setCoords(null);
    }

    setSelectMode('active');
    elementSelectedRef.current = false;
    if (anchor_x.current < -1) anchor_x.current = e.detail.x;
    
    if (selectables.current.length > 0) {
      selectables.current.forEach(selectable => {
        selectable.unhighlight();
      });
    }

    const windowHeight = window.innerHeight;
    
    const links = document.querySelectorAll('a');
    console.log('links length: ', links.length)
    links.forEach((link) => {
      if (link.offsetHeight < windowHeight) {
        
        selectables.current.push({
          element:link,
          type:link.tagName,
          name: link.innerHTML,
          href: link.href,
          highlight:() => {
            link.classList.add('highlighted');
            link.classList.remove('triggered');
            link.classList.add('activated');
          },
          unhighlight:() => {
            link.classList.remove('highlighted');
            link.classList.remove('triggered');
            link.classList.add('activated');
          },
          trigger:() => {
            link.classList.remove('highlighted');
            link.classList.remove('activated');
            link.classList.add('triggered');
          },
          untrigger:() => {
            link.classList.remove('triggered');
            link.classList.add('activated');
          },
          clear:() => {
            link.classList.remove('triggered');
            link.classList.remove('activated');
            link.classList.remove('highlighted');
          }
        });
        link.classList.add('activated');
      }
      
    });

    selectables.current[index.current].highlight();
    props.unsubscribe("Hand_Coords", handleDetectCocking);
    props.subscribe("Hand_Coords", (e) => handleGestureXY(e));
    props.subscribe("Closed_Fist", (e) => handleClosedFist(e));*/
  }

  function handleOpenPalmRelease(e) {
    console.log('handleOpenPalmRelease')

    setGoToNewPage(true);    
  }

  function handleNoGesture() { 
    console.log('handleNoGesture')

    setCoords(null);
    setSelectMode('dormant');
    setCockedState('dormant')
    anchor_x.current = -10; // Reset anchor
    
    selectables.current.forEach(selectable => {
      selectable.clear();
    });
    props.unsubscribe("Hand_Coords", handleGestureXY);   
    props.unsubscribe("Hand_Coords", handleDetectCocking);
  }

  function handleGestureXY(e) {
    //console.log('handleGestureXY')

    if (!elementSelectedRef.current && selectables.current.length > 0) {
      selectables.current[index.current].unhighlight();
      selectables.current[index.current].untrigger();
      
      const { x, y, z } = e.detail;
      index.current = selectables.current.length - Math.floor(Math.abs((0.3 - (x - anchor_x.current)) / 0.3) * selectables.current.length)
      
      if (index.current < 0) index.current = 0;
      if (index.current > selectables.current.length - 1) index.current = selectables.current.length - 1;

      selectables.current[index.current].highlight();
    }
  }

  function handleDetectCocking(e) {
    //console.log('handleDetectCocking')

    const x = e.detail.x;
    const test_x = Math.abs(cock_anchor_x.current - x)
   
    if (test_x > 0.1) {
      setCockedState('partial')
    } else {
      setCockedState('dormant')
    }
  }

  function handleClosedFist(e) {
    console.log('handleClosedFist')

    elementSelectedRef.current = true;
    if (selectables.current[index.current]) {
      selectables.current[index.current].trigger();
      if ( selectables.current[index.current].type === 'A' ) {
        const rect = selectables.current[index.current].element.getBoundingClientRect();
        const x = rect.left - 8;
        const y = rect.top - 4;
        setSelectedLink(selectables.current[index.current]);
        setCoords({ x, y });

        // Set anchor point for cocking gesture
        const hand_x = e.detail.x;
        cock_anchor_x.current = hand_x;
        props.unsubscribe("Hand_Coords", handleGestureXY);
        console.log(`1 props.subscribe("Hand_Coords")`)
        props.subscribe("Hand_Coords", (e) => handleDetectCocking(e));
      }
    }
    props.unsubscribe("Hand_Coords", handleGestureXY); 
    props.unsubscribe("Closed_Fist", handleClosedFist); 
    props.unsubscribe("Hand_Coords", handleDetectCocking);
  }

  // Wikipedia functions
  
  // Replacement function to decide whether to keep or remove the <a> tag
  const replacementFunction = (match, href, innerText) => {
    if (href.includes('wiki')) {
      return match;
    } else {
      return '';
    }
  };

  const fetchWikiPage = async(pageName) => {
    try {
      const pattern = /<a\s+[^>]*href=["'][^"']*?([^"']*wiki[^"']*|[^"'>]*)["'][^>]*>(.*?)<\/a>/gi;
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=parse&page=${pageName}&format=json&origin=*`
      );

      if (!response.ok) throw new Error(`Error fetching data: ${response.statusText}`);
    
      const data = await response.json();
      let truncatedText = data.parse.text["*"].split("References")[0];
      
      // Apply the replacement function to the truncatedText
      let cleanedText = truncatedText.replace(pattern, replacementFunction);
      cleanedText = cleanedText.replace(/\[|\]/g, '');
      linkCount.current++;
      let newId = "page_" + linkCount.current;

      return {
        id: newId,
        title: data.parse.title,
        text: cleanedText
      };
    } catch (error) {
      console.log(error.message);
    }
  };

  document.addEventListener('click', function(event) {
    let target = event.target.closest('a');
  
    if (target) {
      event.preventDefault();
      setClickedLink(target.href)
    }
  });

  useEffect(() => {
    if (clickedLink) {
      async function getPage(pageName) {
        setClickedLink(null);
        const newWikiPage = await fetchWikiPage(pageName);
        addPage(newWikiPage);
        scrollLeft();
      }
      
      const url = clickedLink;
      const pageName = url.split('/').pop();
      getPage(pageName);
    }
  }, [clickedLink]);

  useEffect(() => {
    //props.subscribe("Open_Palm", (e) => handleOpenPalm(e));
    //props.subscribe("No_Gesture", handleNoGesture);

    async function initializeApp() {
      const newWikiPage = await fetchWikiPage('Dymaxion');
      setCurPageIndex(0)
      addPage(newWikiPage);
    }
    
    initializeApp();
  }, []);

  useEffect(() => {
    cockedStateRef.current = cockedState
    console.log('cockedStateRef.current', cockedStateRef.current)
  }, [cockedState]);

  useEffect(() => {
    if (selectedLink && selectedLink.element && cockedState === 'partial') {
      
      async function getPage(pageName) {
        const newWikiPage = await fetchWikiPage(pageName);
        setPreloadedPage(newWikiPage);
      }
      
      const url = selectedLink.element.href;
      const pageName = url.split('/').pop();
      getPage(pageName);
    }
  }, [selectedLink, cockedState]);

  useEffect(() => {
    if (cockedState !== 'dormant' && goToNewPage) {
      console.log('------- selectedLink', selectedLink)
      props.unsubscribe("Hand_Coords", handleGestureXY);
      props.unsubscribe("Closed_Fist", handleClosedFist);
      props.unsubscribe("Hand_Coords", handleDetectCocking);
      props.unsubscribe("Open_Palm", handleOpenPalmRelease);

      setGoToNewPage(false);
      addPage(preloadedPage);
      scrollLeft();
    }
  }, [selectedLink, cockedState, goToNewPage]);

  return (
    <>
      <div style={{height:"60px", background:"none", marginTop:"40px"}}></div>

      <PageViewer 
        coords={coords} 
        selectMode={selectMode} 
        scrollLeft={scrollLeft}
        scrollRight={scrollRight}
        controls={controls}
        scroll_x={scroll_x}
        wikiPages={wikiPages}
      />
      
      {/* Other components */}
      {coords && <motion.div 
        animate={cockedState}
        variants={variants}
        initial="dormant"
        style={{ 
        position: 'absolute', 
        left: coords.x, 
        top: coords.y,
        background: '#fff200',
        paddingTop: '4px',
        paddingBottom: '4px',
        paddingLeft: '12px',
        paddingRight: '12px',
        boxShadow: '0px 0px 10px 0px #666',
        }}>{selectedLink.element.innerHTML}</motion.div>}

    </>
  );
}

export default WikipediaExplorer;
