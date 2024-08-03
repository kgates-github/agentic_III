import React from 'react';

function HelpPage(props) {


  return (
    <div 
    onClick={() => { props.setIntroDisplay(props.introDisplay == 'none' ? 'flex' : 'none') }}
    style={{
      display: props.introDisplay, 
      position:"fixed", 
      top:0, 
      left:0, 
      width:"100%", 
      height:"100%", 
      background:"rgba(0,0,0,0.9)", 
      zIndex:1000,
    }}
  >
    <div style={{
      position:"absolute", 
      top:"50%", left:"50%", 
      transform:"translate(-50%, -50%)",
      color:"#fff",
      background:"#1c1c1c",
      paddingLeft:"28px",
      paddingRight:"28px",
      paddingTop:"60px",
      paddingBottom:"40px",
      borderRadius:"8px",
      border:"1px solid #555",
    }}>
      <div 
        onClick={() => { props.setIntroDisplay(props.introDisplay == 'none' ? 'flex' : 'none') }}
        style={{position:"absolute", top:"12px", right:"12px", 
                fontSize:"14px", marginBottom:"24px", 
                textAlign:"right", cursor:"pointer"}}>
        <i className="material-icons" style={{fontSize:"20px", color:"#999"}}>close</i>
      </div>
      <div style={{fontSize:"14px", marginBottom:"24px", textAlign:"center"}}>Press spacebar to toggle to preview mode</div>
      <div style={{marginBottom:"28px", paddingBottom:"28px", borderBottom:"0.5px solid #555", display:"flex", justifyContent:"center"}}>
        <img src={`${process.env.PUBLIC_URL}/spacebar.png`} alt="Description" />
      </div>
      <div style={{fontSize:"14px", marginBottom:"24px", textAlign:"center"}}>Press left or right arrows to go forward or back</div>
      <div style={{marginBottom:"28px", paddingBottom:"28px", borderBottom:"0.5px solid #555", display:"flex", justifyContent:"center"}}>
        <img src={`${process.env.PUBLIC_URL}/left_right_arrows.png`} alt="Description" />
      </div>
      <div style={{fontSize:"14px", marginBottom:"24px", textAlign:"center"}}>Press up or down arrows to scroll</div>
      <div style={{marginBottom:"80px", display:"flex", justifyContent:"center"}}>
        <img src={`${process.env.PUBLIC_URL}/up_down_arrows.png`} alt="Description" />
      </div>
      <div style={{fontSize:"14px", textAlign:"center", textDecoration:"underline", cursor:"pointer"}}>Close</div>
    </div>
  </div>
  );
}

export default HelpPage;




