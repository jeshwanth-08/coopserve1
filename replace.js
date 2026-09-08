const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    try {
      if (fs.statSync(dirFile).isDirectory()) {
        filelist = walkSync(dirFile, filelist);
      } else {
        filelist.push(dirFile);
      }
    } catch (err) {
      if (err.code === 'ENOTDIR' || err.code === 'EBADF') filelist.push(dirFile);
    }
  });
  return filelist;
};

const files = [
  ...walkSync('./src'),
  'package.json'
].filter(f => f.endsWith('.tsx') || f.endsWith('.ts') || f.endsWith('.json'));

let changed = 0;
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;
  content = content.replace(/Cooperative Gig Services Platform/g, 'CoopServe');
  content = content.replace(/Cooperative Gig Services/g, 'CoopServe');
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    changed++;
    console.log('Updated ' + file);
  }
}
console.log('Updated ' + changed + ' files.');
