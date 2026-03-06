#pragma once        //means: include this file only once
#include<string>
using namespace std;

class Transaction{
private:
    int id;
    string description;
    double amount;
    string category;
    string date;
    Transaction* prev;
    Transaction* next;

public:
// constructor initilizer list
    Transaction(int id, string desc, double amt, string cat, string date)
        : id(id), description(desc), amount(amt), category(cat), date(date), prev(nullptr), next(nullptr) {}

    // getters
    int getId() const { return id; }
    string getDescription() const { return description; }
    double getAmount() const { return amount; }
    string getCategory() const { return category; }
    string getDate() const { return date; }
    Transaction* getPrev() const { return prev; }
    Transaction* getNext() const { return next; }

    // setters
    void setDescription(string desc) { description = desc; }
    void setAmount(double amt)       { amount = amt; }
    void setCategory(string cat)     { category = cat; }
    void setDate(string d)           { date = d; }

    void setPrev(Transaction* p)     { prev = p; }
    void setNext(Transaction* n)     { next = n; }

    // to check debit
    bool isExpense() const { return amount < 0; }
};

class TransactionList {
private:
    Transaction* head;   // Pointer to FIRST transaction
    Transaction* tail;   // Pointer to LAST transaction
    int count;           // Total number of transactions

public:
    TransactionList();
    ~TransactionList();

    // Add a new transaction at the tail (end) of the list
    void addTransaction(int id, string desc, double amt, string cat, string date);

    // Delete a transaction by its ID — returns true if found+deleted
    bool deleteTransaction(int id);

    // Find and return a transaction by ID — returns nullptr if not found
    Transaction* findById(int id);

     // Print all transactions from head to tail
    void printAll() const;

     // Print transactions in REVERSE order (tail to head)
    void printReverse() const;

    // Sum of all amounts in one category  e.g. total "Food" spending
    double getTotalByCategory(string category) const;

    // Sum of ALL expenses (negative amounts only)
    double getTotalExpenses() const;

    // Sum of ALL income (positive amounts only)
    double getTotalIncome() const;

    // Net balance = income - expenses
    double getBalance() const;


    // getters
    int  getCount() const { return count; }
    Transaction* getHead()  const { return head; }
    Transaction* getTail()  const { return tail; }
};