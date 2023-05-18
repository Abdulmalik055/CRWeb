fetch('/dailyJ')
.then((response) => {
  // Check if the request was successful
  if (response.ok) {
    // Parse the response body as JSON
    return response.json();
  } else {
    // Throw an error with the status text
    throw new Error(response.statusText + '/dailyJ response Error');
  }
})
.then((newData) => {
  console.log(newData)
  setDailyData(newData)

})
.catch((error) => {
  // Handle any errors
  console.error(error + '/dailyJ catch Error');
});

function filter(startDateID, endDateID){
  let startDate = document.getElementById(startDateID).value
  console.log(startDate)
  let endDate = document.getElementById(endDateID).value
  let filterDates = {startDate: startDate, endDate: endDate}
  fetch('/dailyFilter', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json'
    },
    body: JSON.stringify(filterDates)
  
  })
  .then((response) => {
    // Check if the request was successful
    if (response.ok) {
      // Parse the response body as JSON
      return response.json();
    } else {
      // Throw an error with the status text
      throw new Error(response.statusText);
    }
  })
  .then(newData => {
    setDailyData(newData)
  })
  .catch(err => console.error(err));

}

function setDailyData(newData){
  let dailyTotalTable = document.getElementById("dailyTotal")
  let expCash = 0
  let expPOS = 0
  let rentCash = 0
  let rentPOS = 0
  for(let dataKey in newData){

    if(dataKey.startsWith('Daily')){
        console.log(`Processing array: ${dataKey}`)
        let colName = `${dataKey}`
        let table = document.getElementById(colName)
        let length = table.rows.length
        for(i = length - 1; i>0; i--){
          table.deleteRow(i)
        }
        let id 
        
        for (let i = 0; i<newData[dataKey].length; i++){
          id = newData[dataKey][i]._id
          let newRow = document.createElement('tr')

          let newCellNumber = document.createElement('td')
          newCellNumber.id = colName + ': Index: ' + i + 1
          newCellNumber.textContent = i + 1
          newRow.appendChild(newCellNumber)
          
          for ( var key in newData[dataKey][i]){
            console.log(key)
            
            if (key.endsWith('Pic')){
              let newShowCell = document.createElement('td')
              let showImage = document.createElement('img')
              showImage.className = 'showImg'
              showImage.id = 'BTN' + colName + '_' + key + '_' + newData[dataKey][i]._id
              showImage.src = newData[dataKey][i][key]
              //use .bind so the function doesn't get called right away
              showImage.onclick = showImagePopup.bind(null, newData[dataKey][i][key], 'BTN' + colName + '_' + key + '_' + newData[dataKey][i]._id, true)
              showImage.onmouseenter = showImagePopup.bind(null, newData[dataKey][i][key], 'BTN' + colName + '_' + key + '_' + newData[dataKey][i]._id, false)
              let fileUploader = document.createElement('input')
              fileUploader.setAttribute('type', 'file')
              fileUploader.id = colName + '_' + key + '_' + newData[dataKey][i]._id
              fileUploader.className = 'changeFile'
              fileUploader.onclick = editableFile.bind(null,)
              
    
              let changeFileLabel = document.createElement('label')
              changeFileLabel.setAttribute('for', colName + '_' + key + '_' + newData[dataKey][i]._id)
              changeFileLabel.className = 'button-4'
              changeFileLabel.textContent = 'تعديل'
              
    
              newShowCell.appendChild(changeFileLabel)
              newShowCell.appendChild(fileUploader)
              newShowCell.appendChild(showImage)
              newRow.appendChild(newShowCell)
            }
            else if(key == 'VAT'){

            }
            
            else if (key !== '_id') {
              let newCell = document.createElement('td')
              newCell.id = colName + '_' + key + '_' + newData[dataKey][i]._id
              newCell.textContent = newData[dataKey][i][key]
              newRow.appendChild(newCell)
            }
            
            
          }
          let newCell = document.createElement('td')
          const button = document.createElement('button')
          button.id = colName + '_' + id
          button.textContent = 'حذف'
          button.className = 'delButton'
          button.addEventListener('click', delButtonFun)
          
          newCell.appendChild(button)
          newRow.appendChild(newCell)
          table.appendChild(newRow)
        }
    }

    else if(dataKey.startsWith('Month')){
        
        
      let data = dataKey

      if(data == "MonthExpInfo"){
        for(let keyCol of newData[data]){
          if(keyCol.PaymentMethod =="نقدي"){
            expCash += Number(keyCol.ExpenseCost)
          }
          else if(["شبكة", "تحويل"].includes(keyCol.PaymentMethod)){
            expPOS += Number(keyCol.ExpenseCost)
          }
        }
      }

      if(data == "MonthRentInfo"){
        for(let keyCol of newData[data]){
          if(keyCol.PaymentMethod =="نقدي"){
            rentCash += Number(keyCol.RentPrice)
          }
          else if (["شبكة", "تحويل"].includes(keyCol.PaymentMethod)){
            rentPOS += Number(keyCol.RentPrice)
          }
        }
      }

      
    }
  }
    
  let dailyTotalRow = document.createElement('tr')


  const totalTableArray = [rentCash, rentPOS, expCash, expPOS, rentCash -= Number(expCash), rentPOS -= Number(expPOS)]
  for(key in totalTableArray){
    let newCell = document.createElement('td')
    newCell.textContent = totalTableArray[key]
    dailyTotalRow.appendChild(newCell)
    dailyTotalTable.appendChild(dailyTotalRow)
  }
}