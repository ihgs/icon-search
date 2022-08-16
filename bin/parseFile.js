const fs = require('fs');
const path = require('path');

const _parseData = (file, options) => {
  const filename = path.basename(file);
  const sep_filename = filename.split('_')[1];
  const serviceName = sep_filename.replaceAll('-', ' ');
  const data = {
    path: file,
    serviceName: serviceName,
    searchwords: serviceName.toLowerCase()
  }
  return data;
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

const parseWalkSync = (dir, options) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file=>{
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if( stat && stat.isDirectory()) {
      results = results.concat(parseWalkSync(file, options));
    } else {
      const suffix = options.suffix;
      if ( !suffix || suffix.length ==0 || _hasSuffix(file, suffix) ){
        results.push(_parseData(file))
      }
    }
  })
  return results;
}

const data = parseWalkSync('public/icons', {suffix: ['png']});
fs.writeFileSync('./public/icons/iconmap.json', JSON.stringify(data));