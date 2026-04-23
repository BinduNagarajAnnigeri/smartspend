#include "../include/goals.h"
#include <iostream>
#include <iomanip>
#include <cmath>
using namespace std;

// ── Constructor ──────────────────────────────────────────────
SavingsGoal::SavingsGoal(string name, double target, double current) {
    goalName       = name;
    targetAmount   = target;
    currentSavings = current;
    cout << "Goal created: " << goalName
         << " — Target: Rs." << targetAmount << "\n";
}

// ── addCutOption ─────────────────────────────────────────────
void SavingsGoal::addCutOption(string category,
                                double saveAmount,
                                double difficulty) {
    CutOption cut;
    cut.category   = category;
    cut.saveAmount = saveAmount;
    cut.difficulty = difficulty;
    cutOptions.push_back(cut);
}

// ── findOptimalPath ──────────────────────────────────────────
// Dijkstra — greedy by difficulty ratio (save/difficulty)
// Best ratio = maximum saving for minimum difficulty
void SavingsGoal::findOptimalPath() {
    double remaining = targetAmount - currentSavings;

    if (remaining <= 0) {
        cout << "Goal already reached!\n";
        return;
    }

    cout << "\n" << string(55, '=') << "\n";
    cout << "DIJKSTRA — Optimal Saving Path\n";
    cout << "Goal    : " << goalName       << "\n";
    cout << "Target  : Rs." << targetAmount   << "\n";
    cout << "Saved   : Rs." << currentSavings << "\n";
    cout << "Needed  : Rs." << remaining       << "\n";
    cout << string(55, '-') << "\n";

    // Use priority_queue sorted by efficiency ratio
    // efficiency = saveAmount / difficulty
    // Higher ratio = better cut option
    priority_queue<pair<double, int>> pq;

    for (int i = 0; i < (int)cutOptions.size(); i++) {
        double ratio = cutOptions[i].saveAmount /
                       cutOptions[i].difficulty;
        pq.push({ratio, i});
    }

    // Greedily pick best options until goal is reached
    vector<int> chosenCuts;
    double totalSave = 0.0;
    double totalCost = 0.0;

    while (!pq.empty() && totalSave < remaining) {
        int idx = pq.top().second;
        pq.pop();

        chosenCuts.push_back(idx);
        totalSave += cutOptions[idx].saveAmount;
        totalCost += cutOptions[idx].difficulty;
    }

    // Show results
    cout << "\nOPTIMAL PATH FOUND:\n\n";

    for (int idx : chosenCuts) {
        CutOption& cut = cutOptions[idx];
        cout << "  Cut: " << left << setw(16) << cut.category
             << "-> Save Rs." << cut.saveAmount
             << "/month  (difficulty: " << cut.difficulty << ")\n";
    }

    int months = (int)ceil(remaining / totalSave);

    cout << "\n";
    cout << "Total monthly savings : Rs." << totalSave << "\n";
    cout << "Months to goal        : "    << months    << " months\n";
    cout << "Total difficulty cost : "    << totalCost << "\n";
    cout << string(55, '=') << "\n";
}

// ── showCutOptions ────────────────────────────────────────────
void SavingsGoal::showCutOptions() {
    if (cutOptions.empty()) {
        cout << "No cut options added yet.\n";
        return;
    }

    cout << "\n" << string(55, '-') << "\n";
    cout << left
         << setw(16) << "Category"
         << setw(14) << "Save/Month"
         << setw(12) << "Difficulty" << "\n";
    cout << string(55, '-') << "\n";

    for (auto& cut : cutOptions) {
        cout << left
             << setw(16) << cut.category
             << setw(14) << ("Rs." + to_string((int)cut.saveAmount))
             << cut.difficulty << "\n";
    }
    cout << string(55, '-') << "\n";
}

// ── showGoalStatus ────────────────────────────────────────────
void SavingsGoal::showGoalStatus() {
    double progress = (currentSavings / targetAmount) * 100;

    cout << "\n--- Goal: " << goalName << " ---\n";
    cout << "Target  : Rs." << targetAmount   << "\n";
    cout << "Saved   : Rs." << currentSavings << "\n";
    cout << "Progress: "    << (int)progress  << "%\n";
}