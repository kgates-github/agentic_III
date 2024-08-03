import React, { useContext } from 'react';
import { GlobalContext } from './GlobalContext';


function TabBar(props) {
  const { GLOBAL_WIDTH } = useContext(GlobalContext);
  
  return (
    <>
      <div style={{
        height:"40px", 
        background:"none", 
        marginTop:"40px", 
        display:"flex", 
        flexDirection:"row",
        alignItems:"flex-end",
        justifyContent:"center",
        width:"100%",
        borderBottom:"1px solid #ccc",
      }}>
        <div style={{
          width:GLOBAL_WIDTH.current,
          background:"none", 
          display:"flex", 
          flexDirection:"row",
        }}>
          <div 
            onClick={() => {props.toggleTab('browse')}}
            style={{
              width:"100px", 
              height:"32px", 
              textAlign:"center", 
              background:"none", 
              borderBottom: props.tab == 'browse' ? "3px solid #333" : 'none',
              display:"flex",
              alignItems:"center",
              justifyContent:"center",
              cursor:"pointer",
            }}
          >
            Browse
          </div>
          <div 
            onClick={() => {props.toggleTab('history')}}
            style={{
              width:"100px", 
              height:"32px", 
              textAlign:"center", 
              background:"none", 
              borderBottom: props.tab == 'history' ? "3px solid #333" : 'none',
              display:"flex",
              alignItems:"center",
              justifyContent:"center",
              cursor:"pointer",
            }}
          >
            History
          </div>

        </div>
       
      </div>
    </>
  );
}

export default TabBar;
