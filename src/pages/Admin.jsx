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


if(joueurs.includes(joueur)){


setJoueurs(

joueurs.filter(j=>j!==joueur)

);


return;

}





const nombreMax = format==="Solo" ? 2 : 4;



if(joueurs.length < nombreMax){


setJoueurs([

...joueurs,

joueur

]);


}


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






const {error}=await supabase

.from("matches")

.update({

score1_final:Number(score.score1),

score2_final:Number(score.score2),

termine:true

})

.eq("id",id);






if(error){

console.log(error);

alert(error.message);

}



chargerMatchs();



}









async function supprimerMatch(id){


await supabase

.from("matches")

.delete()

.eq("id",id);



chargerMatchs();


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

points:10

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

Sélection :
{joueurs.join(" - ")}

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