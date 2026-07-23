import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import "./Pronostics.css";


import Nicolas from "../assets/Nicolas.png";
import Fabienne from "../assets/Fabienne.png";
import Nathan from "../assets/Nathan.png";
import Liam from "../assets/Liam.png";
import Ambre from "../assets/Ambre.png";
import Lionel from "../assets/Lionel.png";
import Sophie from "../assets/Sophie.png";
import Mickael from "../assets/Mickael.png";
import Helene from "../assets/Helene.png";



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





function PhotoJoueur({nom}){


return (

<div

className="mini-cadre-match"

style={{

backgroundColor:couleursJoueurs[nom]

}}

>


<img

src={imagesJoueurs[nom]}

className="mini-photo-match"

/>


</div>

);


}







export default function Pronostics({joueur}){


const [matches,setMatches] = useState([]);

const [matchSelectionne,setMatchSelectionne] = useState(null);

const [pronos,setPronos] = useState([]);

const [score1,setScore1] = useState("");

const [score2,setScore2] = useState("");





useEffect(()=>{

chargerMatchs();

},[]);






async function chargerMatchs(){

const {data,error}=await supabase
.from("matches")
.select("*")
.order("created_at",{ascending:false});


if(error){
console.log(error);
return;
}


// récupérer les points du joueur connecté
const {data: points} = await supabase
.from("points_pronostics")
.select("*")
.eq("joueur", joueur);



const matchsAvecPoints = data.map(match=>{


const monPoint = points?.find(
(p)=>p.match_id === match.id
);


return {

...match,

pointsUtilisateur: monPoint ? monPoint.points : null

};


});


setMatches(matchsAvecPoints);


}









async function ouvrirMatch(match){


setMatchSelectionne(match);



const {data,error}=await supabase

.from("pronostics")

.select("*")

.eq("match_id",match.id);



if(!error){

setPronos(data);

}


}






function monProno(){


return pronos.find(

(p)=>p.joueur===joueur

);


}








async function enregistrerProno(){

if(matchSelectionne.termine){

  alert("🏁 Match terminé, les pronostics sont fermés");

  return;

}


if(score1==="" || score2===""){

alert("Entre un score");

return;

}



if(monProno()){

return;

}




const {error}=await supabase

.from("pronostics")

.insert({

match_id:matchSelectionne.id,

joueur:joueur,

score1:Number(score1),

score2:Number(score2)

});




if(error){

console.log(error);

alert("Erreur");

return;

}



setScore1("");

setScore2("");

ouvrirMatch(matchSelectionne);


}








if(matchSelectionne){


return (

<div className="pronostics">


<button

className="retour"

onClick={()=>setMatchSelectionne(null)}

>

← Retour

</button>






<div className="zone-prono">



<div className="joueurs-match-detail">


<div className="equipe-match">


<PhotoJoueur nom={matchSelectionne.joueur1}/>

<span>
{matchSelectionne.joueur1}
</span>


{
matchSelectionne.joueur3 && (
<>

<PhotoJoueur nom={matchSelectionne.joueur2}/>

<span>
{matchSelectionne.joueur2}
</span>

</>
)
}


</div>





<h2>
VS
</h2>





<div className="equipe-match">


{
matchSelectionne.joueur3 ? (

<>

<PhotoJoueur nom={matchSelectionne.joueur3}/>

<span>
{matchSelectionne.joueur3}
</span>


<PhotoJoueur nom={matchSelectionne.joueur4}/>

<span>
{matchSelectionne.joueur4}
</span>

</>

)

:

(

<>

<PhotoJoueur nom={matchSelectionne.joueur2}/>

<span>
{matchSelectionne.joueur2}
</span>

</>

)

}


</div>



</div>






{
matchSelectionne.termine ? (

<div className="prono-enregistre">

🏁 Match terminé

</div>

)

:

monProno()

?


<div className="prono-enregistre">

✅ Prono enregistré

</div>



:


<>


<div className="entree-score">


<input

type="number"

value={score1}

placeholder="Score"

onChange={(e)=>setScore1(e.target.value)}

/>


<span>
-
</span>



<input

type="number"

value={score2}

placeholder="Score"

onChange={(e)=>setScore2(e.target.value)}

/>



</div>





<button onClick={enregistrerProno}>

Valider mon prono

</button>


</>


}







<div className="pronos-autres">


<h2>

Pronostics des joueurs

</h2>





{

pronos.map((p)=>(


<div

className="prono-autre"

key={p.id}

>


<span>

{p.joueur}

</span>


<strong>

{p.score1}

-

{p.score2}

</strong>


</div>


))


}




</div>





</div>

</div>

);


}









return (

<div className="pronostics">


<h1>

🎯 Pronostics

</h1>







<div className="cartes">


{

matches.map((match)=>(


<div

className="carte-match"

key={match.id}

onClick={()=>ouvrirMatch(match)}

>





<h2>

{match.jeu}

</h2>





{match.joueur3 ? (

<>
<div className="equipes-match">

  <div className="equipe">

    <PhotoJoueur nom={match.joueur1}/>
    <PhotoJoueur nom={match.joueur2}/>

  </div>

  <span className="vs-match">VS</span>

  <div className="equipe">

    <PhotoJoueur nom={match.joueur3}/>
    <PhotoJoueur nom={match.joueur4}/>

  </div>

</div>

<p>

{match.joueur1} / {match.joueur2}

<br/>

{match.joueur3} / {match.joueur4}

</p>
</>

) : (

<>

<p>

{match.joueur1}

-

{match.joueur2}

</p>

<div className="joueurs-match">

<PhotoJoueur nom={match.joueur1}/>

<PhotoJoueur nom={match.joueur2}/>

</div>

</>

)}







{
match.termine ?

<>

<h1>
{match.score1_final} - {match.score2_final}
</h1>

<p className="points-gagnes">
+{match.pointsUtilisateur || 0} pts
</p>

</>

:

<h1>
? - ?
</h1>

}

{match.termine && (
  <p className="points-gagnes">
    +{match.pointsUtilisateur || 0} pts
  </p>
)}



</div>


))


}





</div>





</div>

);


}