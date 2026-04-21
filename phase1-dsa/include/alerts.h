/* ============================================================
  SmartSpend — Heap Alert System (Module 3)
  "Which category am I overspending most?" → O(1)
 ============================================================
*/

#pragma once
#include <string>
#include <queue>
#include <vector>
using namespace std;

// One alert entry — category + how much over budget
struct AlertEntry {
    string category;
    double overspentAmount;   // how much OVER the limit
    double percentage;        // % of budget used

    // Max heap needs this — higher overspent = higher priority
    bool operator<(const AlertEntry& other) const {
        return overspentAmount < other.overspentAmount;
    }
};

class AlertSystem {
private:
    // Max heap — most overspent category always at top
    priority_queue<AlertEntry> alertHeap;

public:
    // Add a category that has crossed its budget
    void addAlert(string category, double spent, double limit);

    // Show the single worst category right now — O(1)
    void showTopAlert();

    // Show all alerts in order — worst first
    void showAllAlerts();

    // How many categories are in alert state?
    int getAlertCount();

    // Clear all alerts
    void clearAlerts();
};