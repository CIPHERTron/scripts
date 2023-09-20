const epics = [
{
key: "ADOPT-1481",
fields: {
customfield_11029: "2023-08-26",
customfield_12048: {
value: "CustomerPaperworkPending"
},
customfield_10732: [
{value: "BairesDev"}
]
}
}
];

const groups = {
  "70": "",
  "60": "",
  "45": "",
  "40": "",
  "30": "",
  "15": "",
  "pastDueDate": ""
};

epics.forEach((epic) => {
    // const epic = JSON.parse(x);
    
  	function daysBetweenDates(dateString) {
      const [inputYear, inputMonth, inputDay] = dateString.split('-').map(Number);

      const currentDate = new Date();
      const inputDate = new Date(inputYear, inputMonth - 1, inputDay);

      const timeDifference = inputDate - currentDate;
      const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

      return daysDifference;
    }

    const customer = epic.fields.customfield_10732[0].value
    const key = epic.key;
    const epicUrl = ``;
    const renewalDate = epic.fields.customfield_11029;
    const renewalStatus = epic.fields.customfield_12048 ? epic.fields.customfield_12048.value : null;
    let alert = "";
    let updatedRenewalStatus = "";

    const daysToStatusMap = {
      "70": ["RenewalOutReachSent", "RenewalOutReachPending", "", null],
      "60": ["CustomerResponsePending", "RenewalOutReachSent", "RenewalOutReachPending", "", null],
      "45": ["UnofficialQuoteSent", "UnofficialQuotePending", "CustomerResponsePending", "RenewalOutReachSent", "RenewalOutReachPending", "", null],
      "40": ["CustomerAcceptPending", "UnofficialQuoteSent", "UnofficialQuotePending", "CustomerResponsePending", "RenewalOutReachSent", "RenewalOutReachPending", "", null],
      "30": ["CPQApprovalPending", "CustomerAcceptPending", "UnofficialQuoteSent", "UnofficialQuotePending", "CustomerResponsePending", "RenewalOutReachSent", "RenewalOutReachPending", "", null],
      "15": ["CustomerPaperworkPending", "CPQApprovalPending", "CustomerAcceptPending", "UnofficialQuoteSent", "UnofficialQuotePending", "CustomerResponsePending", "RenewalOutReachSent", "RenewalOutReachPending", "", null]
    };

    if(renewalDate && (customer !== "Harness/ Internal" || customer !== "Harness")) {
      const daysToRenewal = daysBetweenDates(renewalDate);

      if(!renewalStatus || renewalStatus === "" || renewalStatus === "Renewed") {
        updatedRenewalStatus = "RenewalOutreachPending";
      }

      if(daysToRenewal >= 0) {
        if(daysToRenewal > 70 && daysToRenewal <= 90) {
          alert = daysToStatusMap["70"].includes(renewalStatus) ? `${customer} is off-track!` : `${customer} is ahead of the track.`;
          
          if(alert !== "") {
          	groups['70'] += `\n\> <${epicUrl}|${customer}> \n\> _Renewal Date_: *${renewalDate}*, _Current Renewal Status_: *${renewalStatus}* \n\> _Alert_: \`${alert}\` \n`;
          }
        } else if(daysToRenewal > 60 && daysToRenewal <= 70) { 
          alert = daysToStatusMap["70"].includes(renewalStatus) ? `${customer} is off-track!` : `${customer} is ahead of the track.`;
          
          if(alert !== "") {
          	groups['70'] += `\n\> <${epicUrl}|${customer}> \n\> _Renewal Date_: *${renewalDate}*, _Current Renewal Status_: *${renewalStatus}* \n\> _Alert_: \`${alert}\` \n`;
          }
        } else if(daysToRenewal > 45 && daysToRenewal <= 60) {
          alert = daysToStatusMap["60"].includes(renewalStatus) ? `${customer} is off-track!` : `${customer} is ahead of the track.`;
          
          if(alert !== "") {
          	groups['60'] += `\n\> <${epicUrl}|${customer}> \n\> _Renewal Date_: *${renewalDate}*, _Current Renewal Status_: *${renewalStatus}* \n\> _Alert_: \`${alert}\` \n`;
          }
        } else if(daysToRenewal > 40 && daysToRenewal <= 45) {
          alert = daysToStatusMap["45"].includes(renewalStatus) ? `${customer} is off-track!` : `${customer} is ahead of the track.`;
          
          if(alert !== "") {
          	groups['45'] += `\n\> <${epicUrl}|${customer}> \n\> _Renewal Date_: *${renewalDate}*, _Current Renewal Status_: *${renewalStatus}* \n\> _Alert_: \`${alert}\` \n`;
          }
        } else if(daysToRenewal > 30 && daysToRenewal <= 40) {
          alert = daysToStatusMap["40"].includes(renewalStatus) ? `${customer} is off-track!` : `${customer} is ahead of the track.`;
          
          if(alert !== "") {
          	groups['40'] += `\n\> <${epicUrl}|${customer}> \n\> _Renewal Date_: *${renewalDate}*, _Current Renewal Status_: *${renewalStatus}* \n\> _Alert_: \`${alert}\` \n`;
          }
        } else if(daysToRenewal > 15 && daysToRenewal <= 30) {
          alert = daysToStatusMap["30"].includes(renewalStatus) ? `${customer} is off-track!` : `${customer} is ahead of the track.`;
          
          if(alert !== "") {
          	groups['30'] += `\n\> <${epicUrl}|${customer}> \n\> _Renewal Date_: *${renewalDate}*, _Current Renewal Status_: *${renewalStatus}* \n\> _Alert_: \`${alert}\` \n`;
          }
        } else if(daysToRenewal <= 15) {
          alert = daysToStatusMap["15"].includes(renewalStatus) ? `${customer} is off-track!` : `${customer} is ahead of the track.`;
          
          if(alert !== "") {
          	groups['15'] += `\n\> <${epicUrl}|${customer}> \n\> _Renewal Date_: *${renewalDate}*, _Current Renewal Status_: *${renewalStatus}* \n\> _Alert_: \`${alert}\` \n`;
          }
        }
      } 

      if(daysToRenewal < 0) {
            const modDays = Math.abs(daysToRenewal);
            alert = `${customer} is ${modDays} days past renewal!`;
        	groups['pastDueDate'] += `\n\> <${epicUrl}|${customer}> \n\> _Renewal Date_: *${renewalDate}*, _Current Renewal Status_: *${renewalStatus}* \n\> _Alert_: \`${alert}\` \n`;
      }
    }
  });
  
  let group70 = `${groups["70"] !== "" ? `- _70 days to renewal_: [Expected Renewal Status : *CustomerResponsePending*]` : null} \n ${groups["70"] !== "" ? groups["70"] : null}`;
  let group60 = `${groups["60"] !== "" ? `- _60 days to renewal_: [Expected Renewal Status : *CustomerMeetingPending*]` : null} \n ${groups["60"] !== "" ? groups["60"] : null}`;
  let group45 = `${groups["45"] !== "" ? `- _45 days to renewal_: [Expected Renewal Status : *CustomerAcceptPending*]` : null} \n ${groups["45"] !== "" ? groups["45"] : null}`;
  let group40 = `${groups["40"] !== "" ? `- _40 days to renewal_: [Expected Renewal Status : *CPQApprovalPending*]` : null} \n ${groups["40"] !== "" ? groups["40"] : null}`;
  let group30 = `${groups["30"] !== "" ? `- _30 days to renewal_: [Expected Renewal Status : *CustomerPaperworkPending*]` : null} \n ${groups["30"] !== "" ? groups["30"] : null}`;
  let group15 = `${groups["15"] !== "" ? `- _15 days to renewal_: [Expected Renewal Status : *HarnessSignaturePending*]` : null} \n ${groups["15"] !== "" ? groups["15"] : null}`;
  let groupPastDueDate = `${groups["pastDueDate"] !== "" ? `- _Renewal Past Due Date_: [Expected Renewal Status : *RenewalOutReachPending*]` : null} \n ${groups["pastDueDate"] !== "" ? groups["pastDueDate"] : null}`;

  console.log(`*LICENSE RENEWAL ALERTS* \n ${group70} \n ${group60} \n ${group45} \n ${group40} \n ${group30} \n ${group15} \n ${groupPastDueDate} \n`);
