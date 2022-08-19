import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import IconCard from './components/IconCard';

function App(props) {

  const [word, setWord] = useState("");
  const [searched, setSearched] = useState([]);
  const iconmap = require("./iconmap.json");

  const filterIcon = (word) => {
    const custom_targets = [];
    const targets = [];
    for (let [ , value] of Object.entries(iconmap)){
      if ( value.customwords && value.customwords.indexOf(word.toLowerCase()) >= 0 ) {
        custom_targets.push(value);
      } else if ( value.searchwords.indexOf(word.toLowerCase()) >= 0) {
        targets.push(value);
      }
    }
    setSearched(custom_targets.concat(targets));
    return targets;
  }

  
  const search = (event) => {
    event.preventDefault();
    filterIcon(word);
  }



  const renderIcons = searched.map((data)=>{
    return (
        <IconCard icondata={data} key={data.serviceName} />          
    )
  });

  return (

    <div>
      
      <form onSubmit={search}>
      <Container>
        <h1>AWS Service Icons</h1>

        <Row  style={{"margin": "20px 0 20px 0"}} >
          <Col>
              <Form.Control type="text" id="searchTxt" value={word} onChange={(event) => setWord(event.target.value)} placeholder="input serach word" />
          </Col>
          <Col>
            <Button type="submit" onClick={search}>Serach</Button>
          </Col>
        </Row>
        <Row>
            {renderIcons}
        </Row>
      </Container>
      </form>
      
    </div>
  );
}

export default App;
