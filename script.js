const connToken = "90934565|-31949212832317454|90956557";
const dbName = "DELIVERY-DB";
const relName = "SHIPMENT-TABLE";
const jpdbBaseURL = "http://api.login2explore.com:5577";
const jpdbIML = "/api/iml";
const jpdbIRL = "/api/irl";

$("#shipmentNo").focus();

function saveData() {
  let jsonStrObj = validateAndGetFormData();
  if (jsonStrObj === "") return;

  let putRequest = createPUTRequest(connToken, jsonStrObj, dbName, relName);
  jQuery.ajaxSetup({ async: false });
  executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
  jQuery.ajaxSetup({ async: true });

  alert("Record Saved Successfully!");
  resetForm();
}

function updateData() {
  let jsonStrObj = validateAndGetFormData();
  if (jsonStrObj === "") return;

  let recNo = localStorage.getItem("recno");
  if (recNo == null) {
    alert("Record not found in localStorage.");
    return;
  }

  let updateRequest = createUPDATERecordRequest(
    connToken,
    jsonStrObj,
    dbName,
    relName,
    recNo
  );
  jQuery.ajaxSetup({ async: false });
  executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
  jQuery.ajaxSetup({ async: true });

  alert("Record Updated Successfully!");
  resetForm();
}

function getShipment() {
  let shipmentNoVal = $("#shipmentNo").val();
  if (shipmentNoVal === "") {
    resetForm();
    return;
  }

  let jsonObj = { shipmentNo: shipmentNoVal };

  let getRequest = createGET_BY_KEYRequest(
    connToken,
    dbName,
    relName,
    JSON.stringify(jsonObj)
  );
  jQuery.ajaxSetup({ async: false });
  let resultObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
  jQuery.ajaxSetup({ async: true });

  if (resultObj.status === 400) {
    $("#save").prop("disabled", false);
    $("#reset").prop("disabled", false);
    enableFields();
    $("#description").focus();
  } else if (resultObj.status === 200) {
    $("#shipmentNo").prop("disabled", true);
    fillData(resultObj);
    $("#update").prop("disabled", false);
    $("#reset").prop("disabled", false);
    enableFields();
    $("#description").focus();
  }
}

function fillData(resultObj) {
  let data = JSON.parse(resultObj.data).record;

  localStorage.setItem("recno", data.rec_no);
  console.log("Record number stored: " + data.rec_no);

  $("#description").val(data.description || "");
  $("#source").val(data.source || "");
  $("#destination").val(data.destination || "");
  $("#shippingDate").val(data.shippingDate || "");
  $("#expectedDeliveryDate").val(data.expectedDeliveryDate || "");
}

function validateAndGetFormData() {
  let shipmentNo = $("#shipmentNo").val();
  let description = $("#description").val();
  let source = $("#source").val();
  let destination = $("#destination").val();
  let shippingDate = $("#shippingDate").val();
  let expectedDeliveryDate = $("#expectedDeliveryDate").val();

  if (shipmentNo === "") {
    alert("Shipment No is required!");
    $("#shipmentNo").focus();
    return "";
  }
  if (description === "") {
    alert("Description is required!");
    $("#description").focus();
    return "";
  }
  if (source === "") {
    alert("Source is required!");
    $("#source").focus();
    return "";
  }
  if (destination === "") {
    alert("Destination is required!");
    $("#destination").focus();
    return "";
  }
  if (shippingDate === "") {
    alert("Shipping Date is required!");
    $("#shippingDate").focus();
    return "";
  }
  if (expectedDeliveryDate === "") {
    alert("Expected Delivery Date is required!");
    $("#expectedDeliveryDate").focus();
    return "";
  }

  let jsonStrObj = {
    shipmentNo,
    description,
    source,
    destination,
    shippingDate,
    expectedDeliveryDate,
  };

  return JSON.stringify(jsonStrObj);
}

function resetForm() {
  $("#shipmentNo").val("");
  $("#description").val("");
  $("#source").val("");
  $("#destination").val("");
  $("#shippingDate").val("");
  $("#expectedDeliveryDate").val("");

  $("#shipmentNo").prop("disabled", false);
  disableFields();

  $("#save").prop("disabled", true);
  $("#update").prop("disabled", true);
  $("#reset").prop("disabled", true);

  $("#shipmentNo").focus();
}

function enableFields() {
  $("#description").prop("disabled", false);
  $("#source").prop("disabled", false);
  $("#destination").prop("disabled", false);
  $("#shippingDate").prop("disabled", false);
  $("#expectedDeliveryDate").prop("disabled", false);
}

function disableFields() {
  $("#description").prop("disabled", true);
  $("#source").prop("disabled", true);
  $("#destination").prop("disabled", true);
  $("#shippingDate").prop("disabled", true);
  $("#expectedDeliveryDate").prop("disabled", true);
}
