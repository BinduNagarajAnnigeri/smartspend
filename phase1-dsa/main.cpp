#include "include/alerts.h"
#include "include/transaction.h"
#include "include/budget.h"
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



    // ── BUDGET TRACKER TEST ──────────────────────
cout << "\n==============================\n";
cout << "  SmartSpend Budget Tracker   \n";
cout << "==============================\n\n";

BudgetTracker budget;

// Set monthly budgets
budget.setBudget("Food",      3000.0);
budget.setBudget("Transport", 1000.0);
budget.setBudget("Housing",   9000.0);

// Add spending (same as your transactions)
budget.addSpending("Food",      340.0);   // Zomato
budget.addSpending("Food",     1200.0);   // Groceries
budget.addSpending("Transport", 500.0);   // Metro Card
budget.addSpending("Housing",  8000.0);   // Rent

// Print full budget table
budget.printAllBudgets();

// Check one specific category
budget.checkCategory("Food");

// Test warning — add more food spending
cout << "\nAdding Rs.1200 more to Food...\n";
budget.addSpending("Food", 1200.0);
budget.checkCategory("Food");

// ── HEAP ALERT SYSTEM ────────────────────────────────────────
cout << "\n==============================\n";
cout << "  SmartSpend Alert System     \n";
cout << "==============================\n\n";

AlertSystem alerts;

// Add categories that are overspent
// (spending > limit triggers an alert)
alerts.addAlert("Food",      2740.0, 2000.0);   // overspent by 740
alerts.addAlert("Housing",   9500.0, 9000.0);   // overspent by 500
alerts.addAlert("Transport", 1200.0, 1000.0);   // overspent by 200

// Show the single worst — O(1)
alerts.showTopAlert();

// Show all in order — worst first
alerts.showAllAlerts();

cout << "\nTotal categories in alert: "
     << alerts.getAlertCount() << "\n";

    return 0;
}
