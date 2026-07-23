import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import "./Notifications.css";

export default function Notifications({ joueur }) {

  const [notifications, setNotifications] = useState([]);
  const [selection, setSelection] = useState(null);

  useEffect(() => {
    chargerNotifications();
  }, []);

  async function chargerNotifications() {

    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("joueur", joueur)
      .order("created_at", { ascending: false });

    setNotifications(data || []);
  }

  async function ouvrirNotification(notification) {

    setSelection(notification);

    if (!notification.lu) {

      await supabase
        .from("notifications")
        .update({ lu: true })
        .eq("id", notification.id);

      chargerNotifications();

    }

  }

  if (selection) {

    return (

      <div className="notifications">

        <button
          className="retour"
          onClick={() => setSelection(null)}
        >
          ← Retour
        </button>

        <div className="detail-notification">

          <h2>{selection.titre}</h2>

          <p>{selection.message}</p>

          <p><strong>Ton pronostic :</strong> {selection.score_prono}</p>

          <p><strong>Résultat :</strong> {selection.score_reel}</p>

          <h3>+{selection.points} points</h3>

        </div>

      </div>

    );

  }

  return (

    <div className="notifications">

      <h1>🔔 Notifications</h1>

      {

        notifications.length === 0 ?

          <p>Aucune notification.</p>

          :

          notifications.map((n) => (

            <div
              key={n.id}
              className="notification"
              onClick={() => ouvrirNotification(n)}
            >

              <div>

                <h3>{n.titre}</h3>

                <p>{n.message}</p>

              </div>

              <strong>

                +{n.points}

              </strong>

            </div>

          ))

      }

    </div>

  );

}