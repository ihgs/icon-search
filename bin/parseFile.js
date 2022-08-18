const fs = require('fs');
const path = require('path');

const _parseData = (datamap, file, options) => {
  const filename = path.basename(file);
  const tmp = filename.split('_');
  const sep_filename = tmp[1];
  const key = sep_filename.toLowerCase();
  const size_ext = tmp[2];
  const serviceName = sep_filename.replaceAll('-', ' ');
  if (! (key in datamap)) {
    const data = {
      paths: {},
      serviceName: serviceName,
      searchwords: serviceName.toLowerCase()
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