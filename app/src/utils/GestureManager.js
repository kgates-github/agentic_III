// State interface
class State {
  open_palm(gestureManager) {}
  closed_fist(gestureManager) {}
  move_XY(gestureManager) {}
  no_gesture(gestureManager) {}
}

// Concrete states
class Dormant extends State {
  constructor(subscribe, unsubscribe) {
    super();
    
    subscribe("Open_Palm", (e) => this.open_palm(e));
  }

  open_palm(gestureManager) {
    console.log("open_palm in Dormant state");
    gestureManager.setState(new LinkSelect());
  }

  closed_fist(gestureManager) {
    console.log("closed_fist in Dormant state");
  }

  move_XY(gestureManager) {
    console.log("move_XY in Dormant state");
  }

  no_gesture(gestureManager) {
    console.log("no_gesture in Dormant state");
  }
}

class LinkSelect extends State {
  constructor() {
    super();
  }

  open_palm(gestureManager) {
    console.log("open_palm in dormant state");
  }

  closed_fist(gestureManager) {
    console.log("closed_fist in LinkSelect state");
    //document.setState(new LinkPreview());
  }

  move_XY(gestureManager) {
    console.log("move_XY in LinkSelect state");
  }
  
  no_gesture(gestureManager) {
    console.log("no_gesture in LinkSelect state");
  }
}

class GestureManager {
  constructor(subscribe, unsubscribe) {
    this.state = new Dormant(subscribe, unsubscribe); // Default state
  }

  setState(state) {
    this.state = state;
  }
}

export default GestureManager;