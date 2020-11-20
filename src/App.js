import logo from './logo.svg';
import './App.css';
import Chat from './chat';
import { BrowserRouter as Router , Switch, Route,history} from 'react-router-dom';
import {Link,useHistory} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import Orders from './Orders';
function App() {
  return (
    <div className="App">
      
      <Router>
      <Switch>
          <Route path="/">
              <Orders />
          </Route>
      </Switch>
      </Router>
    </div>
  );
}

export default App;
