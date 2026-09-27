import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../_site');
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.mjs':'text/javascript','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.pdf':'application/pdf','.mp4':'video/mp4','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
  try {
    const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const file=path.resolve(root,`.${pathname.endsWith('/')?pathname+'index.html':pathname}`);
    if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
    if(!fs.existsSync(file)){res.writeHead(404);res.end('Not found');return;}
    if(fs.statSync(file).isDirectory()){res.writeHead(302,{Location:pathname+'/'});res.end();return;}
    res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
    if(req.method==='HEAD')res.end();else fs.createReadStream(file).pipe(res);
  } catch {res.writeHead(400);res.end('Bad request');}
});
server.listen(Number(process.env.PORT||4173),'127.0.0.1',()=>console.log('Preview: http://127.0.0.1:4173/ | Admin demo: /admin/?demo=1'));
