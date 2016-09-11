-- Creates the bamazon database --
CREATE DATABASE bamazon;

-- Makes it so all of the following code will affect bamazon --
USE bamazon;

-- Creates the table 'Products' within bamazon --
CREATE table Products(
	ItemID INTEGER(30) AUTO_INCREMENT NOT NULL,
	ProductName VARCHAR(30) NOT NULL,
	DepartmentName VARCHAR(30) NOT NULL,
	Price DECIMAL(10,2) NOT NULL,
	StockQuantity INTEGER(10) NOT NULL,
	PRIMARY KEY(ItemID)
);