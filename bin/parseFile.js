const fs = require('fs');
const path = require('path');


const _parseArchType = (filename) => {
  const regexStr = /(?:Arch|Arch-Category)_(.*)_(\d*(?:@5x)?)\.(png|svg)/;
  const match = regexStr.exec(filename);
  
  const _serviceKey = match[1];
  const serviceKey = _serviceKey.toLowerCase();
  const serviceName = _serviceKey.replaceAll('-', ' ');

  const pathKey = match[2];
  const ext = match[3];
  return {serviceKey, serviceName, pathKey, ext}
}

const _parseResType = (filename) => {
  const regexStr = /Res_(.*)_(\d*_(?:Light|Dark))\.(png|svg)/;
  const match = regexStr.exec(filename);
  
  const _serviceKey = match[1];
  const serviceKey = _serviceKey.toLowerCase();
  const serviceName = _serviceKey.replaceAll('-', ' ');

  const pathKey = match[2];
  const ext = match[3];
  return {serviceKey, serviceName, pathKey, ext}
}

const customwordsdata = require("./custom.json");
const _customwords = (key) => {
  if (customwordsdata && key in customwordsdata) {
    return customwordsdata[key];
  }
  return null;
}

const _parseData = (datamap, file, options) => {
  const filename = path.basename(file);

  let jsondata; 
  if (filename.startsWith('Arch')) {
    jsondata = _parseArchType(filename);
  } else if (filename.startsWith('Res')){
    jsondata = _parseResType(filename);
  }

  const key = jsondata.serviceKey;
  const size_ext = jsondata.pathKey + '_' + jsondata.ext
  const searchwords = jsondata.serviceName.toLowerCase().replaceAll('aws', '').replaceAll('amazon', '');
  if (! (key in datamap)) {
    const data = {
      paths: {},
      serviceName: jsondata.serviceName,
      searchwords: searchwords,
    }
    const customwords =  _customwords(key);
    if (customwords) {
      data['customwords'] = customwords;
    }
    datamap[key] = data;
  }
  datamap[key].paths[size_ext] = file;
  
  return ;
}

const _hasSuffix = (file, suffix) => {
  if (typeof suffix === "string") {
    return file.endsWith(suffix);
  } else if (Array.isArray(suffix)) {
    for (let len = suffix.length, i = 0; i < len; i++) {
      const _suffix = suffix[i];
      if (file.endsWith(_suffix)) {
        return true;
      }
    }
  }
  return false;
}

const parseWalkSync = (dir, datamap, options) => {
  const list = fs.readdirSync(dir);
  list.forEach(file=>{
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if( stat && stat.isDirectory()) {
      parseWalkSync(file, datamap, options);
    } else {
      const suffix = options.suffix;
      if ( !suffix || suffix.length ==0 || _hasSuffix(file, suffix) ){
        _parseData(datamap, file);
      }
    }
  })
  return;
}

const datamap = {};
parseWalkSync('public/icons', datamap, {suffix: ['png']});
fs.writeFileSync('./src/iconmap.json', JSON.stringify(datamap));