import React, { useEffect, useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar'
import Jumbotron from 'react-bootstrap/Jumbotron'
import LoginForm from './Login/Login'
import { setDefaultHeaders } from './Login/service'
import { Button, Row, Col } from 'react-bootstrap';
import { decodeToken } from './config/globals'
import Sidebar from './Sidebar/Sidebar';
import Farm from './Farm/Farm';

function App() {
  const [loggedIn, updateLoginStatus] = useState(false);
  const [user, setUser] = useState({ id: null, email: null, name: null });
  const [activeFarm, updateActiveFarm] = useState(null);

  useEffect(() => {
    if (!!localStorage.getItem('bearer_token')) {
      setDefaultHeaders('Bearer ' + localStorage.getItem('bearer_token'));
      updateLoginStatus(true);
    }
  }, [])

  useEffect(() => {
    if (loggedIn) {
      const user = JSON.parse(decodeToken());
      if (user.expiration <= Date.now()) {
        logOut();
      }
      setUser(user);
    }
  }, [loggedIn])

  function logOut() {
    localStorage.removeItem('bearer_token');
    updateLoginStatus(false);
    updateActiveFarm(null);
    setUser(null);
  }

  return (
    <div >
      <Navbar bg="dark" variant="dark" fixed="top">
        <Navbar.Brand>Litefarm Farmer App</Navbar.Brand>
        {
          loggedIn &&
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text className="mr-2 ">
              <div className="white-text">Signed in as: {user?.name}</div>
            </Navbar.Text>
            <Button variant="danger" onClick={logOut}>Log Out</Button>
          </Navbar.Collapse>
        }
      </Navbar>
      {!loggedIn &&
        <div className="align-middle mt-30">
          <LoginForm updateLoginStatus={updateLoginStatus} />
        </div>
      }
      {loggedIn && user?.id &&
        <div className="mt-5">
          <Row>
            <Col>
              {
                !!activeFarm &&
                <Farm farm={activeFarm} updateActiveFarm={updateActiveFarm}></Farm>
              }
              {
                !activeFarm && 
                (
                  <Jumbotron>
                    <h3>Please add a Farm :)</h3>
                    <p>It seems you have still not added any farms to the system. To do so, please click the "Add Farm" Button on your right</p>
                    <p>Enter the farm information and you will see your farms here.</p>
                  </Jumbotron>
                )
              }
            </Col>
            <Sidebar user={user} activeFarm={activeFarm} updateActiveFarm={updateActiveFarm}>
            </Sidebar>
          </Row>
        </div>
      }
    </div>
  );
}

export default App;
