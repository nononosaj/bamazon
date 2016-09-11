// NPM install the following
var mysql = require('mysql');
var inquirer = require('inquirer');


// Connect to mysql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root", 
    password: "", // Never set up a password
    database: "bamazon"
})

// Connection status
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    start();
})


var start = function() {
   connection.query('SELECT * FROM Products', function(err, res) {
        console.log('Available Bamazon Products');
        
        // New Table instance to format returned sql data
            var table = new Table({
                head: ['ItemID', 'ProductName', 'Price', 'Quantity'],
                colWidths: [10, 40, 10, 10]
            });

        for (var i=0; i < res.length; i++) {
            var productArray = [res[i].ItemID, res[i].ProductName, res[i].Price, res[i].StockQuantity];
            table.push(productArray);
        }

        console.log(table.toString());
        buyItem();
        });
    };


// Customer will provide ID of item
var buyItem = function() {
    inquirer.prompt([{
        name: "Item",
        type: "input",
        message: "Please select the ID of the product that you'd like to buy.",
        validate: function(value) {
            //validates answer
            if (isNaN(value) === false) {
                return true;
            } else {
                console.log("\n Please enter the ID only \n");
                return false;
            }
        }
    }, 
    //Prompts the customer for the quantity
{
        name: "Qty",
        type: "input",
        message: "How many would you like to buy?",

           // Validation
        validate: function(value) {

         
            if (isNaN(value) === false) {
                return true;
            } else {
                console.log("\nPlease enter a valid Quantity\n");
                return false;
            }
        }

}]).then(function(answer) {
            var ItemInt = parseInt(answer.Qty);

              
                connection.query("SELECT * FROM Products WHERE ?", [{ItemID: answer.Item}], function(err, data) { 
                    if (err) throw err;

                    // Checks if available quantity is in stock
                    if (data[0].StockQuantity < ItemInt) {
                       console.log("We're sorry, that Item is currently out of stock\n");
                       console.log("Please choose another Product\n");
                       start(); 
                    } else {

                        // If quantity exists updates database
                        var updateQty = data[0].StockQuantity - ItemInt;
                        var totalPrice = data[0].Price * ItemInt;
                        connection.query('UPDATE products SET StockQuantity = ? WHERE ItemID = ?', [updateQty, answer.Item], function(err, results) {
                        if(err) {
                            throw err;
                        } else {
                        console.log("Purchase successfull!\n");
                        console.log("Your total cost is: $ " + totalPrice);

                        
                        inquirer.prompt({
                            name: "buyMore",
                            type: "confirm",
                            message: "Would you like to buy another Product?",
                        }).then(function(answer) {
                            if (answer.buyMore === true) {
                                start();
                            } else {
                                console.log("Thank your for shopping with Bamazon!");
                                connection.end();
                            }
                        });
                        }
                    });
                }               
            });
        });
    };