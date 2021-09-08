 chrome.runtime.onConnect.addListener(function (port) {
    console.assert(port.name == "knockknock");
    port.onMessage.addListener(function (msg) {
       
        if (msg.joke == "Knock knock") {


            ScrapeAttendees(function (result) {
                
                  
                    port.postMessage({ request: "setList", data: result});
                   
           
               
            });
        
          


        }
        if(msg.joke == 'exclude')
        {
          
            getPresenterName(function(result)
            {
                port.postMessage({request: 'excludePresenter',data: result});
            });
         
        }

        

    });
});

function waitForElement(callBack) {

    setTimeout(function () {

        callBack();
    }, 500);
}
 


function getPresenterName(callBack)
{
   
        var hostname = document.getElementsByClassName('jcGw9c')[0].parentElement.getElementsByClassName('ZjFb7c')[0].innerText
        callBack(hostname);
        return hostname;
   
      
    
}

 
function ScrapeAttendees(callBack1) {


    try {
        if (document.getElementsByClassName("uArJ5e UQuaGc kCyAyd QU4Gid foXzLb IeuGXd")[0].getAttribute("aria-expanded") == "false") {
            try {

                document.getElementsByClassName("uArJ5e UQuaGc kCyAyd QU4Gid foXzLb IeuGXd")[0].click()
            } catch (err) {
                console.log("Error Old UI: " + err)
            }
        }
    } catch (err) {
        console.log("Not OLD UI : " + err)
    }
    try {
        if (document.getElementsByClassName("VfPpkd-Bz112c-LgbsSe yHy1rc eT1oJ JsuyRc boDUxc")[1].getAttribute("aria-pressed") == "false") {
            try {
                document.getElementsByClassName("VfPpkd-Bz112c-LgbsSe yHy1rc eT1oJ JsuyRc boDUxc")[1].click()

            } catch (err) {
                console.log("Error New UI: " + err)
            }
        }
    } catch (err) {
        console.log("NOT New UI : " + err)
    }

    // console.log("Length : " + ListObj.length)


    waitForElement(function () {
        var ListObj = document.getElementsByClassName("ZjFb7c");
      
        var Attendees = [];

        //console.log(document.getElementsByClassName("titleColumn")[0].getElementsByTagName("a")[0].text);
        for (i = 0; i < ListObj.length; i++) {
            console.log(ListObj[i].innerText);
            Attendees.push(ListObj[i].innerText);
        }
        callBack1(Attendees);
        return Attendees;

    })




}