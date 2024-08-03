import React, { useEffect, useMemo, useState } from 'react';

function SpacebarTip(props) {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const toggleElement = document.getElementById('toggle');
    if (toggleElement) {
      const { top, left } = toggleElement.getBoundingClientRect();
      setY((top + 40) + "px");
      setX(left + "px");
     
      setVisible(true);
    }
  }, []);

  useMemo(() => {
    const handleClick = () => {
      setVisible(false); 
    };
  
    const handleKeyDown = (event) => {
      if (event.keyCode === 32) { // 32 is the key code for the spacebar
        setVisible(false);
      }
    };
  
    if (visible) {
      document.addEventListener('click', handleClick);
      document.addEventListener('keydown', handleKeyDown);
    }
  
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [visible]); 

  return (
    <>
      <style>
        {`
          .coach-tip::before {
            content: "";
            position: absolute;
            top: -10px; /* Adjust this value to position the pointer */
            left: 50%;
            transform: translateX(-50%);
            border-left: 10px solid transparent; /* Adjust size of the pointer */
            border-right: 10px solid transparent; /* Adjust size of the pointer */
            border-bottom: 10px solid #1c1c1c; /* Color should match the tooltip background */
          }
        `}
      </style>
      <div className="coach-tip" style={{ 
        position: 'absolute', left: x, top: y,
        padding: "20px", zIndex: 1000,
        transform: "translate(-44%, 4%)",
        color: "#fff",
        background: "#1c1c1c",
        borderRadius: "8px",
        display: visible ? "flex" : "none",
        border: "1px solid #666",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}>
        <div style={{marginBottom:"12px"}}>Press spacebar to toggle to preview mode</div>
        <img src={`${process.env.PUBLIC_URL}/spacebar.png`} alt="Description" />
      </div>
    </>
  );
}

function ArrowTip(props) {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const toggleElement = document.getElementById('arrowleft');
    console.log('arrow elem:', toggleElement);
    if (toggleElement) {
      const { top, left } = toggleElement.getBoundingClientRect();
      setY((top + 40) + "px");
      setX(left + "px");
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    const handleClick = () => {
      setVisible(false); 
    };
  
    const handleKeyDown = (event) => {
      setVisible(false);
    };
  
    if (visible) {
      document.addEventListener('click', handleClick);
      document.addEventListener('keydown', handleKeyDown);
    }
  
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [visible]); 

  return (
    <>
      <style>
        {`
          .coach-tip::before {
            content: "";
            position: absolute;
            top: -10px; /* Adjust this value to position the pointer */
            left: 50%;
            transform: translateX(-50%);
            border-left: 10px solid transparent; /* Adjust size of the pointer */
            border-right: 10px solid transparent; /* Adjust size of the pointer */
            border-bottom: 10px solid #1c1c1c; /* Color should match the tooltip background */
          }
        `}
      </style>
      <div className="coach-tip" style={{ 
        position: 'absolute', left: x, top: y,
        padding: "20px", zIndex: 1000,
        transform: "translate(-40%, 4%)",
        color: "#fff",
        background: "#1c1c1c",
        borderRadius: "8px",
        display: visible ? "flex" : "none",
        border: "1px solid #666",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}>
        <div style={{marginBottom:"12px"}}>Use arrow keys to go forward and back</div>
        <img src={`${process.env.PUBLIC_URL}/left_right_arrows.png`} alt="Description" />
      </div>
    </>
  );
}
 

function CoachTips(props) {
  const [coachTip, setCoachTip] = useState('spacebartip');
  let hasBeenCalled = false;

  function getCoachTip() {
    switch (coachTip) {
      case 'spacebartip':
        return <SpacebarTip setCoachTip={setCoachTip} />;
      case 'arrowtip':
        return <ArrowTip setCoachTip={setCoachTip} />;
      default:
        return null;
    }
  }

  useMemo(() => {
    if (!hasBeenCalled && props.curIndex > 0) {
      setCoachTip('arrowtip');
      hasBeenCalled = true;
    }
  }, [props.curIndex]);
  
  return (
    <>
      {getCoachTip()}
    </>
  );
}

export default CoachTips;
