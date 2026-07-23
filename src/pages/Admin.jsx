import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import "./Admin.css";


import Nicolas from "../assets/Nicolas.png";
import Fabienne from "..//assets/Fabienne.png";
import Nathan from "../assets/Nathan.png";
import Liam from "../assets/Liam.png";
import Ambre from "../assets/Ambre.png";
import Lionel from "../assets/Lionel.png";
import Sophie from "../assets/Sophie.png";
import Mickael from "../assets/Mickael.png";
import Helene from "../assets/Helene.png";



export default function Admin() {



const [jeu,setJeu] = useState("Palets");

const [format,setFormat] = useState("Solo");


const [joueurs,setJoueurs] = useState([]);

const [matches,setMatches] = useState([]);

const [scores,setScores] = useState({});



// FIN TOURNOI

const [modeFinTournoi,setModeFinTournoi] = useState(false);

const [vainqueurChoisi,setVainqueurChoisi] = useState("");





const listeJoueurs = [

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







useEffect(()=>{

chargerMatchs();

},[]);








async function chargerMatchs(){


const {data,error}=await supabase

.from("matches")

.select("*")

.eq("termine",false)

.order("created_at",{ascending:false});



if(error){

console.log(error);

}

else{

setMatches(data);

}


}









function choisirJoueur(joueur){


setJoueurs((anciens)=>{


// si déjà sélectionné → retirer
if(anciens.includes(joueur)){

return anciens.filter(j=>j!==joueur);

}


// limite joueurs
const nombreMax = format==="Solo" ? 2 : 4;


// empêcher doublon
if(anciens.includes(joueur)){

return anciens;

}


// ajouter
if(anciens.length < nombreMax){

return [
...anciens,
joueur
];

}



return anciens;


});


}









async function creerMatch(){


const nombre = format==="Solo" ? 2 : 4;



if(joueurs.length !== nombre){


alert(`Choisis ${nombre} joueurs`);

return;

}







const nouveauMatch={


jeu:jeu,

format:format,


joueur1:joueurs[0] || null,

joueur2:joueurs[1] || null,

joueur3:joueurs[2] || null,

joueur4:joueurs[3] || null,


termine:false,

score1_final:null,

score2_final:null


};







const {error}=await supabase

.from("matches")

.insert(nouveauMatch);





if(error){

console.log(error);

alert(error.message);


}

else{


alert("Match créé !");

setJoueurs([]);

chargerMatchs();


}



}






async function calculerPointsMatch(id, score1Final, score2Final){

const { data: param } = await supabase
  .from("parametres")
  .select("phases_finales")
  .eq("id", 1)
  .single();

const pointsExact = param?.phases_finales ? 15 : 10;
const pointsBon = param?.phases_finales ? 5 : 3;


const {data:pronos,error}=await supabase

.from("pronostics")

.select("*")

.eq("match_id",id);



if(error){

console.log(error);

return;

}




for(const prono of pronos){


let points = 0;

let scoreExact = false;

let bonVainqueur = false;





if(

Number(prono.score1) === Number(score1Final)

&&

Number(prono.score2) === Number(score2Final)

){

points = pointsExact;

scoreExact = true;

}



else {


const gagnantMatch =

Number(score1Final) > Number(score2Final)

? "1"

: "2";



const gagnantProno =

Number(prono.score1) > Number(prono.score2)

? "1"

: "2";




if(gagnantMatch === gagnantProno){

points = pointsBon;

bonVainqueur = true;

}


}


if(prono.x2){

points *= 2;

}


await supabase

.from("points_pronostics")

.insert({

joueur:prono.joueur,

match_id:id,

score_exact:scoreExact,

bon_vainqueur:bonVainqueur,

points:points

});

if(points > 0){

  await supabase
  .from("notifications")
  .insert({

    joueur: prono.joueur,

    titre: scoreExact
      ? "🎯 Tu as visé juste !"
      : "👏 Bien vu !",

    message: scoreExact
      ? "Tu avais pronostiqué le score exact."
      : "Tu avais trouvé le bon vainqueur.",

    points: points,

    match_id: id,

    score_reel: `${score1Final}-${score2Final}`,

    score_prono: `${prono.score1}-${prono.score2}`

  });

}

}


}


async function terminerMatch(id){


const score=scores[id];



if(

!score ||

score.score1==="" ||

score.score2===""

){

alert("Entre les scores");

return;

}




const score1Final = Number(score.score1);

const score2Final = Number(score.score2);




const {error}=await supabase

.from("matches")

.update({

score1_final:score1Final,

score2_final:score2Final,

termine:true

})

.eq("id",id);





if(error){

console.log(error);

alert(error.message);

return;

}




await calculerPointsMatch(

id,

score1Final,

score2Final

);




alert("🏁 Match terminé + points calculés !");


chargerMatchs();


}








async function supprimerMatch(id){


await supabase

.from("matches")

.delete()

.eq("id",id);



chargerMatchs();


}



async function activerPhasesFinales(){


const {error}=await supabase

.from("parametres")

.update({

phases_finales:true

})

.eq("id",1);



if(error){

console.log(error);

alert(error.message);

return;

}


alert("🏆 Mode phases finales activé");


}





async function validerFinTournoi(){


if(!vainqueurChoisi){

alert("Choisis un vainqueur");

return;

}




const {error}=await supabase

.from("vainqueur_tournoi")

.insert({

vainqueur:vainqueurChoisi

});




if(error){

console.log(error);

alert(error.message);

return;

}





const {data}=await supabase

.from("gagnant_tournoi")

.select("*")

.eq("gagnant",vainqueurChoisi);





if(data){


for(const joueur of data){


await supabase

.from("bonus_gagnant")

.insert({

joueur:joueur.joueur,

points:"30"

});


}


}




alert("🏆 Fin du tournoi validée !");


setModeFinTournoi(false);


}

return (


<div className="admin">



<h1>
⚙️ Administration
</h1>





{
modeFinTournoi ?


<div className="creation">


<h2>
🏆 Fin de tournoi
</h2>



<h3>
Choisis le vainqueur
</h3>




<div className="joueurs">


{

listeJoueurs.map(j=>(


<div

key={j}

className={
vainqueurChoisi===j
?
"profil-choisi-admin"
:
"profil-admin"
}

onClick={()=>setVainqueurChoisi(j)}

>



<div

className="rond-profil-admin"

style={{

backgroundColor:couleursJoueurs[j]

}}

>



<img

src={imagesJoueurs[j]}

className="image-profil-admin"

/>



</div>




<p>

{j}

</p>



</div>



))


}



</div>







<button

className="creer"

onClick={validerFinTournoi}

>

🏆 Valider le vainqueur

</button>




<button

className="reset"

onClick={()=>{

setModeFinTournoi(false);

setVainqueurChoisi("");

}}

>

← Retour

</button>

<button

className="creer"

onClick={activerPhasesFinales}

>

🏆 Phases finales

</button>





</div>



:

<>



<div className="creation">


<h2>
Créer un match
</h2>





<h3>
Jeu
</h3>


<div className="boutons">


<button

className={jeu==="Palets"?"active":""}

onClick={()=>setJeu("Palets")}

>

🎯 Palets

</button>




<button

className={jeu==="Petanque"?"active":""}

onClick={()=>setJeu("Petanque")}

>

🔴 Pétanque

</button>



</div>







<h3>
Format
</h3>



<div className="boutons">


<button

className={format==="Solo"?"active":""}

onClick={()=>{

setFormat("Solo");

setJoueurs([]);

}}

>

👤 Solo

</button>





<button

className={format==="Duo"?"active":""}

onClick={()=>{

setFormat("Duo");

setJoueurs([]);

}}

>

👥 Duo

</button>




</div>







<h3>
Joueurs
</h3>



<div className="joueurs">


{

listeJoueurs.map(j=>(


<button

key={j}

className={
joueurs.includes(j)
?
"choisi"
:
""
}

onClick={()=>choisirJoueur(j)}

>

{j}

</button>



))


}


</div>





<p>
Joueurs sélectionnés : {joueurs.length}/
{format==="Solo" ? 2 : 4}
</p>





<button

className="creer"

onClick={creerMatch}

>

➕ Créer le match

</button>






<button

className="creer"

onClick={()=>setModeFinTournoi(true)}

>

🏆 Fin de tournoi

</button>

<button
className="creer"
onClick={activerPhasesFinales}
>
🏆 Activer les phases finales
</button>




</div>







<div className="liste">


<h2>
Matchs
</h2>





{

matches.map(m=>(


<div

className="match"

key={m.id}

>



<div>



<h3>

{m.jeu} - {m.format}

</h3>




<p>

{m.joueur1} - {m.joueur2}

</p>



{

m.joueur3 &&

<p>

{m.joueur3} - {m.joueur4}

</p>

}






{

m.termine ?



<p>

✅ Terminé :

{m.score1_final}

-

{m.score2_final}

</p>




:


<div>


<input

type="number"

placeholder="Score 1"

onChange={(e)=>

setScores({

...scores,

[m.id]:{

...scores[m.id],

score1:e.target.value

}

})

}


/>





<input

type="number"

placeholder="Score 2"

onChange={(e)=>

setScores({

...scores,

[m.id]:{

...scores[m.id],

score2:e.target.value

}

})

}


/>





<button

onClick={()=>terminerMatch(m.id)}

>

🏁 Terminer

</button>



</div>



}




</div>







<button

onClick={()=>supprimerMatch(m.id)}

>

🗑️

</button>



</div>



))


}







<button

className="reset"

onClick={async()=>{


if(confirm("Reset complet ?")){


await supabase

.from("matches")

.delete()

.neq("id",0);



await supabase

.from("pronostics")

.delete()

.neq("id",0);



await supabase

.from("gagnant_tournoi")

.delete()

.neq("id",0);



await supabase

.from("bonus_gagnant")

.delete()

.neq("id",0);



await supabase

.from("vainqueur_tournoi")

.delete()

.neq("id",0);

await supabase
  .from("parametres")
  .update({
    phases_finales: false
  })
  .eq("id", 1);



alert("🔥 Reset complet effectué");


setMatches([]);

chargerMatchs();


}


}}

>

🔥 RESET

</button>






</div>


</>


}





</div>


);


}

<button
className="creer"
onClick={changerPhaseFinale}
>
🏆 Phases finales
</button>

async function changerPhaseFinale(){

await supabase

.from("parametres")

.update({

phases_finales:true

})

.eq("id",1);


alert("🏆 Mode phases finales activé");

}