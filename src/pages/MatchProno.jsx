import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import "./MatchProno.css";


export default function MatchProno({match, retour}){


const [score1,setScore1] = useState("");

const [score2,setScore2] = useState("");

const [liste,setListe] = useState([]);

const [dejaPronostique,setDejaPronostique] = useState(false);





useEffect(()=>{

chargerPronostics();

},[]);







async function chargerPronostics(){



const {data,error}=await supabase
.from("pronostics")
.select("*")
.eq("match_id",match.id);




if(error){

console.log(error);

return;

}




setListe(data);





const monProno = data.find(

(p)=>p.joueur==="Nathan"

);





if(monProno){

setDejaPronostique(true);

}




}









async function envoyer(){



if(score1==="" || score2===""){


alert("Entre un score");


return;


}







const {error}=await supabase
.from("pronostics")
.insert({


match_id:match.id,


joueur:"Nathan",


score1:Number(score1),


score2:Number(score2)



});







if(error){


alert(error.message);


}

else{


setDejaPronostique(true);


chargerPronostics();


}



}









return (



<div className="interface-prono">





<button

className="retour"

onClick={retour}

>

← Retour

</button>








<h1>

{match.jeu}

</h1>








<div className="combat">



<div>

<h2>
{match.joueur1}
</h2>

</div>




<h1>
VS
</h1>




<div>

<h2>
{match.joueur2}
</h2>


</div>



</div>









{

match.termine ?





<div className="score-final">


<h2>

🏆 Score final

</h2>


<h1>

{match.score1_final}

-

{match.score2_final}

</h1>


</div>







:





dejaPronostique ?






<div className="enregistre">


<h2>
✅ Pronostic enregistré
</h2>


<p>
Ton pronostic a bien été pris en compte.
</p>


</div>








:





<div className="zone-saisie">



<h2>
Ton pronostic
</h2>





<div>


<input

type="number"

placeholder="0"

value={score1}

onChange={(e)=>

setScore1(e.target.value)

}


/>



<span>
-
</span>





<input

type="number"

placeholder="0"

value={score2}

onChange={(e)=>

setScore2(e.target.value)

}

/>



</div>







<button

onClick={envoyer}

>

Valider mon pronostic

</button>





</div>





}









<div className="autres">



<h2>
Pronostics des joueurs
</h2>






{

liste.length===0 ?



<p>
Aucun pronostic
</p>





:





liste.map((p)=>(



<div key={p.id}>


<b>
{p.joueur}
</b>


 :

 {p.score1}

 -

 {p.score2}



</div>



))



}






</div>







</div>



);


}