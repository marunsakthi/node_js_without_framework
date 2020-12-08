const http = require("http")
const mysql = require('mysql');
const url = require('url');

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'blaze.ws',
    database: 'login'
});

conn.connect((err) =>{
    if(err) throw err;
    console.log('Mysql Connected...');
 });

async function bodyParser(request) {
  return new Promise((resolve, reject) => {
    let totalChunked = ""
    request
      .on("error", err => {
        console.error(err)
        reject()
      })
      .on("data", chunk => {
        totalChunked += chunk
      })
      .on("end", () => {
        request.body = JSON.parse(totalChunked)
        resolve()
      })
  })
}

const server = http.createServer((request, response) => {
  let url = request.url
  let method = request.method
  //Cors Check
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  response.setHeader('Access-Control-Allow-Credentials', true);
  switch (method) {
    case "POST":
      if (url === "/account") {
        createBankAccountcustomer(request, response)
      }
      break

    default:
      response.writeHead(400, { "Content-type": "text/plain" })
      response.write("Invalid URL")
      response.end()
  }

  switch (method) {
    case "POST":
      if (url === "/getallBankaccount_customers") {
        getCustomersBYid(request, response)
      }
     break
     
    default:
      response.writeHead(400, { "Content-type": "text/plain" })
      response.write("Invalid URL")
      response.end()
  }

  switch (method) {
    case "POST":
      if (url === "/transfer_amount") {
        transferAmount(request, response)
      }
     break
     
    default:
      response.writeHead(400, { "Content-type": "text/plain" })
      response.write("Invalid URL")
      response.end()
  }

  switch (method) {
    case "POST":
      if (url === "/retrieve_account_balance") {
        getBalance(request, response)
      }
     break
     
    default:
      response.writeHead(400, { "Content-type": "text/plain" })
      response.write("Invalid URL")
      response.end()
  }
  switch (method) {
    case "POST":
      if (url === "/retrieve_transfer_history") {
        getTransfer_history(request, response)
      }
     break
     
    default:
      response.writeHead(400, { "Content-type": "text/plain" })
      response.write("Invalid URL")
      response.end()
  }
})

//Create a new bank account for a customer, with an initial deposit amount.

async function createBankAccountcustomer(request, response) {
    try {
      await bodyParser(request)
      console.log("post", request.body)
      let data = {
        customer_id: request.body.customer_id, 
        accountname: request.body.accountname,
        accountholder: request.body.accountholder,
        ifsc_code: request.body.ifsc_code,
        accountnumber: request.body.accountnumber,
        deposit_amount: request.body.deposit_amount
      };
      let sql = "INSERT INTO bank_account SET ?";
      let query = conn.query(sql, data,(err, results) => {
        if(err) throw err;
        response.writeHead(200, { "Content-Type": "application/json" })
        response.write(JSON.stringify(results))
        response.end()
      });
    } catch (err) {
      response.writeHead(400, { "Content-type": "text/plain" })
      response.write("Invalid body data was provided", err.message)
      response.end()
    }
  }

//A single customer may have multiple bank accounts.
const getCustomersBYid = async (request, response) => {
    await bodyParser(request)
    let sql = "SELECT * FROM bank_account WHERE customer_id ="+ request.body.customer_id;
    let query = conn.query(sql, (err, results) => {
        if(err) throw err;
        console.log("res", results)
        response.writeHead(200, { "Content-Type": "application/json" })
        response.write(JSON.stringify(results))
        response.end()
    });
}

//Transfer amounts between any two accounts, including those owned by different customers.
async function transferAmount(request, response) {
    try {
      await bodyParser(request)
      console.log("post", request.body)
      let data = {
        customer_id: request.body.customer_id, 
        account_id: request.body.account_id,
        amount: request.body.amount
      };
      let history_data = {
        customer_id: request.body.customer_id, 
        account_id: request.body.account_id,
        status: request.body.customer_id +" "+"Id Trasnfer The Amount Using This Account"+" "+request.body.account_id
      };
      let sql = "INSERT INTO transfer_amount SET ?";
      let history = "INSERT INTO transfer_history SET ?";
      let get_amount = `SELECT deposit_amount FROM bank_account  WHERE customer_id = '${request.body.customer_id}' AND (accountname = '${request.body.accountname}')`;
      let queryss = conn.query(get_amount, (err, results_amount) => {
        if(err) throw err;
        console.log("get_amount", results_amount[0].deposit_amount)
        let transfer_amount = parseInt(results_amount[0].deposit_amount) - parseInt(request.body.amount)
        let query = conn.query(sql, data,(err, results) => {
          if(err) throw err;
          let sqls = `UPDATE bank_account SET deposit_amount = '${transfer_amount}' WHERE customer_id = '${request.body.customer_id}' AND (accountname = '${request.body.accountname}')`;
          let querys = conn.query(sqls, (err, update) => {
            let queryss = conn.query(history, history_data,(err, history) => {
              if(err) throw err;
              response.writeHead(200, { "Content-Type": "application/json" })
              response.write(JSON.stringify(results))
              response.end()
          }); 
          }); 
        });
     }); 
    } catch (err) {
      response.writeHead(400, { "Content-type": "text/plain" })
      response.write("Invalid body data was provided", err.message)
      response.end()
    }
  }

const getBalance = async (request, response) => {
    await bodyParser(request)
    let get_amount = `SELECT deposit_amount FROM bank_account  WHERE customer_id = '${request.body.customer_id}' AND (accountname = '${request.body.accountname}')`;
    let query = conn.query(get_amount, (err, results) => {
        if(err) throw err;
        console.log("res", results)
        response.writeHead(200, { "Content-Type": "application/json" })
        response.write(JSON.stringify(results))
        response.end()
    });
}

const getTransfer_history = async (request, response) => {
  await bodyParser(request)
  let get_amount = `SELECT * FROM transfer_history  WHERE customer_id = '${request.body.customer_id}'`;
  let query = conn.query(get_amount, (err, results) => {
      if(err) throw err;
      console.log("res", results)
      response.writeHead(200, { "Content-Type": "application/json" })
      response.write(JSON.stringify(results))
      response.end()
  });
} 

server.listen(3000, () => {
  console.log(`Server running on Port 3000`)
})