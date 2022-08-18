import React from 'react';
import Card from 'react-bootstrap/Card';

function IconCard({icondata}) {

  const iconarray = Object.keys(icondata.paths);
  console.log(iconarray)
  const firstKey = iconarray[0]
  const path = icondata.paths[firstKey].replaceAll('public/','');
    


  return (
    <Card style={{ width: '18rem', margin: '5px' }} >
      <Card.Title>{icondata.serviceName}</Card.Title>
      <Card.Body>
        <img src={`${process.env.PUBLIC_URL}/${path}`} alt={firstKey}></img>
        {icondata.searchwords}
      </Card.Body>
    </Card>
  )
}

export default IconCard;