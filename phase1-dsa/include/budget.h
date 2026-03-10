#pragma once
#include <string>
#include <unordered_map>
using namespace std;

class BudgetTracker {
private:
    // Two hash maps — one for limits, one for actual spending
    unordered_map<string, double> budgetLimit;
    unordered_map<string, double> spent;

public:
    // Set a budget limit for a category
    void setBudget(string category, double limit);

    // Record spending in a category
    void addSpending(string category, double amount);

    // Check status of one category
    void checkCategory(string category);

    // Print all categories with full status
    void printAllBudgets();

    // Returns how much is left in a category
    double getRemainingBudget(string category);

    // Returns true if category has exceeded budget
    bool isOverBudget(string category);
};