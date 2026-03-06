#include "include/transaction.h"
#include <iostream>
using namespace std;

int main() {
    cout << "==============================\n";
    cout << "  SmartSpend Finance Engine   \n";
    cout << "==============================\n\n";

    // Create the linked list engine
    TransactionList ledger;

    // ── ADD TRANSACTIONS ─────────────────────────────────────
    ledger.addTransaction(1, "Monthly Salary",  25000.0, "Income",    "2024-01-01");
    ledger.addTransaction(2, "Rent",            -8000.0, "Housing",   "2024-01-02");
    ledger.addTransaction(3, "Zomato Dinner",    -340.0, "Food",      "2024-01-15");
    ledger.addTransaction(4, "Metro Card",       -500.0, "Transport", "2024-01-10");
    ledger.addTransaction(5, "Groceries",       -1200.0, "Food",      "2024-01-12");
    ledger.addTransaction(6, "Freelance Work",   5000.0, "Income",    "2024-01-20");

    // ── PRINT ALL (forward traversal) ─────────────────
    cout << "\n[Forward traversal — head to tail]\n";
    ledger.printAll();

    // ── PRINT REVERSE (backward traversal) ────────────
    cout << "[Reverse traversal — tail to head]\n";
    ledger.printReverse();

    // ── ANALYTICS ─────────────────────────────────────
    cout << "\n--- Analytics ---\n";
    cout << "Total Food spending  : Rs." << ledger.getTotalByCategory("Food")      << "\n";
    cout << "Total Transport      : Rs." << ledger.getTotalByCategory("Transport") << "\n";
    cout << "Total Income         : Rs." << ledger.getTotalIncome()                << "\n";
    cout << "Total Expenses       : Rs." << ledger.getTotalExpenses()              << "\n";
    cout << "Net Balance          : Rs." << ledger.getBalance()                    << "\n";

    // ── FIND BY ID ────────────────────────────────────
    cout << "\n--- Find Transaction #3 ---\n";
    Transaction* t = ledger.findById(3);
    if (t)
        cout << "Found: " << t->getDescription()
             << " | Rs." << t->getAmount()
             << " | " << t->getDate() << "\n";

    // ── DELETE ────────────────────────────────────────
    cout << "\n--- Delete Transaction #4 (Metro Card) ---\n";
    ledger.deleteTransaction(4);
    ledger.printAll();

    return 0;
}
