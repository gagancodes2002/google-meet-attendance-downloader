

const { Table, AlignmentType, Document, HeadingLevel, Packer, Paragraph, TextRun, ShadingType, UnderlineType } = docx;

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

            if (GlobalDataList) {
                GlobalDataList.forEach(function (item, n) {

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

            });
        })
        document.querySelector(`select[name="DateFormat"]`).addEventListener("change", function (event) {

            SetSavedDateFormat(event.target.selectedIndex);
        })

        var acc = document.getElementsByClassName("accordion");
        var i;

        for (i = 0; i < acc.length; i++) {
            acc[i].addEventListener("click", function () {


                var panel = document.getElementsByClassName("panel")[0];


                if (this.classList.contains("active")) {

                    document.querySelectorAll(".accordion:nth-child(1) > span")[0].style.cssText = " transform: rotate(0deg);"
                    document.querySelectorAll(".accordion:nth-child(1) > span")[1].style.cssText = " transform: rotate(0deg);"

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

    async function askForRemark(callback) {
        var modal = document.getElementById("askUser");
        var span = document.getElementsByClassName('close')[0];
        var submitBTN = document.getElementById('submitRemarks');
        submitBTN.addEventListener('click', () => {
            modal.style.display = "none";

            callback($('#remarks').val());
            return $('#remarks').val();
        })
        modal.style.display = "block";
        span.addEventListener('click', () => {
            modal.style.display = "none";
        })



    }

    function getSS() {
        html2canvas(document.getElementsByClassName("GvcuGe")[0], { useCORS: true }).then(function (canvas) {
            var myImage = canvas.toDataURL("image/png");
            window.open('', myImage);


        });
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

        txt = `Date :  ${FileNameStr.datebool}\nHost Name : ${FileNameStr.hostname}\nTime : ${FileNameStr.time}\nTotal Attendees : ${FileNameStr.attendeeslength}\nSubject : ${FileNameStr.filename}\n\nAttendees\n-----------\n`;
        FinalOutputList.forEach(function (row) {
            txt += row;
            txt += "\n";
        });
        downloadFile(FileNameStr, 'data:text/txt;charset=utf-8,' + encodeURI(txt));

    }



    function download_doc(FinalOutputList, FileNameStr) {

        function getCell(data, _heading) {
            return new Paragraph({

                text: data,
                heading: _heading,
            })
        };
        function getRowForHead(title, data) {
            return new docx.TableRow({
                children: [
                    new docx.TableCell({
                        width: {
                            size: 2500,
                            type: docx.WidthType.DXA,
                        },
                        children:
                            [
                                getCell(title, HeadingLevel.HEADING_2)
                            ]
                    })
                    ,
                    new docx.TableCell({
                        width: {
                            size: 2500,
                            type: docx.WidthType.DXA,
                        },
                        children:
                            [
                                getCell(data, HeadingLevel.HEADING_3)
                            ]
                    })
                ]
            })
        }


        const headRows = [getRowForHead('Subject', FileNameStr.filename),
        getRowForHead('Host Name', FileNameStr.hostname),
        getRowForHead('Time', FileNameStr.time),
        getRowForHead('Total Attendees', FileNameStr.attendeeslength),
        getRowForHead('Remark', FileNameStr.remarks),
        ]

        const headTable = new Table(
            {
                rows: headRows
            }
        )
        const rowsT = [new docx.TableRow({
            children: [
                new docx.TableCell({
                    width: {
                        size: 1500,
                        type: docx.WidthType.DXA,
                    },

                    children:
                        [
                            new Paragraph({
                                text: "Attendees",
                                heading: HeadingLevel.HEADING_4,
                                shading: {
                                    type: ShadingType.REVERSE_DIAGONAL_STRIPE,
                                    color: "c5e0b3",
                                    fill: "c5e0b3",
                                },
                            })
                        ]
                })
            ]
        })];
        FinalOutputList.map((item, k) => {
            rowsT.push(new docx.TableRow({
                children: [
                    new docx.TableCell({
                        width: {
                            size: 500,
                            type: docx.WidthType.DXA,
                        },
                        children:
                            [
                                getCell(item, HeadingLevel.HEADING_3)
                            ]
                    })
                ]
            }));
        })

        const table = new docx.Table({
            rows: rowsT


        });

        const doc = new docx.Document({
            styles: {
                paragraphStyles: [
                    {
                        id: "Heading1",
                        name: "Heading 1",
                        basedOn: "Normal",
                        next: "Normal",
                        quickFormat: true,
                        run: {
                            size: '24pt',
                            bold: true,
                            font:
                            {
                                name: 'Calibri'

                            }
                        },

                    },
                    {
                        id: "Heading2",
                        name: "Heading 2",
                        basedOn: "Normal",
                        next: "Normal",
                        quickFormat: true,
                        alignment: AlignmentType.LEFT,
                        run: {
                            size: '11pt',
                            bold: true,
                            font:
                            {
                                name: 'Calibri'

                            }
                        },

                    },
                    {
                        id: "Heading3",
                        name: "Heading 3",
                        basedOn: "Normal",
                        next: "Normal",
                        quickFormat: true,
                        alignment: AlignmentType.LEFT,
                        run: {
                            size: '11pt',
                            bold: false,
                            font:
                            {
                                name: 'Calibri'

                            }
                        },

                    },
                    {
                        id: "Heading4",
                        name: "Heading 4",
                        basedOn: "Normal",
                        next: "Normal",
                        alignment: AlignmentType.LEFT,
                        quickFormat: true,
                        run: {
                            size: '11pt',
                            bold: true,
                            font:
                            {
                                name: 'Calibri',
                                fill: "c5e0b3"
                            }
                        },

                    }
                ]
            },
            sections: [{
                properties: {},
                children: [

                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        text: "Meeting Attendance Sheet",
                        heading: HeadingLevel.HEADING_1,
                    }),
                    new Paragraph({
                        spacing: {
                            before: 400,
                        },
                    }),
                    headTable,
                    new Paragraph({
                        spacing: {
                            before: 200,
                        },
                    }),
                    table,
                ],
            }]
        });

        docx.Packer.toBlob(doc).then(blob => {

            var url = window.URL || window.webkitURL;
            var link = url.createObjectURL(blob);

            downloadFile(FileNameStr, link);
        });


    }

    function download_csv_file(csvFileData, FileNameStr) {

        function sheet_from_array_of_arrays(data, opts) {
            var ws = {};
            var range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } };
            for (var R = 0; R != data.length; ++R) {
                for (var C = 0; C != data[R].length; ++C) {
                    if (range.s.r > R) range.s.r = R;
                    if (range.s.c > C) range.s.c = C;
                    if (range.e.r < R) range.e.r = R;
                    if (range.e.c < C) range.e.c = C;
                    var cell = { v: data[R][C] };
                    if (cell.v == null) continue;
                    var cell_ref = XLSX.utils.encode_cell({ c: C, r: R });

                    if (typeof cell.v === 'number') cell.t = 'n';
                    else if (typeof cell.v === 'boolean') cell.t = 'b';
                    else if (cell.v instanceof Date) {
                        cell.t = 'n'; cell.z = XLSX.SSF._table[14];
                        cell.v = datenum(cell.v);
                    }
                    else cell.t = 's';

                    if (C == 0 & R == 0) {
                        cell.s =
                        {
                            font: {
                                name: 'Calibri',
                                bold: true,
                                sz: "24",
                                color:
                                    { rgb: 'f4f4ff' }
                            },
                            alignment:
                            {
                                horizontal: "center",

                                vertical: "center"

                            },
                            fill:
                            {
                                fgColor: { rgb: "212121" }
                            },

                        }
                    }
                    if ((C <= 12 & C >= 0) & (R <= 7 & R >= 3)) {
                        cell.s = {
                            fill:
                            {
                                fgColor: { rgb: "ebf1de" }
                            },
                        }
                    }
                    if ((C == 4 || C == 5 || C == 8 || C == 9) & (R >= 4 && R <= 6)) {
                        cell.s = {
                            fill:
                            {
                                fgColor: { rgb: "ffff99" }
                            },
                            border:
                            {
                                top: {
                                    style: 'thin'
                                },
                                right: {
                                    style: 'thin'
                                },
                                left: {
                                    style: 'thin'
                                },
                                bottom: {
                                    style: 'thin'
                                }


                            },
                            alignment: {
                                horizontal: 'left'
                            }
                        }
                    }
                    if (R == 8 & C == 0) {
                        cell.s =
                        {
                            fill:
                            {
                                fgColor: { rgb: 'c5d9f1' }
                            }
                        }
                    }


                    const merge = [
                        { s: { r: 0, c: 0 }, e: { r: 2, c: 12 } },
                        { s: { r: 4, c: 4 }, e: { r: 4, c: 5 } },
                        { s: { r: 5, c: 4 }, e: { r: 5, c: 5 } },
                        { s: { r: 6, c: 4 }, e: { r: 6, c: 5 } },
                        { s: { r: 4, c: 8 }, e: { r: 4, c: 9 } },
                        { s: { r: 5, c: 8 }, e: { r: 5, c: 9 } },
                        { s: { r: 6, c: 8 }, e: { r: 6, c: 9 } },


                    ];
                    ws["!merges"] = merge;
                    ws[cell_ref] = cell;
                }
            }
            if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
            return ws;
        }
        function Workbook() {
            if (!(this instanceof Workbook)) return new Workbook();
            this.SheetNames = [];
            this.Sheets = {};
        }
        function s2ab(s) {
            var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
            var view = new Uint8Array(buf);  //create uint8array as viewer
            for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
            return buf;
        }


        var data = [['Meeting Attendance Sheet', , ,],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",],
        ["", "", "", "Date : ", FileNameStr.datebool, "", "", "Time :", FileNameStr.time, "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "Subject : ", FileNameStr.filename, "", "", "Total Attendees :", FileNameStr.attendeeslength, "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "Host Name : ", FileNameStr.hostname, "", "", "Remark :", FileNameStr.remarks, "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",],
        ["Name", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",],
            // ["Subject", FileNameStr.filename, ,],
            // ["Hostname", FileNameStr.hostname ,,],
            // ["Total Attendees",12, ,],
            // ["Attendees",,,],

        ]

        csvFileData.map((item, k) => {
            data.push([item]);
        })

        var ws_name = "SheetJS";
        var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);

        /* add worksheet to workbook */
        wb.SheetNames.push(ws_name);
        wb.Sheets[ws_name] = ws;
        var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
        var blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
        var url = window.URL || window.webkitURL;
        var link = url.createObjectURL(blob);

        downloadFile(FileNameStr, link);

        //     var wb = XLSX.utils.book_new();
        //     wb.Props = {
        //         Title: FileNameStr.getFullFileName(),
        //         Subject: FileNameStr.subfilename,
        //         Author: FileNameStr.hostname,
        //         CreatedDate: FileNameStr.datebool
        // };
        // wb.SheetNames.push("Test Sheet");
        // var ws_data = [['hello' , 'world']];
        // var ws = XLSX.utils.aoa_to_sheet(ws_data);
        // wb.Sheets["Test Sheet"] = ws;
        // var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});
        // var blob = new Blob([s2ab(wbout)],{type:"application/octet-stream"});
        // var url = window.URL || window.webkitURL;
        // var link = url.createObjectURL(blob);
        // console.log('Link : '+link);
        // downloadFile(FileNameStr,link);

        // console.log(FileNameStr);
        // console.log('File name : '+FileNameStr.getFullFileName())
        //     var csv = `Date : , ${FileNameStr.datebool},\nHost Name : ,${FileNameStr.hostname},\nTotal Attendees : ,${csvFileData.length},\nSubject : ,${FileNameStr.filename},\nAttendees,\n`; 


        //     csvFileData.forEach(function (row) {

        //         csv += row;
        //         csv+= '\n';

        //     });








        // chrome.downloads.download({
        //     url:  'data:text/xlsx;charset=utf-8,' + encodeURI(csv),
        //     filename: filename,
        //     saveAs: false,
        //     conflictAction: "overwrite",
        //   });

    }

    function downloadFile(FileNameStr, url) {
        var filename = "GMA Downloader\\" + FileNameStr.filename + "\\" + FileNameStr.getFullFileName();
        chrome.downloads.download({
            url: url,
            filename: filename,
            saveAs: false,
            conflictAction: "overwrite",
        });
        Toast(FileNameStr);
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
        x.className = "show"; f =
            x.innerText += '\n' + FileNameStr.getFullFileName();
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);

    }


    document.addEventListener('DOMContentLoaded', async () => {
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
            var FileName = fileNameBoolean.checked ? document.getElementById('FileNames').value : "";
            var SubFileName = subFileNameBoolean.checked ? document.getElementById('subName').value : "";
            var DateBool = dateBoolean.checked ? todaysDate : "";

            var FileExt = document.getElementById("FileFormat");




            TextField = document.getElementById("TText");
            var FinalOutputList = TextField.value.split('\n');

            var AttendeesLength = FinalOutputList.length - 1;
            var today = new Date();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var FileNameStr = {
                filename: FileName,
                subfilename: SubFileName,
                datebool: DateBool,
                fileext: FileExt.value,
                hostname: FirstName,
                attendeeslength: AttendeesLength.toString(),
                time: time,
                getFullFileName: function () { return `${this.filename + this.subfilename + this.datebool + '.' + this.fileext}` }
            }

            switch (FileExt.value) {
                case "xlsx":
                    askForRemark((result) => {

                        FileNameStr.remarks = result;
                        download_csv_file(FinalOutputList, FileNameStr);
                    });

                    break;
                case "docx":
                    askForRemark((result) => {

                        FileNameStr.remarks = result;
                        download_doc(FinalOutputList, FileNameStr);
                    });

                    break;
                case "txt":
                    download_txt(FinalOutputList, FileNameStr);
                    break;
                default:

                    break;
            }



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
        var ssButton = document.getElementById("takeSS");
        ssButton.addEventListener("click", () => {
            console.log("clicked");
            port.postMessage({ joke: "take ss" });
        })
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

            var textArray = text.split("\n");
            textArray.sort();
            text = textArray.toString();

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

        
        port.onMessage.addListener( function (msg) {

            if (msg.request == "setList") {
                FirstName = msg.hostname;

                const TextField = document.getElementById("TText");
                TextField.innerText = "";
                for (i = 0; i < msg.data.length; i++) {
                    document.getElementById("TText").value += msg.data[i] + "\n";
                }



            }
            else if (msg.request == "ssPost") {


                console.log("ssPost received " + msg.data);

                

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


} catch (error) {
    console.log("Error : " + error)
}
