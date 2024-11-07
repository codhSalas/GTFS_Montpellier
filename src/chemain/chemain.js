import {db} from "../dataB.js";
import Graphe from "../graph/graphe.js";

const query = `SELECT t1.route_id AS route1, t2.route_id AS route2, t1.stop_id
FROM alltrips t1
JOIN alltrips t2 
  ON t1.stop_id = t2.stop_id 
  AND t1.route_id <> t2.route_id
WHERE t1.stop_id IN (
    SELECT stop_id 
    FROM alltrips 
    GROUP BY stop_id 
    HAVING COUNT(DISTINCT route_id) > 1
)
ORDER BY t1.route_id, t2.route_id`;
// const endQuery = `
//   WITH StopPositions AS (
//     -- Trouver les séquences des deux arrêts
//     SELECT route_id, 
//       stop_id, 
//       stop_sequence,
//       CASE 
//           WHEN stop_id = @start_id THEN 'start' 
//           WHEN stop_id = @ends_id THEN 'end' 
//       END AS stop_position
//     FROM alltrips
//     WHERE stop_id IN (@start_id, @ends_id)
//   )
//   SELECT stop_id
//   FROM alltrips
//   WHERE route_id = @current_route -- Assure qu'on reste sur la même route
//   AND stop_sequence BETWEEN (
//       SELECT MIN(stop_sequence) FROM StopPositions WHERE stop_position = 'start'
//   ) AND (
//       SELECT MAX(stop_sequence) FROM StopPositions WHERE stop_position = 'end'
//   )
//   ORDER BY stop_sequence;`
// ;

export const  findPath = (depart ,arriver) => {
  const start = db.prepare(`SELECT route_id FROM alltrips WHERE stop_id = ?`).all(depart).map(row => row.route_id);
  const ends = db.prepare(`SELECT route_id FROM alltrips WHERE stop_id = ?`).all(arriver).map(row => row.route_id); 
  
  let g = new Graphe();
  
  const getTrips = db.prepare(`SELECT route_id FROM routes`).all();
  for (const element of getTrips) {
    g.ajouterSommet(element.route_id);
  }

  const alltrips = db.prepare(query).all();
  
  for (const element of alltrips) {
    g.ajouterArete(element.route1,element.route2);
  }

  const x=g.bfsMulti(start ,ends);

  console.log("je suis dans x " , x);
  
  let z =[depart]; 
  for (let index = 0; index < x.length-1; index++) {
    z= [...z,connexion(x[index],x[index+1],alltrips)]; 
  }
  z=[...z,arriver];
  
  console.log("je suis dans z ", z,"\npour apres chercher des chemain");
  
  let chemain = [];
  let index = 0;
  
  do{
    let currentResult = [];
    const allforone = db.prepare(`
      SELECT stop_id, stop_sequence 
      FROM alltrips 
      WHERE route_id = ? 
      ORDER BY stop_sequence
    `).all(x[index]).forEach(row => {
      currentResult = [...currentResult, row.stop_id];
    });
  
    let littleChemain =getfinalroute(z[index], z[index+1],currentResult);
    littleChemain = [...littleChemain ,z[index+1]]
    chemain=[...chemain,littleChemain];
    index++;
  }while(index <= x.length-1);

  
  chemain = [x,...chemain];
  
  return chemain;
}

const getfinalroute = (source , destination , route)=>{
  const sourceIndex = route.indexOf(source);
  const destinationIndex  = route.indexOf(destination)
  
  if (sourceIndex === -1 || destinationIndex === -1) {
    console.error("Source ou destination non trouvée dans le route.");
    return [];
  }
  const step = (sourceIndex <= destinationIndex) ? 1 : -1;
  let chemain = [];
  let z= sourceIndex;
  
  while (!(z === destinationIndex)){
      chemain=[...chemain,route[z]];
      z+=step;
  }

  return chemain;
}

const connexion = (el1,el2 , query) =>{
  console.log("je suis dans getroot",typeof(el1),el1,el2);
  for (const element of query) {
    
    if (element.route1 === el1 && element.route2 ===el2) {
      return element.stop_id;
    }
  }
}

// `SELECT * FROM alltrips WHERE stop_id IN (SELECT stop_id FROM alltrips GROUP BY stop_id HAVING COUNT(*)>1) ORDER BY route_id;`
// const test  = `SELECT * FROM alltrips WHERE stop_id  IN (SELECT stop_id FROM alltrips GROUP BY stop_id HAVING COUNT(*)>1) `