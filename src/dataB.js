import Database from 'better-sqlite3';

export const db = new Database('database/tras.db');
db.pragma('journal_mode = WAL');

export const allStat = () =>{
  const station = db.prepare("SELECT stop_id, stop_name FROM stops WHERE stop_id IN ( SELECT DISTINCT stop_id FROM alltrips ) ORDER BY stop_name").all();
  return station;
}

// cree alltrips pour faciliter le regroupment des ligne dans une table (mauvaise pratique mais on a besoin de ca pour faciliter le traitment ) )
// export const makeRoot = () =>{
//   const data = db.prepare("SElECT route_id FROM routes").all();
//   for( const idr of data){  
//     const routeData = db.prepare("SELECT * FROM stop_times WHERE trip_id in ( SELECT trip_id FROM trips WHERE route_id = ? LIMIT 1)").all(idr.route_id);
//     for(const x of routeData){
//       console.log(idr.route_id ,x.stop_id , x.stop_sequence);
//       const y= db.prepare("INSERT INTO alltrips (route_id, stop_id, stop_sequence) VALUES (?, ?, ?)").run(idr.route_id ,x.stop_id , x.stop_sequence); 
//     }
//   } 
// }


//faciliter les donner en regroupant toutes les station sous le meme id (station parent)
// export const updateData = ()=>{
//   const data = db.prepare("SELECT * FROM alltrips").all();
//   // console.log(data);
//   for(const stops of data){
//     const x = db.prepare("SELECT parent_station FROM stops WHERE stop_id = ?").get(stops.stop_id);
//     const y = db.prepare("UPDATE alltrips SET stop_id = ? WHERE stop_id = ? ").run(x.parent_station , stops.stop_id);
//     // console.log(x); 
//   }
// }