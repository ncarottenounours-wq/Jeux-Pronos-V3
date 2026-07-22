import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import "./Classement.css";


import Nicolas from "../assets/Nicolas.png";
import Fabienne from "../assets/Fabienne.png";
import Nathan from "../assets/Nathan.png";
import Liam from "../assets/Liam.png";
import Ambre from "../assets/Ambre.png";
import Lionel from "../assets/Lionel.png";
import Sophie from "../assets/Sophie.png";
import Mickael from "../assets/Mickael.png";
import Helene from "../assets/Helene.png";


import or from "../assets/medaille-or.png";
import argent from "../assets/medaille-argent.png";
import bronze from "../assets/medaille-bronze.png";





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










export default function Classement({ouvrirProfil}){



const [classement,setClassement] = useState([]);









useEffect(()=>{

chargerClassement();

},[]);









async function chargerClassement(){



const {data,error}=await supabase

.from("pronostics")

.select("*");





if(error){

console.log(error);

return;

}






const {data:bonus}=await supabase

.from("bonus_gagnant")

.select("*");







const resultat = joueurs.map((nom)=>{





const mesPronos = data.filter(

(p)=>p.joueur===nom

);






let exact=0;

let bons=0;

let points=0;







mesPronos.forEach((p)=>{



if(p.exact){


exact++;

points+=3;


}



else if(p.bon){


bons++;

points+=1;


}



});







// Ajout des points du gagnant du tournoi

const mesBonus = bonus?.filter(

(b)=>b.joueur===nom

) || [];





mesBonus.forEach((b)=>{


points += b.points;


});









return {


pseudo:nom,

exact,

bons,

points


};




});







resultat.sort(

(a,b)=>b.points-a.points

);







setClassement(resultat);



}













function afficherMedaille(index){


if(index===0){

return or;

}


if(index===1){

return argent;

}


if(index===2){

return bronze;

}


return null;


}









return (


<div className="classement">





<h1>

🏆 Classement

</h1>








<div className="table-classement">







<div className="ligne titre">



<div>

Pseudo

</div>



<div>

Pronos exact

</div>



<div>

Bons Pronos

</div>



<div>

Points

</div>



<div>

</div>



</div>









{

classement.map((joueur,index)=>(




<div

className="ligne"

key={joueur.pseudo}

onClick={()=>ouvrirProfil && ouvrirProfil(joueur.pseudo)}

style={{

cursor:ouvrirProfil ? "pointer":"default"

}}

>








<div className="pseudo">






<div

className="mini-cadre"

style={{

backgroundColor:couleurs[joueur.pseudo]

}}

>





<img

src={images[joueur.pseudo]}

className="mini-profil"

/>





</div>








<span>

{joueur.pseudo}

</span>






</div>









<div>

{joueur.exact}

</div>







<div>

{joueur.bons}

</div>







<div>

{joueur.points}

</div>







<div>


{

afficherMedaille(index) &&


<img

src={afficherMedaille(index)}

className="medaille"

/>


}



</div>







</div>





))


}








</div>







</div>


);



}