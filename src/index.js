import fastify from "fastify";
import fastifyView from '@fastify/view';
import fastifyStatic from "@fastify/static";
import ejs from 'ejs';
import path ,{ dirname , join} from "node:path";
import { getitniraire, getPost, loginPage, verifyco } from "./action/post.js";
import { fileURLToPath } from "node:url";
import fastifyFormbody from "@fastify/formbody";
import fs from "node:fs";
import fastifySecureSession from "@fastify/secure-session";



const app = fastify();
const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));

app.register(fastifySecureSession , {
  sessionName : 'connexion',
  cookieName :'connexion_cookie',
  key : fs.readFileSync(path.join(rootDir , 'secret-key')),
  expiry:30*24*60*60,
  cookie : {
    path : '/'
  }
})

app.register(fastifyView ,{
  engine:{
    ejs
  }
});

app.register (fastifyStatic ,{
  root:join(rootDir,'public')
});

app.register(fastifyFormbody);

app.get('/',getPost);
app.get('/login',loginPage);

app.post('/',getitniraire);
app.post('/login',verifyco);

const start = async () =>{
  try {
    console.log("start server");
    await app.listen({port : 8888});
  } catch (err) {
    console.error(err);
    process.exit(1); 
  }
}

start();
// https://www.facebook.com/share/r/kKVJ4qKWz9WvNte5/