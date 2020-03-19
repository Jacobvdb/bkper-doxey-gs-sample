// Compiled using ts2gas 3.4.4 (TypeScript 3.6.2)
var exports = exports || {};
var module = module || { exports: exports };

function generateDoc() {
  var bookId = "agtzfmJrcGVyLWhyZHITCxIGTGVkZ2VyGICAwNnBiqQIDA";
  var customerName = "More & More";  // accounts receivable on the book
  var model = generateModel(bookId, customerName);
  merge(model);
}

// Prepare the model with Bkper data 

function generateModel(bookId, customerName) {
  // Book Properties
  var book = BkperApp.openById(bookId);
  var model = {
    book: {
      ...book.getProperties(),
      name: book.getName(),
    }
  }

  // Account properties
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

  // transactions
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

//
//  Merge model in document  
//
function merge(model) {
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
