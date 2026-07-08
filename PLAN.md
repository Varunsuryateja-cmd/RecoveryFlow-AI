# RecoveryFlow AI

## Project Overview

RecoveryFlow AI is an AI-powered smart stadium exit planner that helps football fans leave the stadium safely, efficiently, and with less congestion after a match.

Instead of simply providing directions, the system analyzes stadium conditions (simulated in this prototype), transport availability, and user preferences to recommend the best exit strategy while explaining the reasoning behind the recommendation.

---

## Problem Statement

At the end of a football match, thousands of fans leave the stadium at the same time.

This leads to:

* Congested exit gates
* Long queues
* Traffic congestion
* Crowded public transport
* Confusion about the best exit route

Fans often choose the nearest exit instead of the fastest overall option.

---

## Proposed Solution

RecoveryFlow AI acts as an intelligent decision-support assistant.

The user enters:

* Destination
* Transport mode
* Priority (Fastest / Least Crowded / Least Walking)

The AI analyzes the available stadium information (simulated for this prototype) and recommends:

* Best exit gate
* Whether to leave immediately or wait
* Recommended transport option
* Estimated travel time
* Explanation for the recommendation

---

## Target Users

Primary Users:

* Football Fans

Secondary Users:

* Stadium Operations Team

---

## Challenge Themes Covered

* Crowd Management
* Transportation
* Operational Intelligence
* Real-Time Decision Support

---

## Minimum Viable Product (MVP)

1. Home Page
2. Plan My Exit
3. AI Recommendation
4. Operations Dashboard

---

## Goal

Improve fan experience by helping spectators leave the stadium more efficiently while reducing congestion through AI-powered recommendations.

## Features

### 1. AI Exit Recommendation
The user selects:
- Destination
- Transport
- Priority

The AI recommends:
- Best exit gate
- Leave now or wait
- Estimated travel time
- Reason for recommendation

---

### 2. Compare Routes
Compare two or three exit options.

Example:
- Gate A → 18 min
- Gate C → 10 min (Recommended)

The AI explains why Gate C is better.

---

### 3. Decision Simulator
"What if I wait 10 minutes?"

The app compares:
- Leave now
- Wait 10 minutes

Then recommends the better option.

---

### 4. Operations Snapshot
Shows simulated stadium conditions:
- Gate A – High congestion
- Gate B – Medium congestion
- Gate C – Low congestion
- Metro Queue
- Taxi Queue

## Dashboard Sections

1. Header
2. Match Information
3. Operations Snapshot
4. Plan My Exit
5. AI Recommendation
6. Compare Routes
7. Decision Simulator

## User Flow

1. User opens RecoveryFlow AI.

2. User views the current match information (simulated).

3. User clicks "Plan My Exit".

4. User selects:
   - Destination (Metro / Bus / Taxi / Parking)
   - Priority (Fastest / Least Crowded / Least Walking)
   - Accessibility (Optional)

5. User clicks "Generate Recommendation".

6. RecoveryFlow AI analyzes the simulated stadium conditions.

7. The app displays:
   - Recommended Exit Gate
   - Leave Now or Wait
   - Estimated Travel Time
   - Alternative Route Comparison
   - AI Explanation

8. User decides which option to follow.

## Simulation Scenarios

### Scenario 1
Match Finished

Gate A - High Crowd
Gate B - Medium Crowd
Gate C - Low Crowd

Metro Wait - 5 min
Taxi Wait - 15 min

--------------------------------

### Scenario 2

Heavy Rain

Gate A - Medium Crowd
Gate B - High Crowd
Gate C - Low Crowd

Metro Wait - 18 min
Taxi Wait - 6 min

--------------------------------

### Scenario 3

Parking Congestion

Gate A - Low Crowd
Gate B - Medium Crowd
Gate C - High Crowd

Bus Wait - 3 min
Parking Exit - 20 min

## AI Workflow

User Input
        ↓
Simulation Data
        ↓
Decision Engine
        ↓
Gemini AI
        ↓
Personalized Recommendation