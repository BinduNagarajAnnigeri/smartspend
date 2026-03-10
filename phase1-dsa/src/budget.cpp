#include "../include/budget.h"
#include <iostream>
#include <iomanip>
using namespace std;

// Set a budget limit for a category
// If category doesn't exist — it gets created automatically
void BudgetTracker::setBudget(string category, double limit) {
    budgetLimit[category] = limit;   // O(1) — direct insert
    spent[category] = 0.0;          // start spending at zero
    cout << "Budget set: " << category
         << " → Rs." << limit << "/month\n";
}

// Add spending to a category
// Called every time a transaction with this category is added
void BudgetTracker::addSpending(string category, double amount) {
    // Only track if budget exists for this category
    if (budgetLimit.count(category) == 0) {
        return;   // no budget set for this category, skip
    }

    spent[category] += amount;   // O(1) — direct update

    // Calculate what percentage of budget is used
    double percentage = (spent[category] / budgetLimit[category]) * 100;

    // Warn at 80% — before they overspend
    if (percentage >= 100) {
        cout << "EXCEEDED: " << category
             << " budget exceeded by Rs."
             << (spent[category] - budgetLimit[category]) << "\n";
    }
    else if (percentage >= 80) {
        cout << "WARNING: " << category
             << " at " << (int)percentage << "% of budget. "
             << "Rs." << getRemainingBudget(category) << " remaining.\n";
    }
}

// Check and print the status of one specific category
void BudgetTracker::checkCategory(string category) {
    // Check if this category exists in our map
    if (budgetLimit.count(category) == 0) {
        cout << "No budget set for: " << category << "\n";
        return;
    }

    double limit   = budgetLimit[category];   // O(1) lookup
    double used    = spent[category];          // O(1) lookup
    double remaining = limit - used;
    double percentage = (used / limit) * 100;

    cout << "\n--- " << category << " Budget ---\n";
    cout << "Limit    : Rs." << limit      << "\n";
    cout << "Spent    : Rs." << used       << "\n";
    cout << "Remaining: Rs." << remaining  << "\n";
    cout << "Used     : " << (int)percentage << "%\n";
}

// Print all categories in a formatted table
void BudgetTracker::printAllBudgets() {
    if (budgetLimit.empty()) {
        cout << "No budgets set yet.\n";
        return;
    }

    cout << "\n";
    cout << string(65, '=') << "\n";
    cout << left
         << setw(16) << "Category"
         << setw(12) << "Limit"
         << setw(12) << "Spent"
         << setw(12) << "Remaining"
         << setw(8)  << "Used%" << "\n";
    cout << string(65, '-') << "\n";

    // Loop through all keys in budgetLimit map
    for (auto& pair : budgetLimit) {
        string category = pair.first;    // the key   e.g. "Food"
        double limit    = pair.second;   // the value e.g. 3000.0
        double used     = spent[category];
        double remaining = limit - used;
        double percentage = (used / limit) * 100;

        cout << left
             << setw(16) << category
             << setw(12) << limit
             << setw(12) << used
             << setw(12) << remaining
             << setw(8)  << (int)percentage << "%";

        // Add status indicator at the end of each row
        if (percentage >= 100) cout << " EXCEEDED";
        else if (percentage >= 80) cout << " WARNING";
        else cout << " OK";

        cout << "\n";
    }
    cout << string(65, '=') << "\n";
}

// Returns how much budget is left
double BudgetTracker::getRemainingBudget(string category) {
    if (budgetLimit.count(category) == 0) return 0.0;
    return budgetLimit[category] - spent[category];
}

// Returns true if spending exceeded the limit
bool BudgetTracker::isOverBudget(string category) {
    if (budgetLimit.count(category) == 0) return false;
    return spent[category] > budgetLimit[category];
}