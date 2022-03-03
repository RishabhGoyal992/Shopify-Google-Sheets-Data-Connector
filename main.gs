function myFunction() {

    const { dataSheet, configSheet } = getSheets();

    const accessToken = getToken(configSheet);

    const { URL, lastRow } = getUrl(dataSheet);

    const json_response = fetchResponse(URL, accessToken);

    const columns = populateColumnHeaders(json_response, lastRow, dataSheet);

    populateNewData(json_response, columns, lastRow, dataSheet);

}

const getSheets = () => {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  const dataSheet = activeSpreadsheet.getSheetByName("Data")
  if(dataSheet == null) {
    dataSheet = activeSpreadsheet.insertSheet();
    dataSheet.setName("Data");
  }

  const configSheet = activeSpreadsheet.getSheetByName("Configurations")
  if(configSheet == null) {
    configSheet = activeSpreadsheet.insertSheet();
    configSheet.setName("Configurations");
    const cell = configSheet.getRange(1,1); 
    cell.setValue("Shopify-Access-Token")
  }

  return { dataSheet, configSheet }
}

const getToken = (configSheet) => {
  // take care of blank access token
  const keyCell = configSheet.getRange(1,2)
  const accessToken = keyCell.getValue() //add accessToken null check
  return accessToken
}

const getUrl = (dataSheet) => {
  let URL = "https://dev-amigo.myshopify.com/admin/api/2022-01/orders.json?status=any"

  // To check last order data i present
  const lastRow = dataSheet.getLastRow();
  let lastId;
  if (lastRow) {
    const lastCol = dataSheet.getLastColumn();
    for (let i = 1; i <= lastCol; i++) {
      if (dataSheet.getRange(1, i).getValue().includes("id")) {
        lastId = dataSheet.getRange(lastRow, i).getValue();
        URL += `&since_id=${lastId}`;
        break;
      }
    }
  }

  return { URL, lastRow }
}

const fetchResponse = (URL, accessToken) => {
  const header = {
    "X-Shopify-Access-Token": accessToken
  };

  const options = {
    'method' : 'get',
    'headers' : header
  };

  let response = UrlFetchApp.fetch(URL, options)

  let json_response = JSON.parse(response.getContentText())
  json_response.orders.reverse()

  return json_response
}

const populateColumnHeaders = (json_response, lastRow, dataSheet) => {
  // only primary keys handled
  // I have taken all the columns no column filtration done or reordering
  let columns;
  if (json_response.orders.length)
    columns = Object.keys(json_response.orders[0]);
  
  if (!lastRow) {
    columns.map((columnName, idx) => {
      dataSheet.getRange(1, idx + 1).setValue(columnName);
    })
  }

  return columns
}

const populateNewData = (json_response, columns, lastRow, dataSheet) => {
  let actualRowCount = 0;
  if (lastRow)
    actualRowCount = lastRow - 1;

  // nested for-loop for accesing order data by column name for each order
  json_response.orders.map((order, row) => {
    columns.map((columnName, col) => {
      dataSheet.getRange(row + 2 + actualRowCount, col + 1).setValue(order[columnName]);
    })
  })
}
