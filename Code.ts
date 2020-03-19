// Compiled using ts2gas 3.4.4 (TypeScript 3.6.2)
var exports = exports || {};
var module = module || { exports: exports };
//test
function generateDoc() {
  var bookId = "agtzfmJrcGVyLWhyZHITCxIGTGVkZ2VyGICAwNnBiqQIDA";
  var customerName = "More & More";
  var model = generateModel(bookId, customerName);
  Logger.log(JSON.stringify(model, null, 2));
  merge(model);
}
// 
// get the data from Bkper for the document
//
function generateModel(bookId, customerName) {
  var book = BkperApp.openById(bookId);
  var model = {
    book: {
      ...book.getProperties(),
      name: book.getName(),
    }
  }
  
  var accounts = book.getAccounts();
  for (var i = 0; i < accounts.length; i++) {
    var account = accounts[i];
    if (account.getName() == customerName) {
      model.customer = {
        ...account.getProperties(),
        name: account.getName(),
        balance: account.getBalance(),
      }
    }
  }
  
  model.transactions = [];
  
  var transactionIterator = book.getTransactions("account:'More & More'");
  
  while (transactionIterator.hasNext()) {
    var transaction = transactionIterator.next();
    model.transactions.push(
      {
        date: transaction.getInformedDateText(),
        description: transaction.getDescription(),
        account: transaction.getCreditAccount().getName(),
        amount: transaction.getAmount(),
      }
    )
  }
  
  return model;
}
// doxey.io Merge 
// https://github.com/floreysoft/doxey-client-gappsscript-sample
function merge(model) {
  //Logger.log(model);
  var params = {
    'template': "https://docs.google.com/document/d/1YZsebruAQcgzRyUn1t1iatVlP0UKzLulZoS5FY5RJho/edit",
    'model': model,
    'format': 'pdf'
  };
  var options = {
    'contentType': "application/json",
    'method': 'post',
    'payload': JSON.stringify(params),
    'muteHttpExceptions': false
  };
  var response = UrlFetchApp.fetch('https://api.doxey.io/merge', options);
  var document = response.getBlob();
  document.setName("Bkper Doxey GS sample.pdf");
  DriveApp.getFolderById("1543DzFsTzXco2z34bpdKkdGbPu42tkjl").createFile(document);
}
