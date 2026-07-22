import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import "./Profil.css";

import Nicolas from "../assets/Nicolas.png";
import Fabienne from "../assets/Fabienne.png";
import Nathan from "../assets/Nathan.png";
import Liam from "../assets/Liam.png";
import Ambre from "../assets/Ambre.png";
import Lionel from "../assets/Lionel.png";
import Sophie from "../assets/Sophie.png";
import Mickael from "../assets/Mickael.png";
import Helene from "../assets/Helene.png";

const joueurs = [
  "Nicolas",
  "Fabienne",
  "Nathan",
  "Liam",
  "Ambre",
  "Lionel",
  "Sophie",
  "Mickael",
  "Helene"
];

export default function Profil({ joueur, changerCompte }) {

  const images = {
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

  const couleurs = {
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

  const [gagnantChoisi,setGagnantChoisi]=useState("");
  const [gagnantEnregistre,setGagnantEnregistre]=useState(null);
  const [chargement,setChargement]=useState(true);

  const monProfil = !!changerCompte;

  useEffect(()=>{
    chargerGagnant();
  },[joueur]);

  async function chargerGagnant(){

    setChargement(true);

    const {data,error}=await supabase

      .from("gagnant_tournoi")

      .select("gagnant")

      .eq("joueur",joueur)

      .maybeSingle();

    if(error){

      console.log(error);

      setChargement(false);

      return;

    }

    if(data){

      setGagnantEnregistre(data.gagnant);

    }

    setChargement(false);

  }

  async function validerGagnant(){

    if(!gagnantChoisi){

      alert("Choisis ton gagnant");

      return;

    }

    const {error}=await supabase

      .from("gagnant_tournoi")

      .insert({

        joueur,

        gagnant:gagnantChoisi

      });

    if(error){

      console.log(error);

      alert("Erreur");

      return;

    }

    setGagnantEnregistre(gagnantChoisi);

  }

    return (

    <div className="profil">

      <div className="profil-haut">

        {/* PROFIL */}

        <div className="bloc-profil">

          <div

            className="cadre-profil"

            style={{

              backgroundColor: couleurs[joueur]

            }}

          >

            <img

              src={images[joueur]}

              className="photo-profil"

            />

          </div>

          <h2>{joueur}</h2>

          {

          changerCompte && (

            <button

              onClick={changerCompte}

            >

              Changer de profil

            </button>

          )

          }

        </div>



        {/* GAGNANT */}

        <div className="bloc-profil">

          <h2>

            🏆 Mon gagnant

          </h2>

          {

          chargement ?

          (

            <p>Chargement...</p>

          )

          :

          gagnantEnregistre ?

          (

            <>

              <div

                className="cadre-profil"

                style={{

                  backgroundColor: couleurs[gagnantEnregistre]

                }}

              >

                <img

                  src={images[gagnantEnregistre]}

                  className="photo-profil"

                />

              </div>

              <p>

                {gagnantEnregistre}

              </p>

            </>

          )

          :

          monProfil ?

          (

            <>

              <div className="choix-gagnant">

                {

                joueurs.map((j)=>(

                  <div

                    key={j}

                    className={

                      gagnantChoisi===j

                      ?

                      "profil-choix selection"

                      :

                      "profil-choix"

                    }

                    onClick={()=>setGagnantChoisi(j)}

                  >

                    <div

                      className="rond-profil-choix"

                      style={{

                        backgroundColor: couleurs[j]

                      }}

                    >

                      <img

                        src={images[j]}

                        className="image-profil-choix"

                      />

                    </div>

                  </div>

                ))

                }

              </div>

              <button

                className="button"

                onClick={validerGagnant}

              >

                Valider

              </button>

            </>

          )

          :

          (

            <p>

              Aucun gagnant choisi

            </p>

          )

          }

        </div>

      </div>

    </div>

  );

}