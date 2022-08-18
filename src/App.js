import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';

function App(props) {

  const [word, setWord] = useState("");
  const [searched, setSearched] = useState([]);
  const iconmap = require("./iconmap.json");

  const filterIcon = (word) => {
    const targets = [];
    for (let [ , value] of Object.entries(iconmap)){
      if ( value.searchwords.indexOf(word.toLowerCase()) > 0) {
        targets.push(value);
      }
    }
    setSearched(targets);
    return targets;
  }

  
  const search = (event) => {
    event.preventDefault();
    filterIcon(word);
  }



  const renderIcons = searched.map((data)=>{
    const firstKey = Object.keys(data.paths)[0];
    const path = data.paths[firstKey].replaceAll('public/','');
    return (
      <li>
          {data.serviceName}
           <img src={`${process.env.PUBLIC_URL}/${path}`} alt={firstKey}></img>
      </li>
    )
  });

  return (

    <div>
      <form onSubmit={search}>

      <Container>
        <Row>
          <Col>
              <Form.Control type="text" id="searchTxt" value={word} onChange={(event) => setWord(event.target.value)} placeholder="input serach word" />
          </Col>
          <Col>
            <Button type="submit" onClick={search}>Serach</Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <ul >
              {renderIcons}
            </ul>
            </Col>
        </Row>
      </Container>
      </form>
      
    </div>
  );
}

export default App;
