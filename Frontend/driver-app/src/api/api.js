import { HubConnectionBuilder } from "@aspnet/signalr";
import { getValueFor } from "../utils/storage";
import { ACCESS_TOKEN } from "../constants";

export const apiCaller = async (path, method = "POST", data) => {
  const accessToken = await getValueFor(ACCESS_TOKEN);
  console.log(path, data);
  return fetch(`${process.env.EXPO_PUBLIC_API_URL}/${path}`, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization: accessToken,
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .catch((error) => error);
};

export const makeHubConnection = async () => {
  const accessToken = await getValueFor(ACCESS_TOKEN);
  const signalRUrl = `${process.env.EXPO_PUBLIC_API_URL}/signalRService`;
  return new HubConnectionBuilder()
    .withUrl(signalRUrl, {
      // transport: HttpTransportType.WebSockets,
      accessTokenFactory: () => accessToken,
      logMessageContent: true,
    })
    .configureLogging({
      log: function (logLevel, message) {
        // TODO: Remove after finish testing
        // console.log(logLevel, message);
        // console.log("SIGNALR: " + new Date().toISOString() + ": " + message);
      },
    })
    .build();
};
