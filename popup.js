

function Popup() {
    $(document).ready(function () {
        $('[data-toggle="popover"]').popover({
            placement: 'bottom',
            trigger: 'hover'

        });

    });

}



function Toast(FileNameStr) {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar");
     
    // Add the "show" class to DIV
    x.className = "show";
    x.innerText = FileNameStr;
    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  }



async function CheckMeet() {

    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];
    const CheckGoogleMeet = `(${isGoogleMeetOpen})()`;
    // Run the script in the context of the tab
    const OP = await chrome.tabs.executeScript(tab.id, { code: CheckGoogleMeet });
    if (!OP[0]) {
        document.getElementById("indicator").style.backgroundColor = "red";
        document.getElementById("indicator").title = "Turn on your meeting!";
    }
    else {
        document.getElementById("indicator").style.backgroundColor = "green";
        document.getElementById("indicator").title = "Your meeting is On!";
        const CheckParticipant = `(${isPListOpen})()`;
        const ParticipantBool = await chrome.tabs.executeScript(tab.id, { code: CheckParticipant });
        if (!ParticipantBool[0]) {
            document.getElementById("indicatorShowList").title = "Open the meeting details First!";
            document.getElementById("indicatorShowList").style.backgroundColor = "red";


        }
        else {

            document.getElementById("indicatorShowList").style.backgroundColor = "green";
            document.getElementById("indicatorShowList").title = "Click on Get Attendance!";

        }


    }


};


window.onload = function () {

    CheckMeet();
    Popup();
    Popup2();

}






document.addEventListener('DOMContentLoaded', () => {
    const OrderButton = document.querySelector('#alpha_order');
    OrderButton.addEventListener('click', async () => {
        TextField = document.getElementById("TText");
        var text = TextField.value;
        //    var text = text.substring(0,text.length-1);
        var textArray = text.split("\n");
        textArray.sort();
        text = textArray.toString();
        //    for(i = 0 ; i<text.length;i++)
        //    {
        //        if (text[i]==",")
        //        {
        //            text[i] = "\n"

        //        }
        //    }
        text = text.replace(/,/g, "\n");
        for (i = 0; i < text.length; i++) {
            if (text[i] == "\n") {
                if (/^[a-zA-Z0-9]+$/.test(text[i + 1])) {
                    text = text.substring(i + 1, text.length);
                    break;
                }

            }
        }
      
        TextField.value = text;
    });
});



function isGoogleMeetOpen() {
    var UrlStr = window.location.href;

    if (UrlStr.search("meet.google.com") >= 0) {
        return true;
    }
    else {
        return false;
    }
}
function isPListOpen() {
    var PLName = document.getElementsByClassName("ZjFb7c");
    return PLName[0].innerText;
}






function scrapeThePage() {
    // Keep this function isolated - it can only call methods you set up in content scripts
    MovieList = document.getElementsByClassName("ZjFb7c");
    var Attendees = [];
    console.log(MovieList)
    //console.log(document.getElementsByClassName("titleColumn")[0].getElementsByTagName("a")[0].text);
    for (i = 0; i < MovieList.length; i++) {
        console.log(MovieList[i].innerText);
        Attendees.push(MovieList[i].innerText);
    }

    return Attendees;
}


function SetClipboard() {
    TextField = document.getElementById("TText");
    TextField.focus();
    TextField.select();
    document.execCommand("copy");

}

function download_txt(FinalOutputList, FileNameStr) {
    var body = document.getElementsByTagName("body")[0];
    txt = "";
    FinalOutputList.forEach(function (row) {
        txt += row;
        txt += "\n";
    });

    var hiddenElement = document.createElement('a');
    hiddenElement.style.display = "none";
    hiddenElement.innerText = FileNameStr;
    hiddenElement.href = 'data:text/txt;charset=utf-8,' + encodeURI(txt);
    hiddenElement.target = '_blank';
    hiddenElement.download = FileNameStr;
    body.append(hiddenElement);
    hiddenElement.click();   
}



function download_doc(FinalOutputList, FileNameStr) {
    var body = document.getElementsByTagName("body")[0];
    docx = "";
    FinalOutputList.forEach(function (row) {
        docx += row;
        docx += "\n";
    });

    var hiddenElement = document.createElement('a');
    hiddenElement.style.display = "none";
    hiddenElement.innerText = FileNameStr;
    hiddenElement.href = 'data:text/docx;charset=utf-8,' + encodeURI(docx);
    hiddenElement.target = '_blank';
    hiddenElement.download = FileNameStr;
    body.append(hiddenElement);
    hiddenElement.click();   
}



function download_csv_file(csvFileData, FileNameStr) {
    //define the heading for each row of the data  
    var csv = "";

    //merge the data with CSV  
    csvFileData.forEach(function (row) {
        csv += row;
        csv += "\n";
    });

    //display the created CSV data on the web browser   
    //  document.write(csv);  

    var body = document.getElementsByTagName("body")[0];

    var hiddenElement = document.createElement('a');
    hiddenElement.style.display = "none";
    hiddenElement.innerText = FileNameStr;
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.style.display = "none";
    hiddenElement.download = FileNameStr;
    body.append(hiddenElement);
    hiddenElement.click();      
}


document.addEventListener('DOMContentLoaded', () => {
    const Clip = document.querySelector('#copy');
    Clip.addEventListener('click', async () => {
        SetClipboard();


    });
});

document.addEventListener('DOMContentLoaded', () => {
    const Clip = document.querySelector('#clear');
    Clip.addEventListener('click', async () => {
        document.getElementById("TText").value = "";


    });
});

document.addEventListener('DOMContentLoaded', () => {
    const Clip = document.querySelector('#exclude');
    Clip.addEventListener('click', async () => {
        var List = document.getElementById("TText").value.split("\n");
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        const tab = tabs[0];
        const GetOP = `(${scrapeThePage})()`;
        const OP = await chrome.tabs.executeScript(tab.id, { code: GetOP });
        var FirstName = OP[0][0];
  
        for (i = 0; i < List.length; i++) {
            if (List[i] == FirstName) {
                List[i] = ""
            }
        }

        TextField = document.getElementById("TText");
        text = List.toString();
        //    text  =  text.substring(1,text.length-1);
        text = text.replace(/,/g, "\n");
        TextField.value = text;


    });
});








document.addEventListener('DOMContentLoaded', () => {
    const Clip = document.querySelector('#check-2');
    Clip.addEventListener('click', async () => {
        var FileNameStr = ""
        var Filename = document.getElementById("FileName");
        var d = new Date();
        var todaysDate = (d.getDate()) + "-" + (d.getMonth()) + "-" + (d.getFullYear());
        var x = document.getElementById('DateBoolean');
        DateBool = "";
        var FileExt = document.getElementById("FileFormat");
        if (x.checked) {
            DateBool = todaysDate;
        }
             FileNameStr = Filename.value + DateBool + "." + FileExt.value;
        TextField = document.getElementById("TText");
        var FinalOutputList = TextField.value.split('\n');



        switch (FileExt.value) {
            case "csv":
                download_csv_file(FinalOutputList, FileNameStr);
                break;
            case "docx":
                download_doc(FinalOutputList, FileNameStr);
                break;
            case "txt":
                download_txt(FinalOutputList, FileNameStr);
                break;
            default:

                break;
        }
        Toast(FileNameStr);


    });
});

// document.addEventListener('DOMContentLoaded', () => {
//     const Clip = document.querySelector('#check-3');
//     Clip.addEventListener('click', async () => {

//         download_csv_file(AttendeesList);
//             // TextField = document.getElementById("TText");
//             // TextField.focus();
//             // TextField.select();
//             // document.execCommand("copy");
//         });
//     });









document.addEventListener('DOMContentLoaded', () => {
    // Hook up #check-1 button in popup.html
    const fbshare = document.querySelector('#check-1');
    fbshare.addEventListener('click', async () => {
        // Get the active tab
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        const tab = tabs[0];
        const CheckMeetingDetails = `(${isPListOpen})()`;

        // Run the script in the context of the tab
        const OP = await chrome.tabs.executeScript(tab.id, { code: CheckMeetingDetails });
        if (!OP[0]) {
            alert("Open Meeting Details First ! ");


        }
        const scriptToExec = `(${scrapeThePage})()`;

        // Run the script in the context of the tab
        const scraped = await chrome.tabs.executeScript(tab.id, { code: scriptToExec });

        // Result will be an array of values from the execution
        // For testing this will be the same as the console output if you ran scriptToExec in the console
      
        const TextField = document.getElementById("TText");

        TextField.innerText = "";
        for (i = 0; i < scraped[0].length; i++) {
            document.getElementById("TText").value += scraped[0][i] + "\n";
        }


        // NumOfAttendees.id = "NOfAtt";
        // NumOfAttendees.innerText = "Participants : " + scraped[0].length;

        // var x = document.getElementById('DateBoolean');
        // alert(x.checked);
        AttendeesList = scraped[0];
        console.log("clicked");
    });
});