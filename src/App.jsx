import { useState } from "react";
import "./App.css";

import Pronostics from "./pages/Pronostics";
import Classement from "./pages/Classement";
import Admin from "./pages/Admin";
import Profil from "./pages/Profil";


import Nicolas from "./assets/Nicolas.png";
import Fabienne from "./assets/Fabienne.png";
import Nathan from "./assets/Nathan.png";
import Liam from "./assets/Liam.png";
import Ambre from "./assets/Ambre.png";
import Lionel from "./assets/Lionel.png";
import Sophie from "./assets/Sophie.png";
import Mickael from "./assets/Mickael.png";
import Helene from "./assets/Helene.png";



const joueurs = [
  "Nicolas",
  "Fabienne",
  "Nathan",
  "Liam",
  "Ambre",
  "Lionel",
  "Sophie",
  "Mickael",
  "Helene",
];



const imagesJoueurs = {

  Nicolas,
  Fabienne,
  Nathan,
  Liam,
  Ambre,
  Lionel,
  Sophie,
  Mickael,
  Helene

};



const couleursJoueurs = {

  Nicolas:"#3498db",
  Fabienne:"#e84393",
  Nathan:"#f1c40f",
  Liam:"#2ecc71",
  Ambre:"#9b59b6",
  Lionel:"#e67e22",
  Sophie:"#1abc9c",
  Mickael:"#e74c3c",
  Helene:"#95a5a6"

};






function App() {



  const [joueur, setJoueur] = useState(
    localStorage.getItem("joueur") || ""
  );


  const [connecte, setConnecte] = useState(
    localStorage.getItem("joueur") ? true : false
  );


  const [onglet, setOnglet] = useState("pronos");


  // AJOUT POUR LE PROFIL VISITE
  const [profilVisite,setProfilVisite] = useState("");





  const estAdmin = joueur === "Nathan";






  function changerCompte(){

    localStorage.removeItem("joueur");

    setJoueur("");

    setProfilVisite("");

    setConnecte(false);

    setOnglet("pronos");

  }







  function connexion(nom){


    localStorage.setItem(
      "joueur",
      nom
    );


    setJoueur(nom);

    setConnecte(true);


  }









  if(!connecte){


    return (

      <div className="app">


        <div className="card">


          <h1>
            🏆 Tournoi Pronos
          </h1>




          <div className="choix-profils">



          {

          joueurs.map((j)=>(


            <div

            key={j}

            className="profil-choix"

            onClick={()=>connexion(j)}

            >



              <div

              className="rond-profil-choix"

              style={{

                backgroundColor:
                couleursJoueurs[j]

              }}

              >



                <img

                src={imagesJoueurs[j]}

                className="image-profil-choix"

                />



              </div>



              <p>

              {j}

              </p>



            </div>



          ))

          }




          </div>




        </div>


      </div>

    );


  }









  return (

    <div className="app">





      {onglet === "pronos" &&

      <Pronostics joueur={joueur}/>

      }








      {onglet === "classement" &&

      <Classement

      ouvrirProfil={(nom)=>{

        setProfilVisite(nom);

        setOnglet("profil");

      }}

      />

      }








      {onglet === "admin" && estAdmin &&

      <Admin/>

      }








      {onglet === "profil" &&

<Profil

joueur={profilVisite || joueur}

changerCompte={
  profilVisite ? null : changerCompte
}

/>

}









      <div className="navigation">





        <button

        onClick={()=>setOnglet("pronos")}

        >

        🎯

        <br/>

        Pronostics

        </button>








        <button

        onClick={()=>setOnglet("classement")}

        >

        🏆

        <br/>

        Classement

        </button>








        {estAdmin && (

        <button

        onClick={()=>setOnglet("admin")}

        >

        👑

        <br/>

        Admin

        </button>

        )}








        <button

        onClick={()=>{

          setProfilVisite("");

          setOnglet("profil");

        }}

        >

        👤

        <br/>

        Profil

        </button>






      </div>




    </div>

  );


}


export default App;