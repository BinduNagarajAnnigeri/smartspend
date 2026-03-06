#include "../include/transaction.h"
#include <iostream>
#include <iomanip>   
using namespace std;

TransactionList::TransactionList()
    : head(nullptr), tail(nullptr), count(0) {}

TransactionList::~TransactionList() {
    Transaction* curr = head;
    while (curr != nullptr) {
        Transaction* nextNode = curr->getNext();  // save next before deleting
        delete curr;                               
        curr = nextNode;                         
    }
    // head and tail now point to freed memory 
    head = nullptr;
    tail = nullptr;
}


void TransactionList::addTransaction(int id, string desc, double amt,
                                     string cat, string date) {
    // Create the new node on the heap
    Transaction* node = new Transaction(id, desc, amt, cat, date);

    if (head == nullptr) {
        // Case 1: empty list
        head = node;
        tail = node;
    } else {
        // Case 2: attach to tail
        node->setPrev(tail);    // new node's prev → old tail
        tail->setNext(node);    // old tail's next → new node
        tail = node;            // update tail to new node
    }

    count++;
    cout << "Added: [#" << id << "] " << desc<< " | Rs." << amt << " | " << cat << "\n";
}

//  Four cases to handle:
//  1. Node not found
//  2. Node is the only node (head == tail)
//  3. Node is the head
//  4. Node is the tail
//  5. Node is in the middle
bool TransactionList::deleteTransaction(int id) {
    Transaction* curr = findById(id);

    //case 1. Node not found
    if (curr == nullptr) {
        cout << "Transaction #" << id << " not found.\n";
        return false;
    }

    // case 4. curr is at middle
    if (curr->getPrev() != nullptr)
        curr->getPrev()->setNext(curr->getNext());
    // case 2. curr = head
    else
        head = curr->getNext();  // deleting the head — update head

    // case 4. curr is at middle
    if (curr->getNext() != nullptr)
        curr->getNext()->setPrev(curr->getPrev());
    // case 3. curr = tail
    else
        tail = curr->getPrev();  // deleting the tail — update tail

    delete curr;
    count--;
    cout << "Deleted transaction #" << id << "\n";
    return true;
}

// linear search -> O(n)
Transaction* TransactionList::findById(int id) {
    Transaction* curr = head;
    while (curr != nullptr) {
        if (curr->getId() == id)
            return curr;       // found it — return pointer
        curr = curr->getNext();
    }
    return nullptr;            // not found
}


// FORWARD TRAVERSAL (head → tail)
void TransactionList::printAll() const {
    if (head == nullptr) {
        cout << "No transactions yet.\n";
        return;
    }

    cout << "\n";
    cout << string(65, '=') << "\n";
    cout << left
         << setw(5)  << "ID"
         << setw(22) << "Description"
         << setw(12) << "Amount"
         << setw(14) << "Category"
         << setw(12) << "Date" << "\n";
    cout << string(65, '-') << "\n";

    Transaction* curr = head;
    while (curr != nullptr) {
        cout << left
             << setw(5)  << curr->getId()
             << setw(22) << curr->getDescription()
             << setw(12) << curr->getAmount()
             << setw(14) << curr->getCategory()
             << setw(12) << curr->getDate() << "\n";
        curr = curr->getNext();
    }

    cout << string(65, '=') << "\n";
    cout << "Total transactions: " << count << "\n";
    cout << "Balance           : Rs." << getBalance() << "\n\n";
}



// BACKWARD TRAVERSAL (tail → head)
void TransactionList::printReverse() const {
    if (tail == nullptr) {
        cout << "No transactions yet.\n";
        return;
    }

    cout << "\n";
    cout << string(65, '=') << "\n";
    cout << left
         << setw(5)  << "ID"
         << setw(22) << "Description"
         << setw(12) << "Amount"
         << setw(14) << "Category"
         << setw(12) << "Date" << "\n";
    cout << string(65, '-') << "\n";

     Transaction* curr = tail;          // start from tail this time
    while (curr != nullptr) {
         cout << left
             << setw(5)  << curr->getId()
             << setw(22) << curr->getDescription()
             << setw(12) << curr->getAmount()
             << setw(14) << curr->getCategory()
             << setw(12) << curr->getDate() << "\n";
              curr = curr->getPrev(); 
    }
    cout << string(65, '=') << "\n";
}
// ANALYTICS METHODS

double TransactionList::getTotalByCategory(string category) const {
    double total = 0.0;
    Transaction* curr = head;
    while (curr != nullptr) {
        if (curr->getCategory() == category)
            total += curr->getAmount();
        curr = curr->getNext();
    }
    return total;
}

double TransactionList::getTotalExpenses() const {
    double total = 0.0;
    Transaction* curr = head;
    while (curr != nullptr) {
        if (curr->isExpense())          
            total += curr->getAmount();
        curr = curr->getNext();
    }
    return total;
}

double TransactionList::getTotalIncome() const {
    double total = 0.0;
    Transaction* curr = head;
    while (curr != nullptr) {
        if (!curr->isExpense())
            total += curr->getAmount();
        curr = curr->getNext();
    }
    return total;
}

double TransactionList::getBalance() const {
    // balance = income + expenses  (expenses are already negative)
    return getTotalIncome() + getTotalExpenses();
}
