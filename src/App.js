import logo from './logo.svg';
import './App.css';
import Chat from './chat';
import Welcome from './Welcome';
import { BrowserRouter as Router , Switch, Route,history} from 'react-router-dom';
import {Link,useHistory} from "react-router-dom";
import Shop from './Shop';
import Shopchat from './Shopchat';
function App() {
  return (
    <div className="App">
      
      <Router>
      <Switch>
        <Route path="/shopchat/:name">
          <Shopchat />
        </Route>
        <Route path="/chat/:name">
          <Chat />
        </Route>
        <Route path="/shop/:name">
          <Shop />
        </Route>
        <Route path="/">
          <Welcome />
        </Route>
        
      </Switch>
      </Router>
      {/* <Chat /> */}
    </div>
  );
}

export default App;
