import Env from "../../constants/Environment";

export const sendPushNotification = async () => {
  const response = await fetch("https://fcm.googleapis.com/fcm/send",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "key=" + Env.messagingKey
      },
      body: JSON.stringify({
        "to": "/topics/admins",
        "notification": {
          "body": "You have received a new order!",
          "title": "Order received"
        },
        "priority": "high"
      })
    }
  );

  if (!response.ok) {
    throw new Error("Something went wrong!");
  }

  const resData = await response.json();

}