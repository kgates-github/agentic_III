import './App.css';
import GestureCapturer from './components/GestureCapturer';
import React, { useState, useRef, useEffect } from 'react';
import { GlobalContext } from './components/GlobalContext';
import WikipediaExplorer from './components/WikipediaExplorer3';
import HelpPage from './components/HelpPage';
import OpenAITests from './components/OpenAITests';
import { OpenAI } from 'openai';

function App() {
  const userAgent = navigator.userAgent;
  const [isLoaded, setIsLoaded] = useState(false);
  const [highlightMode, setHighlightMode] = useState('dormant'); // dormant, highlight
  const [introDisplay, setIntroDisplay] = useState('none');
  const [openAI, setOpenAI] = useState(null);
  const [noOpenAI, setNoOpenAI] = useState(false);  
  const GLOBAL_WIDTH = useRef(640);

  // Set up our custom gesture events
  const subscribe = (eventName, listener) => {
    //console.log('Subscribing to ' + eventName);
    document.addEventListener(eventName, listener);
  }
  
  const unsubscribe = (eventName, listener) => {
    //console.log('Unsubscribing from ' + eventName);
    document.removeEventListener(eventName, listener);
  }
  
  const publish = (eventName, data) => {
    const event = new CustomEvent(eventName, { detail: data });
    //console.log('publishing event', eventName, data);
    document.dispatchEvent(event);
  }

  const changeHighlightMode = () => {
    let mode = 'dormant' 
    if (highlightMode === 'dormant') mode = 'highlight';
    //if (highlightMode === 'highlight') mode = 'preview';
    setHighlightMode(mode);
  }

  useEffect(() => {
    const openaiApiKey = process.env.REACT_APP_OPENAI_KEY

    if (!openaiApiKey) {
      console.log('process.env.REACT_APP_OPENAI_KEY not found');
      setNoOpenAI(true);
    } else {
      setOpenAI(new OpenAI({ apiKey: openaiApiKey, dangerouslyAllowBrowser: true }));
      setNoOpenAI(false);
    }
  }, []);

  return (
    <GlobalContext.Provider value={{GLOBAL_WIDTH}}>
      
    
      { (userAgent.indexOf("Chrome") > -1) ? 
      <div className="App">
        {/*<GestureCapturer 
          publish={publish} 
          setIsLoaded={setIsLoaded} 
          introDisplay={introDisplay}
          setIntroDisplay={setIntroDisplay}
        />*/}
        <div className="header" style={{position:"fixed", top:0, left:0,}}>
          <div style={{display:"flex", flexDirection:"row", alignItems:"center", width:"200px", background:"none"}}>
            <i className="material-icons-outlined" style={{fontSize:"20px", color: "#666"}}>keyboard_arrow_left</i>
            <div className="header-06">Projects</div>
          </div>
          
          <div style={{flex:1}}></div>
          <div className="title">
            <div style={{width:"40px",}}></div>
            <div className="header-06">
              Wikipedia Browser
            </div>
            <div style={{paddingTop:"4px", marginLeft:"12px",}}>
              <i className="material-icons-outlined" style={{fontSize:"24px", color: "#666"}}>search</i>
            </div>
          </div>
          <div style={{flex:1}}></div>
          <div style={{width:"200px", display:"flex", justifyContent:"flex-end", marginRight:"30px"}}>
            <div 
            className="header-06" 
            onClick={() => { setIntroDisplay(introDisplay == 'none' ? 'flex' : 'none') }}
            style={{cursor:"pointer", background:""}}>
              <i className="material-icons-outlined" style={{fontSize:"24px",  color: "#666"}}>info</i>
            </div>
          </div>
        </div>
        {!isLoaded && (openAI || noOpenAI) ? <WikipediaExplorer
          subscribe={subscribe} 
          unsubscribe={unsubscribe} 
          highlightMode={highlightMode}
          changeHighlightMode={changeHighlightMode}
          setIntroDisplay={setIntroDisplay}
          openAI={openAI}/> : null}

        <HelpPage 
          setIntroDisplay={setIntroDisplay}
          introDisplay={introDisplay}
        />

        {false ? <OpenAITests 
          openAI={openAI}
          /> : null}
       
      </div>
     : <div style={{padding: "20px", textAlign:"center"}}>This app is only supported in Google Chrome</div> }
    </GlobalContext.Provider>
  );

}

export default App;

/*
 {isLoaded ? <WikipediaExplorer
          subscribe={subscribe} 
          unsubscribe={unsubscribe} 
          setIntroDisplay={setIntroDisplay}/>: null}



    { (userAgent.indexOf("Chrome") > -1) ? 
      <div className="App">
        <GestureCapturer 
          publish={publish} 
          setIsLoaded={setIsLoaded} 
          introDisplay={introDisplay}
          setIntroDisplay={setIntroDisplay}
        />
        <div className="header" style={{position:"fixed", top:0, left:0,}}>
          <div style={{display:"flex", flexDirection:"row", alignItems:"center",}}>
            <i className="material-icons-outlined" style={{fontSize:"20px", color: "#666"}}>keyboard_arrow_left</i>
            <div className="header-06">Projects</div>
          </div>
          
          <div style={{flex:1}}></div>
          <div className="title">
            <div className="header-06">Wikipedia Browser</div>
          </div>
          <div style={{flex:1}}></div>
        </div>
        {isLoaded ? <WikipediaExplorer
          subscribe={subscribe} 
          unsubscribe={unsubscribe} 
          setIntroDisplay={setIntroDisplay}/>: null}
       
       
      </div>
     : <div style={{padding: "20px", textAlign:"center"}}>This app is only supported in Google Chrome</div> }
    </GlobalContext.Provider>
  );
*/
