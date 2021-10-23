
import './App.css';
import Video from './components/Video';

import AgoraRTC from "agora-rtc-sdk-ng";

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
     appId: process.env.APPID,
     channel : process.env.CHANNEL,
     uid: null,
     token : process.env.TOKEN,
     key : process.env.KEY,
     secret : process.env.SECRET
} 

function App() {


  const joinChannel =  (role) =>{
      // Create a client
          rtc.client =  AgoraRTC.createClient({ mode: "live", codec: "h264" });

         // Iniialize the client

         rtc.client.init(options.appId,()=>{
           console.log('Init Success..')
            

              // Join a channel

               rtc.client.join(options.token ? 
                options.token: null ?
                options.channel  : options.uid? +options.uid : null, function(uid){
                  console.log('join channle' + options.channel + "success uid"+uid);

                   rtc.params.uid = uid
                  if(role === 'host'){
                     rtc.client.setClientRole("host")
                     rtc.localStream = AgoraRTC.createStream({
                      streamId: rtc.params.uid,
                      audio :true,
                      video: true,
                      screen:  false
                    });

                    // Initialize the local stream

                     rtc.localStream.init(function(){
                      console.log('local stream success..')
                       rtc.localStream.play('local_stream');

                       rtc.client.publish(rtc.localStream, function(err){
                        console.log('Publish failed..')
                        console.error('error', err)


                      });

                    } ,function(err){
                      console.log('Init localstream  failed..',err)
                    })

                     rtc.client.on('connection-state-change', function(event){
                      console.log('audience',event)
                    })
                  }

                  if(role === 'audience'){
                     rtc.client.on('connection-state-change', function(event){
                      console.log('audience',event)
                    })
                     rtc.client.on('stream-added', function(event){
                        var remoteStream = event.stream;
                        var id = rtc.params.getId();
                        if(rtc!== rtc.params.uid){
                          rtc.client.subscribe(remoteStream,function(err){
                            console.log('stream subsribe failed..',err)
                          });
                        }
                        console.log('stream added remote-uid..',id)

                    });

                     rtc.client.on('stream-removed', function(event){
                      var remoteStream = event.stream;
                      var id = rtc.params.getId();
                      
                      console.log('stream removed remote-uid..',id)

                    });

                     rtc.client.on('stream-subscribed', function(event){
                      var remoteStream = event.stream;
                      var id = rtc.params.getId();
                      remoteStream.play('remote_video');

                      console.log('stream subscribed remote-uid..',id)

                    });

                     rtc.client.on('stream-unsubscribed', function(event){
                      var remoteStream = event.stream;
                      var id = rtc.params.getId();
                      remoteStream.pause('remote_video');

                      console.log('stream unsubscribed remote-uid..',id)

                    });


                  }

                }, function(err){
                  console.log('client init failed',err)
                })
         }, (err) =>{
           console.error(err)
         })

  };



  const leaveEventHost = async (params) =>{
      await rtc.client.unpublish(rtc.localStream, (err) =>{
        console.log('publish failed..')
        console.error(err)
      })
      await rtc.client.leave( (event) =>{
        console.log('host leave', event)
        
      })        
  };


  const leaveEventAudience = async (params) =>{
    
   await rtc.client.leave( (event) =>{
      console.log('Client leaves the channel', event)
      
     }, (err) =>{
       console.log('Client leaves failed', err)
     }) ;       
  };


  return (
    <div className="container">
      <h2>React Streaming App using Agora</h2>
        <div className="form_div">
             
             <button className="videoBtn" onClick={()=>joinChannel("host")}>
               Join Channel as Host
               </button>

             <button className="videoBtn" onClick={()=>joinChannel("audience")}>
             Join Channel as Audience
              </button>

             <button className="videoBtn" onClick={()=>leaveEventHost("host")}>
              Leave Event  Host
               </button>
               
             <button className="videoBtn" onClick={()=>leaveEventAudience("audience")}>
               Leave Event Audience
               </button>


              <div className="local_stream" id="local_stream" style={{width : '400px', height:"400px"}}>
              </div> 

              <div className="remote_video" id="remote_video" style={{width : '400px', height:"400px"}}>
              </div> 

        </div>
    </div>
  );
}



export default App;
