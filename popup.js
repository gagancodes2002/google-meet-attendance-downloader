var FirstName = '';
try {
    
    chrome.runtime.onInstalled.addListener(reason => {
        if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
            chrome.runtime.setUninstallURL('https://forms.gle/oqDNuUZ5QyCKcKPh7');
        }
    });
    var GlobalDataList = [];
    var GlobalSDF;
    function UpdateList() {

        var listData = [];
        var list = document.getElementById("list");
        var listItems = list.querySelectorAll("li")
        listItems.forEach(function (item, n) {
            if (!item.getAttribute("data-new")) {
               
                listData.push(item.innerText);
            }

        })
        chrome.storage.local.set({ FileNameList: listData }, function () {
            
        });

    }


    async function GetData(callback) {

        await chrome.storage.local.get(['FileNameList'], async function (result) {
          
            GlobalDataList = result.FileNameList;

        });
      
        callback();


    }

    async function PopulateList(callback) {
        var list = document.getElementById("list");

        //     list.innerHTML += ` <li data-new="true">
        //     <span>add another</span>
        //     <input type="text">
        //     </li>
        // `;
        await chrome.storage.local.get(['FileNameList'], async function (result) {
            if (result.FileNameList) {
                result.FileNameList.forEach(function (elem, k) {
                    var entry = document.createElement("li");
                    entry.className = "";
                    entry.innerHTML = `
                    <span>${elem}</span>
                    <input type="text"  value=${elem}>
                   `;
                    list.appendChild(entry);
                })
               
            }
            else {
          
                
            }

        });
       
        
        $("#list").append(` <li data-new="true">
         <span>add another</span>
         <input type="text">
         </li>
     `);
        callback();
    }

    function editItem(eventInput, object) {
        if (!object) object = this;
        object.className = "edit";
        var inputField = object.querySelector("input");
        inputField.focus();
        inputField.setSelectionRange(0, inputField.value.length);
        UpdateList()
    }

    function blurInput(event) {
        this.parentNode.className = "";

        if (this.value == "") {
            if (this.parentNode.getAttribute("data-new")) addChild();
            list.removeChild(this.parentNode);

        } else {
            this.previousElementSibling.innerHTML = this.value;

            if (this.parentNode.getAttribute("data-new")) {
                this.parentNode.removeAttribute("data-new");
                addChild();
            }

        }
        UpdateList()

    }

    function keyInput(event) {
        if (event.which == 13 || event.which == 9) {
            event.preventDefault();
            this.blur();

            if (!this.parentNode.getAttribute("data-new")) {
                editItem(null, this.parentNode.nextElementSibling);
            }

        }
        UpdateList()
    }

    function setEventListener(listItem, input) {
        listItem.addEventListener("click", editItem);
        input.addEventListener("blur", blurInput);
        input.addEventListener("keydown", keyInput);
    }

    function addChild() {
     
        
        UpdateList()
        var entry = document.createElement('li');
        entry.innerHTML = "<span>add another</span><input type='text'>";
        entry.setAttribute("data-new", true);
        list.appendChild(entry);
        setEventListener(entry, entry.lastChild);
    }
    function PopulateDataList() {
        $("#FileNames").html("");
        GetData(function () {
            console.log("Callback Home 2" + GlobalDataList)
            if (GlobalDataList) {
                GlobalDataList.forEach(function (item, n) {
                    console.log('Inside WOrk : '+item);
                    $('#FileNames').append(`<option value="${item}" class="Options">${item}</option>`)
                });
            }
            else {
                console.log("Set File Names")
            }

        });


    }


    async function GetSavedDateFormat(callback) {
        await chrome.storage.local.get(['SavedDateType'], async function (result) {
     
            
            if (result.SavedDateType) {
                GlobalSDF = result.SavedDateType;

            }
            else {

                GlobalSDF = 0;
            }

        });
        callback(GlobalSDF);
        return GlobalSDF;
    }

    function SetDefaultDateFormat() {
        GetSavedDateFormat(function (defSelection) {
            document.querySelectorAll("select[name='DateFormat'] > option")[defSelection].defaultSelected = true;
            document.querySelectorAll("select[name='DateFormatHome'] > option")[defSelection].defaultSelected = true;
        })
    }


    async function SetSavedDateFormat(selection) {
     
        
        await chrome.storage.local.set({ SavedDateType: selection }, function () {
      
            
        });
    }
    document.addEventListener("DOMContentLoaded", () => {



        SetDefaultDateFormat()
        PopulateDataList()

        PopulateList(function () {

            console.log(" Callback : 2")
            var list = document.getElementById("list");
            var listItems = list.querySelectorAll("li");
            var inputs = list.querySelectorAll("input");

            for (var i = 0; i < listItems.length; i++) {
                setEventListener(listItems[i], inputs[i]);
            }


            // chrome.storage.local.get({"FileNameList": listData}, function() {
            //     console.log('Value is set to ' + listData);
            //   });
            chrome.storage.local.get(['FileNameList'], function (result) {
                console.log('Value currently is ' + result.FileNameList);
            });
        })
        document.querySelector(`select[name="DateFormat"]`).addEventListener("change", function (event) {
            console.log(event.target.selectedIndex)
            SetSavedDateFormat(event.target.selectedIndex);
        })

        var acc = document.getElementsByClassName("accordion");
        var i;

        for (i = 0; i < acc.length; i++) {
            acc[i].addEventListener("click", function () {


                var panel = document.getElementsByClassName("panel")[0];
                console.log("This : " + this.classList)

                if (this.classList.contains("active")) {

                    document.querySelectorAll(".accordion:nth-child(1) > span")[0].style.cssText = " transform: rotate(0deg);"
                    document.querySelectorAll(".accordion:nth-child(1) > span")[1].style.cssText = " transform: rotate(0deg);"
                    console.log("Rotate : " + document.querySelectorAll(".accordion:nth-child(1) > span")[1].style.cssText)
                    this.classList.toggle("active");
                }
                else {

                    document.querySelectorAll(".accordion:nth-child(1) > span")[0].style.cssText = " transform: rotate(90deg);"
                    document.querySelectorAll(".accordion:nth-child(1) > span")[1].style.cssText = " transform: rotate(180deg);"
                    this.classList.toggle("active");
                }
                if (panel.style.display === "block") {
                    panel.style.display = "none";
                } else {
                    panel.style.display = "block";
                }
            });
        }






    })
    document.addEventListener("DOMContentLoaded", () => {

        document.getElementById("SubHead").addEventListener("click", () => {

            openNav()
            document.getElementById("overlay").style.display = "block";
        })
        document.getElementsByClassName("closebtn")[0].addEventListener("click", () => {
            document.getElementById("overlay").style.display = "none";
            closeNav()

        })
    })

    function ResetSettingsView() {
        var acc = document.getElementsByClassName("accordion");
        var i;

        for (i = 0; i < acc.length; i++) {
            if (acc[i].classList.contains("active"))
                acc[i].click();
        }





    }

    document.addEventListener('DOMContentLoaded', () => {
        document.getElementById("SettingBTN").addEventListener("click", () => {
            window.open(document.URL + "#Settings", "_self")
            document.getElementById("Home").style.display = "none"
            document.getElementById("Settings").style.display = "block";
            document.getElementById("overlay").style.display = "none";
            var HeadView = document.getElementById("header")

            HeadView.classList.toggle("HeadView");
            HeadView.innerText = "Settings";

            closeNav()


        })
        document.getElementById("HomeBTN").addEventListener("click", () => {
            //  $("#Home").load(location.href + " #Home");
            window.open(document.URL, "_self")
            PopulateDataList()
            document.getElementById("Settings").style.display = "none";
            document.getElementById("Home").style.display = "block"
            var HeadView = document.getElementById("header")
            HeadView.innerText = "Home";
            HeadView.classList.toggle("HeadView");


            ResetSettingsView()


        })
        document.getElementById("overlay").addEventListener("click", () => {
            document.getElementById("overlay").style.display = "none";
            closeNav()
        })


    });










    function scrapeThePage() {
        // Keep this function isolated - it can only call methods you set up in content scripts
        MovieList = document.getElementsByClassName("ZjFb7c");
        var Attendees = [];
    
        //console.log(document.getElementsByClassName("titleColumn")[0].getElementsByTagName("a")[0].text);
        for (i = 0; i < MovieList.length; i++) {
          
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
        downloadFile(FileNameStr,'data:text/txt;charset=utf-8,' + encodeURI(txt));
        
    }



    function download_doc(FinalOutputList, FileNameStr) {
        var body = document.getElementsByTagName("body")[0];
        docx = "";
        FinalOutputList.forEach(function (row) {
            docx += row;
            docx += "\n";
        });
        downloadFile(FileNameStr,'data:text/docx;charset=utf-8,' + encodeURI(docx));
        
    }



    function download_csv_file(csvFileData, FileNameStr) {
        
        console.log(FileNameStr);
        console.log('File name : '+FileNameStr.getFullFileName())
            var csv = `Date : , ${FileNameStr.datebool},\nHost Name : ,${FileNameStr.hostname},\nTotal Attendees : ,${csvFileData.length},\nSubject : ,${FileNameStr.filename},\nAttendees,\n`; 
            
        
            csvFileData.forEach(function (row) {
                
                csv += row;
                csv+= '\n';
                 
            });
            downloadFile(FileNameStr,'data:text/xlsx;charset=utf-8,' + encodeURI(csv))
       

      
        
        

        // chrome.downloads.download({
        //     url:  'data:text/xlsx;charset=utf-8,' + encodeURI(csv),
        //     filename: filename,
        //     saveAs: false,
        //     conflictAction: "overwrite",
        //   });
        
    }

    function downloadFile(FileNameStr,url)
    {
        var filename = "GMA Downloader\\"+FileNameStr.filename+"\\" + FileNameStr.getFullFileName();
        chrome.downloads.download({
            url:  url,
            filename: filename,
            saveAs: false,
            conflictAction: "overwrite",
          });
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







    function Toast(FileNameStr) {

        var x = document.getElementById("snackbar");
        x.className = "show";f=
        x.innerText += '\n'+FileNameStr.getFullFileName();
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);

    }


    document.addEventListener('DOMContentLoaded', () => {
        const Clip = document.querySelector('#check-2');
        Clip.addEventListener('click', async () => {
            
            var Filename = document.getElementById("FileNames");
            var d = new Date();
            var todaysDate;
            var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];  
            switch (GlobalSDF) {
                case 0:
                    todaysDate = ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + (d.getDate())).slice(-2) + "-" + (d.getFullYear());
                    break;
                case 1:
                    todaysDate = ("0" + (d.getDate())).slice(-2) + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + (d.getFullYear());
                    break;
                case 2:
                    todaysDate = (months[d.getMonth()]) + "-" + ("0" + (d.getDate())).slice(-2) + "-" + (d.getFullYear());
                    break;

                default:
                    break;
            }
            var fileNameBoolean = document.getElementById('FilenameBoolean');
            var subFileNameBoolean = document.getElementById('SubFilenameBoolean');
            var dateBoolean = document.getElementById('DateBoolean');
            var FileName =  fileNameBoolean.checked ? document.getElementById('FileNames').value : "";
            var SubFileName =  subFileNameBoolean.checked ? document.getElementById('subName').value :"";
            var DateBool = dateBoolean.checked ? todaysDate :"";
            
            var FileExt = document.getElementById("FileFormat");
            var FileNameStr = {
                filename :  FileName,
                subfilename : SubFileName,
                datebool : DateBool,
                fileext : FileExt.value,
                hostname : FirstName,
                getFullFileName : function(){return `${this.filename+this.subfilename+this.datebool+'.'+this.fileext}`}
            }


          
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

    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        var activeTab = tabs[0];
        try {
            var port = chrome.tabs.connect(activeTab.id, { name: "knockknock" });
        }
        catch (error) {
            console.log("Content script setup required")
        }
        var GetAttendanceBTN = document.getElementById("check-1");
        GetAttendanceBTN.addEventListener("click", function () {
            port.postMessage({ joke: "Knock knock" });
            

        })

        const Clip = document.getElementById('exclude');
        Clip.addEventListener('click', async () => {
          
            port.postMessage({ joke: "exclude" });



        });

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
       
        
        port.onMessage.addListener(function (msg) {
          
            if (msg.request == "setList") {
                FirstName = msg.hostname;
                console.log("Presenter : "+FirstName);
                const TextField = document.getElementById("TText");
                TextField.innerText = "";
                for (i = 0; i < msg.data.length; i++) {
                    document.getElementById("TText").value += msg.data[i] + "\n";
                }


                // port.postMessage({ answer: "Madame" });
            }
            else if (msg.request == "ssPost") {
               
                // window.open(msg.data);

                var downloadDiv = document.createElement("div");
                downloadDiv.innerHTML = `<a
                style = "display : none" 
                                            id="ssBTN"
                                           href="${msg.data}"
                                            target="_blank"
                                            download="SS.png"
                                            ></a>`;
                document.body.append(downloadDiv);
                document.getElementById("ssBTN").click();
            }
            else if (msg.request == 'excludePresenter') {
              
                var List = document.getElementById("TText").value.split("\n");
           
                FirstName = msg.data;
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
            }

        });
    });

    function openNav() {
        document.getElementById("mySidenav").style.width = "250px";
    }

    function closeNav() {
        document.getElementById("mySidenav").style.width = "0";
    }

    // var port = chrome.tabs[0].connect({name: "knockknock"});
    // port.postMessage({joke: "Knock knock"});
    // port.onMessage.addListener(function(msg) {
    //   if (msg.question == "Who's there?")
    //     port.postMessage({answer: "Madame"});
    //   else if (msg.question == "Madame who?")
    //     port.postMessage({answer: "Madame... Bovary"});
    // });  
} catch (error) {
    console.log("Error : " + error)
}
