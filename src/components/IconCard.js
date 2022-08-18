import React, {useState} from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { copyImageToClipboard } from 'copy-image-clipboard';

function IconCard({icondata}) {

  const [copied, setCopied] = useState(false);
  

  const copyIconImage = (url)=>{
    copyImageToClipboard(url)
      .then(() => {
        console.log('Image Copied');
        setCopied(true);
      })
      .catch((e) => {
        console.log('Error: ', e.message);
      })
  }

  const renderIcon = () => {
    let pathkey = null;
    const keys = Object.keys(icondata.paths);
    for (let i=0;i<keys.length;i++ ){
      if (keys[i].indexOf('Light') >= 0) {
        pathkey = keys[i];
        break;
      }
      if (keys[i].indexOf('48') >= 0 && keys[i].indexOf('_Dark') === -1) {
        pathkey = keys[i];
        break;
      }
    }
    if (pathkey == null){
      pathkey = keys[0];
    }
    const path =  icondata.paths[pathkey].replaceAll('public/','');
      
    return (
      <div>
        <img src={`${process.env.PUBLIC_URL}/${path}`} alt={path}></img>
        <br />
        <Button size="sm" variant="secondary" onClick={()=>copyIconImage(path)} style={{margin: "2px 5px 2px 2px"}}>copy to clipboard</Button>
        {copied && "copied!!"}
      </div>
    );
  }

  return (
    <Card style={{ width: '18rem', margin: '5px' }} >
      <Card.Title>{icondata.serviceName}</Card.Title>
      <Card.Body>
        {renderIcon()}
      </Card.Body>
    </Card>
  )
}

export default IconCard;