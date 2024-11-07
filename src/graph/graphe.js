class Graphe {
  constructor() {
      this.adjacence = {}; // On stocke les nœuds sous forme de clé-valeur
  }

  ajouterSommet(sommet) {
      if (!this.adjacence[sommet]) {
          this.adjacence[sommet] = [];
      }
  }

  ajouterArete(sommet1, sommet2) {
      if (this.adjacence[sommet1]) {
          this.adjacence[sommet1].push(sommet2);
      } else {
          this.adjacence[sommet1] = [sommet2];
      }
  }

  afficherGraphe() {
      for (let sommet in this.adjacence) {
          console.log(`${sommet} --> ${this.adjacence[sommet].join(", ")}`);
      }
  }

  // Algorithme de recherche en largeur (BFS) pour trouver le plus court chemin entre plusieurs départs et arrivées
  bfsMulti(departs, arrivees) {
      let file = [...departs]; // Ajoute tous les départs dans la file initiale
      let visites = {}; // Garde trace des sommets visités
      let predecesseurs = {}; // Pour reconstruire le chemin

      // Marquer tous les sommets de départ comme visités
      for (let depart of departs) {
          visites[depart] = true;
          predecesseurs[depart] = null;
      }

      // Tant que la file n'est pas vide
      while (file.length > 0) {
          let sommet = file.shift(); // On retire un sommet de la file

          // Si on atteint un des sommets d'arrivée, on reconstruit le chemin
          if (arrivees.includes(sommet)) {
              let chemin = [];
              while (sommet !== null) {
                  chemin.push(sommet);
                  sommet = predecesseurs[sommet];
              }
              return chemin.reverse(); // On retourne le chemin dans le bon ordre
          }

          // Parcourir les voisins du sommet actuel
          for (let voisin of this.adjacence[sommet]) {
              if (!visites[voisin]) {
                  visites[voisin] = true;
                  predecesseurs[voisin] = sommet; // On garde trace du prédécesseur
                  file.push(voisin); // On ajoute le voisin à la file
              }
          }
      }

      // Si aucun chemin n'a été trouvé
      return null;
  }
}
export default Graphe;
