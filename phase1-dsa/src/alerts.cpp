// ============================================================
//  SmartSpend — Heap Alert System Implementation
// ============================================================

#include "../include/alerts.h"
#include <iostream>
#include <iomanip>
using namespace std;


// ── addAlert ─────────────────────────────────────────────────
// Call this when a category goes OVER budget
// Pushes into the heap — heap auto-sorts by overspentAmount
void AlertSystem::addAlert(string category, double spent, double limit) {
    if (spent <= limit) return;   // not overspent — skip

    AlertEntry entry;
    entry.category       = category;
    entry.overspentAmount = spent - limit;          // how much over
    entry.percentage     = (spent / limit) * 100;   // % used

    alertHeap.push(entry);   // heap auto-places it correctly

    cout << "ALERT ADDED: " << category
         << " overspent by Rs." << entry.overspentAmount
         << " (" << (int)entry.percentage << "%)\n";
}


// ── showTopAlert ─────────────────────────────────────────────
// Returns the WORST category — O(1), just look at heap top
void AlertSystem::showTopAlert() {
    if (alertHeap.empty()) {
        cout << "No alerts — all budgets under control!\n";
        return;
    }

    AlertEntry top = alertHeap.top();   // O(1) — peek at top

    cout << "\n*** TOP ALERT ***\n";
    cout << "Category  : " << top.category                 << "\n";
    cout << "Overspent : Rs." << top.overspentAmount        << "\n";
    cout << "Usage     : " << (int)top.percentage << "%\n";
    cout << "*****************\n";
}


// ── showAllAlerts ────────────────────────────────────────────
// Print all alerts — worst first
// NOTE: we copy the heap so original is not destroyed
void AlertSystem::showAllAlerts() {
    if (alertHeap.empty()) {
        cout << "No alerts right now.\n";
        return;
    }

    // Copy the heap — popping destroys it
    priority_queue<AlertEntry> temp = alertHeap;

    cout << "\n" << string(55, '=') << "\n";
    cout << left
         << setw(16) << "Category"
         << setw(14) << "Overspent"
         << setw(10) << "Usage%"
         << "Priority\n";
    cout << string(55, '-') << "\n";

    int rank = 1;
    while (!temp.empty()) {
        AlertEntry e = temp.top();
        temp.pop();

        cout << left
             << setw(16) << e.category
             << setw(14) << ("Rs." + to_string((int)e.overspentAmount))
             << setw(10) << ((int)e.percentage)
             << "#" << rank << "\n";
        rank++;
    }
    cout << string(55, '=') << "\n";
}


// ── getAlertCount ────────────────────────────────────────────
int AlertSystem::getAlertCount() {
    return alertHeap.size();
}


// ── clearAlerts ──────────────────────────────────────────────
void AlertSystem::clearAlerts() {
    while (!alertHeap.empty()) alertHeap.pop();
    cout << "All alerts cleared.\n";
}