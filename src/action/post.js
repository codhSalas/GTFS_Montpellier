import { Template } from "ejs";
import { allStat, db /*,makeRoot,updateData*/} from "../dataB.js";
import {findPath} from "../chemain/chemain.js";
// import { searcheRoot } from "../chemain/chemain.js";

export const loginPage = (req, res) =>{
  // makeRoot();
  // updateData();
  const data = req.connexion.get('data');
  if(!data){
    
    return res.view('templates/login.ejs');
  }
  return res.redirect('/');
} 

export const getPost = (req , res) =>{
  const data = req.connexion.get('data');
  if(!data){
    return res.redirect('/login');
    
  }
  return res.view('templates/index.ejs',{
    station : allStat()
  });
}

export const getitniraire = (req ,res) =>{
  
  const {depart ,arriver/*,eviter*/ ,relais } = req.body;
  console.log(depart ,arriver,relais);

  if (depart === '0' || arriver === '0' || depart === arriver) {
    res.send({
      chemain : {
        res : "\n\nerreure aucun chemain selectionner "
      }
    });
  }else{  
    console.log("j'ai recu la data ",depart , arriver,"\n\n");
    let f1;
    if (relais != 0){
      f1 =findPath(depart , relais);
      let f2 = findPath(relais , arriver);
      f1[0] = [...f1[0],...f2[0]];
      for (let index = 1; index < f2.length; index++) {
        f1 = [...f1,f2[index]]; 
      }
    }else{
      f1 = findPath(depart,arriver);
    }

    console.log("f1 ===> ",f1);
    res.send({chemain : f1})
  }
 
  
  // return res.view('template/index.js')
}

export const verifyco = (req , res) =>{
  const {username , key} = req.body;
  const data = db.prepare("SELECT (username) FROM users WHERE username = ? ").get(username);
  
  if (!(username === undefined)){
    const mkey = db.prepare("select * from keys WHERE hash_key = ?").get(key);
  
    if (!(mkey === undefined)){
      const ndata = {username : username , id : mkey.hash_key }
      req.connexion.set( 'data', ndata);
      
      return res.view('templates/index.ejs',{
        data : ndata,
        station : allStat()
      })
    } 
  }
  return res.view('templates/login.ejs');
}