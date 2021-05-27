<script>
    var reqInfo = {};
      var valMessage = 
      {        
            fn: "First Name is Required",
            ln: "Last Name is Required",
            sDate: "Leave Start Date is Required",
            eDate: "Leave End Date is Required",
            leaveType: "Leave Type is Required"
        };


    document.addEventListener('DOMContentLoaded', function() {
        var elems = document.querySelectorAll('select');
        var instances = M.FormSelect.init(elems);
    });

    document.addEventListener('DOMContentLoaded', function() 
    {
      var options = 
      {        
            setDefaultDate: true,
            autoClose : true,
            showClearBtn: true,
            format : 'dd/mm/yyyy',
            defaultDate : new Date()
        };
      var elems = document.querySelectorAll('.datepicker');
      var instances = M.Datepicker.init(elems, options);

    });


document.getElementById("btn").addEventListener("click",btnSubmit);


function btnSubmit(){
   //Assign values to Array from Page
  reqInfo = { 
  fn : document.getElementById("fn").value,
  ln : document.getElementById("ln").value,
  leaveType : document.getElementById("leaveType").value,
  sDate : document.getElementById("sDate").value,
  eDate : document.getElementById("eDate").value,
  comments : document.getElementById("comments").value
  }

  var idKeys = Object.keys(valMessage);
  var allValid = true;
  
  //Validate the Values and Add record if Valid
  for( var i = 0; i < idKeys.length; i++ ) {  
    if (!isEleValid(idKeys[i],reqInfo[idKeys[i]],valMessage[idKeys[i]])) {
      allValid = false;
    }
  }
  if (allValid) {
    if (isValidDateRange(reqInfo["sDate"],reqInfo["eDate"])) {
      addRecord();
      M.toast({html: 'Request Submitted!'});
    }
    else {
      M.toast({html: 'Leave Start Date must be less than or equal to End Date'});
    }
  } 

}

//function to check value is entered for Elements if not flast a message
function isEleValid(eleId,val, message) {
  if (val === "") {
    M.toast({html: message});
    return false;
  } 

  if ((eleId === "sDate" || eleId === "eDate") && !isValidDate(val)) {
    M.toast({html: 'Invalid date value'});
    return false;
  } 

  return true;  
}

//Function to check date range
function isValidDateRange(sDateStr,eDateStr)
{
  var temp1 = sDateStr.split('/');
  // month is 0-based, that's why we need dataParts[1] - 1
  var sDate = new Date(temp1[2], temp1[1] - 1, temp1[0]); 

  temp1 = eDateStr.split('/');
  var eDate = new Date(temp1[2], temp1[1] - 1, temp1[0]); 

  return (sDate <= eDate);
  
}


//function to validate date fields
function isValidDate(dateString)
{
    // First check for the pattern
    if(!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString))
        return false;

    // Parse the date parts to integers DD/MM/YYYY
    var parts = dateString.split("/");
    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10);
    var year = parseInt(parts[2], 10);

    // Check the ranges of month and year
    if(year < 1000 || year > 3000 || month == 0 || month > 12)
        return false;

    var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

    // Adjust for leap years
    if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
        monthLength[1] = 29;

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
};

//Add record to Google Sheet and Clear the fields
function addRecord() {
    //Call code.js function to feed into google sheet
    google.script.run.addReq(reqInfo);

    //After feeding into google sheet empty the page fileds
    document.getElementById("fn").value = "";
    document.getElementById("ln").value = "";
    document.getElementById("sDate").value = "";
    document.getElementById("eDate").value = "";
    document.getElementById("leaveType").value = "";
    document.getElementById("comments").value = "";

}

</script>
