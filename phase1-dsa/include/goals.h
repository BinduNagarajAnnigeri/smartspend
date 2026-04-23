// ============================================================
//  SmartSpend — Graph + Dijkstra Savings Goal (Module 4)
//  Concept: Weighted Graph + Dijkstra's Algorithm
//  "What is the optimal path to reach my savings goal?"
// ============================================================

#pragma once
#include <string>
#include <vector>
#include <queue>
#include <unordered_map>
#include <limits>
using namespace std;

// One spending cut option — an edge in the graph
struct CutOption {
    string category;      // which category to cut
    double saveAmount;    // how much you save per month
    double difficulty;    // cost/difficulty of making this cut
                          // lower = easier
};

// One node in the graph — a savings milestone
struct SavingsNode {
    double amountSaved;   // how much saved so far
    double totalCost;     // total difficulty to reach here

    // Min heap — lower totalCost = higher priority
    bool operator>(const SavingsNode& other) const {
        return totalCost > other.totalCost;
    }
};

class SavingsGoal {
private:
    string goalName;
    double targetAmount;
    double currentSavings;
    vector<CutOption> cutOptions;   // available spending cuts

public:
    SavingsGoal(string name, double target, double current = 0.0);

    // Add a spending cut option (edge in graph)
    void addCutOption(string category, double saveAmount, double difficulty);

    // Run Dijkstra — find optimal path to goal
    void findOptimalPath();

    // Show all available cut options
    void showCutOptions();

    // Show goal status
    void showGoalStatus();
};