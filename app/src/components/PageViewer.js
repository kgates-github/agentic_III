import React, { useEffect, useState, useRef } from 'react';
import { useAnimation, motion } from "framer-motion"
import Page from './Page';


function PageViewer(props) {
  const pageViewerRef = useRef(null);

  useEffect(() => {
    if (pageViewerRef.current) {
      pageViewerRef.current.scrollTop = 0;
    }
  } ,[props.wikiPages]);

  return (
   
    <div style={{display:"flex", flexDirection:"column", alignItems:"center",}}>
      
      <div style={{display:"flex", 
        flexDirection:"row", background:"none", width:"800px", paddingBottom:"12px"}}>
       
       <div onClick={() => {props.scrollRight() }} style={{cursor:"pointer",}}>
          <i className="material-icons" style={{fontSize:"32px", color:"#666"}}>arrow_circle_left</i>
        </div>
        <div onClick={() => {props.scrollLeft() }} style={{cursor:"pointer",}}>
          <i className="material-icons" style={{fontSize:"32px", color:"#666"}}>arrow_circle_right</i>
        </div>
        <div style={{flex:1, background:"none"}}></div>
        <div onClick={() => {props.scrollLeft() }} 
          style={{cursor:"pointer", display: "flex", alignItems: "center", marginRight:"20px"}}>
          <i className="material-icons" style={{fontSize:"32px", color:"#666"}}>search</i>
        </div>
      
      </div>

      <div 
        id="page-viewer"
        ref={pageViewerRef}
      style={{
        marginBottom:"40px", 
        background:"none",
        width:"780px",
        height:"calc(100vh - 80px)",
        overflowY:"hidden",
        overflowX:"hidden",
        paddingRight:"20px",
        opacity: props.coords ? 0.3 : 1,
      }}>
        <motion.div animate={props.controls}
          style={{display:"flex", flexDirection:"row", width: props.wikiPages.length * 800 }}>
           
          {props.wikiPages.map((wikiPage, index) => (
            <Page key={"page_"+index} wikiPage={wikiPage} />
          ))}
        </motion.div>
      </div>
      
    </div>
  
  );
}

export default PageViewer;



