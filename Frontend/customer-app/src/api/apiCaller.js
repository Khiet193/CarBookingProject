import { ACCESS_TOKEN, TK_INFO } from "../constants";
import { getValueFor, save } from "../utils/storage";
import { HubConnectionBuilder } from "@aspnet/signalr";

export const apiCaller = async (path, method = "POST", data) => {
  console.log(path, data);
  const accessToken = await getValueFor(ACCESS_TOKEN);
  const options = {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization: accessToken,
    },
    body: JSON.stringify(data),
  };
  // console.log(path, data, options);

  return fetch(`${process.env.EXPO_PUBLIC_API_URL}/${path}`, options)
    .then(async (res) => {
      console.log(typeof res.status);
      if (res.status == 200) {
        return res.json();
      } else if (
        res.status == 401 ||
        res.status == 403 ||
        res.status == 400 ||
        res.status == 405
      ) {
        await save(ACCESS_TOKEN, "");
        // await save(TK_INFO, "");
        throw { message: "Token expired" };
      } else {
        throw res;
      }
    })
    .catch((error) => console.log("API caller", JSON.stringify(error)));
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
        console.log("SIGNALR: " + new Date().toISOString() + ": " + message);
      },
    })
    .build();
};
