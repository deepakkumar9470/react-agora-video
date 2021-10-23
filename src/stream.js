import React from "react";

import AgoraRTC from "agora-rtc-sdk-ng";

import Video from "./components/Video";



var rtc = {
    client: null,
    joined: false,
    published:false,
    localStream:  null,
    remoteStream:  [],
    params: {}
}
// appCertificate : "527ca7484e694e6fa395cd52d1c4848c"
var options = {
     appId: "37f2ef738a364ee8b20eb385da8d2e28",
     channel : "deepakTv",
     uid: null,
     token : "00637f2ef738a364ee8b20eb385da8d2e28IAAY0bUkHKriag7345cCKMQJJIJaccNvGN4FXh+c4CS9f7KUT+kAAAAAEACHtvL/qw50YQEAAQCnDnRh",
     key : "ahhxhcsbcbsbc665",
     secret : "deepakkumar3y49u9"
} 