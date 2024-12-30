import { CometChat } from "@cometchat-pro/chat";

export const initializeCometChat = () => {
  let appID = "25617120a1512061";
  let region = "us";
  let appSetting = new CometChat.AppSettingsBuilder()
    .subscribePresenceForAllUsers()
    .setRegion(region)
    .autoEstablishSocketConnection(true)
    .build();
  CometChat.init(appID, appSetting);
};
