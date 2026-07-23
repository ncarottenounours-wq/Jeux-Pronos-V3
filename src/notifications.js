import { getToken } from "firebase/messaging";
import { messaging } from "./firebase";
import { supabase } from "./supabase";


export async function activerNotifications(joueur){


const permission = await Notification.requestPermission();


if(permission !== "granted"){

alert("Notifications refusées");

return;

}



const token = await getToken(messaging,{

vapidKey:"BIX54VNzpEaiSVVdNsTxfcqppc7nHIciMPeLwqoFn8kqxgSYWCtnXiUoIQX1vyUFwAxffLuM2rHCZ7FdKk-OFVA"

});



if(!token){

console.log("Pas de token");

return;

}




await supabase

.from("notifications_users")

.insert({

joueur:joueur,

token:token

});



alert("🔔 Notifications activées !");


}