from app.services.base_engine import BaseRecommendationEngine
from app.models import (
    ExitPlanRequest, 
    ExitRecommendationModel, 
    ExitPlanModel, 
    ScenarioIdEnum,
    DestinationEnum,
    PriorityEnum
)

class RuleBasedRecommendationEngine(BaseRecommendationEngine):
    """
    Default rule-based implementation of the recommendation engine.
    Generates realistic, logic-driven exit plans using pre-defined stadium metrics.
    """
    
    def generate_recommendation(
        self, 
        scenario_id: ScenarioIdEnum, 
        request: ExitPlanRequest
    ) -> ExitRecommendationModel:
        dest = request.destination
        priority = request.priority
        accessibility = request.accessibility

        primary: ExitPlanModel
        alternatives: list[ExitPlanModel] = []

        if scenario_id == ScenarioIdEnum.SCENARIO1:
            # Match Finished Scenario (Gate A High, Gate B Med, Gate C Low)
            # Metro queue Wait 5m, Taxi queue Wait 15m
            if accessibility:
                primary = ExitPlanModel(
                    gateName="Gate B (East)",
                    leaveStatus="Leave Now",
                    travelTime=15,
                    crowdLevel="Medium",
                    explanation="Gate B is equipped with wide ADA ramps and elevators direct to the transit platform. While Gate A is closer to the metro, the stairs and current severe overcrowding make Gate B the safest and most efficient choice.",
                    routeSteps=[
                        "Exit via ADA Ramp East (Gate B)",
                        "Follow the wheelchair-accessible blue pathway",
                        "Use Elevator B3 down to the Metro Platform level"
                    ]
                )
                alternatives = [
                    ExitPlanModel(
                        gateName="Gate C (West)",
                        leaveStatus="Wait 10 Mins",
                        travelTime=22,
                        crowdLevel="Low",
                        explanation="Gate C is very clear but requires a 450m walk on an unpaved bypass. Elevators are operational but wait times apply.",
                        routeSteps=["Exit Gate C", "Proceed via West unpaved bypass", "Access platform elevator C1"]
                    ),
                    ExitPlanModel(
                        gateName="Gate A (South)",
                        leaveStatus="Wait 20 Mins",
                        travelTime=35,
                        crowdLevel="High",
                        explanation="Gate A is extremely congested. The main escalators are temporarily paused to manage crowd density at the entrance gates.",
                        routeSteps=["Exit Gate A Escalators", "Wait in South holding pen", "Enter Main South station entrance"]
                    )
                ]
            elif priority == PriorityEnum.LEAST_WALKING:
                primary = ExitPlanModel(
                    gateName="Gate A (South)",
                    leaveStatus="Wait 10 Mins",
                    travelTime=28,
                    crowdLevel="High",
                    explanation="Gate A offers the shortest walking distance (150m to transit). Due to high crowding, we recommend waiting 10 minutes in the stadium concourse to avoid the worst congestion at the gate checkpoints.",
                    routeSteps=[
                        "Wait in Stadium Zone A Concourse for 10 minutes",
                        "Exit Gate A through the main ticket turnstiles",
                        "Walk 150m south along the covered walkway to the station"
                    ]
                )
                alternatives = [
                    ExitPlanModel(
                        gateName="Gate C (West)",
                        leaveStatus="Leave Now",
                        travelTime=18,
                        crowdLevel="Low",
                        explanation="Gate C is completely clear and requires no waiting, but requires a longer 400m walk around the stadium perimeter.",
                        routeSteps=["Exit Gate C now", "Walk 400m along the outer security ring", "Enter station via West gates"]
                    ),
                    ExitPlanModel(
                        gateName="Gate B (East)",
                        leaveStatus="Leave Now",
                        travelTime=22,
                        crowdLevel="Medium",
                        explanation="A moderate walk option (250m) through Gate B. Flow is steady and avoids high-density zones.",
                        routeSteps=["Exit Gate B East", "Follow signs for Transit Hub", "Enter station via East gates"]
                    )
                ]
            elif priority == PriorityEnum.LEAST_CROWDED or dest == DestinationEnum.BUS:
                primary = ExitPlanModel(
                    gateName="Gate C (West)",
                    leaveStatus="Leave Now",
                    travelTime=12,
                    crowdLevel="Low",
                    explanation="Gate C has a very low crowd density (only 4 mins wait). Exiting here bypasses the main stadium crush completely and connects directly to the transport paths.",
                    routeSteps=[
                        "Exit through Gate C turnstiles immediately",
                        "Walk 300m along the paved West pathway",
                        "Proceed to your destination platform"
                    ]
                )
                alternatives = [
                    ExitPlanModel(
                        gateName="Gate B (East)",
                        leaveStatus="Leave Now",
                        travelTime=20,
                        crowdLevel="Medium",
                        explanation="Gate B has moderate crowd density but steady throughput. Good alternative if you prefer a sheltered route.",
                        routeSteps=["Exit Gate B East", "Take the East Covered Ring Road", "Arrive at East Station Gates"]
                    ),
                    ExitPlanModel(
                        gateName="Gate A (South)",
                        leaveStatus="Wait 20 Mins",
                        travelTime=35,
                        crowdLevel="High",
                        explanation="Avoid Gate A at this time. Severe crowd gridlock is causing queueing inside the stadium gates.",
                        routeSteps=["Exit Gate A", "Enter South queueing zone", "Proceed slowly to station"]
                    )
                ]
            else:
                # Fastest route priorities for Scenario 1
                if dest == DestinationEnum.METRO:
                    primary = ExitPlanModel(
                        gateName="Gate C (West)",
                        leaveStatus="Leave Now",
                        travelTime=14,
                        crowdLevel="Low",
                        explanation="Gate C has a wait time of only 4 minutes. By taking Gate C and walking the outer ring road to the Metro (400m), you bypass the Gate A bottleneck completely, saving 16 minutes overall.",
                        routeSteps=[
                            "Exit Gate C (West) immediately",
                            "Follow the green-lit Outer Ring Road signs",
                            "Enter the Metro Station via the West Entrance (no queue)"
                        ]
                    )
                elif dest == DestinationEnum.TAXI:
                    primary = ExitPlanModel(
                        gateName="Gate B (East)",
                        leaveStatus="Leave Now",
                        travelTime=22,
                        crowdLevel="Medium",
                        explanation="Gate B offers a balanced route. The Taxi stand is currently congested (15 min wait), but Gate B has a steady throughput (12 min wait). This combined route gets you to a cab faster than Gate A.",
                        routeSteps=[
                            "Exit Gate B (East)",
                            "Take the East corridor path to the Taxi Stand",
                            "Board taxi in Lane 3"
                        ]
                    )
                else:  # Parking
                    primary = ExitPlanModel(
                        gateName="Gate B (East)",
                        leaveStatus="Leave Now",
                        travelTime=18,
                        crowdLevel="Medium",
                        explanation="Gate B leads directly to the shuttle bus loop, which is currently operating with 3-minute intervals. Avoid Gate C which leads to the highly congested North Parking exit.",
                        routeSteps=[
                            "Exit Gate B (East)",
                            "Board the Shuttle Bus in Lane A",
                            "Disembark at the Outer Parking hub"
                        ]
                    )
                alternatives = [
                    ExitPlanModel(
                        gateName="Gate A (South)",
                        leaveStatus="Wait 20 Mins",
                        travelTime=38,
                        crowdLevel="High",
                        explanation="Although Gate A is geographically closest to the Metro/Taxi Stand, the severe crowding creates a major bottleneck, increasing total travel time.",
                        routeSteps=["Wait in seating bowl", "Exit Gate A", "Queue at main South Gate entrance"]
                    ),
                    ExitPlanModel(
                        gateName="Gate C (West)",
                        leaveStatus="Leave Now",
                        travelTime=25,
                        crowdLevel="Low",
                        explanation="Very clear gate, but the walking route to the East parking lots/Taxis is long and unshaded.",
                        routeSteps=["Exit Gate C", "Take North Perimeter path", "Arrive at East transit lot"]
                    )
                ]

        elif scenario_id == ScenarioIdEnum.SCENARIO2:
            # Heavy Rain Scenario (Gate A Med, Gate B High, Gate C Low)
            # Metro Wait 18m, Taxi Wait 6m
            if accessibility:
                primary = ExitPlanModel(
                    gateName="Gate A (South)",
                    leaveStatus="Leave Now",
                    travelTime=18,
                    crowdLevel="Medium",
                    explanation="Gate A has standard ramp access. Although Gate B has shelter, it is currently backlogged due to fans stopping under the shelter. Gate A remains clear and has fully elevator-equipped boarding gates.",
                    routeSteps=[
                        "Exit Gate A (South) using the accessible ramps",
                        "Use the covered South walkway",
                        "Access the train platform via Elevator A1"
                    ]
                )
                alternatives = [
                    ExitPlanModel(
                        gateName="Gate B (East)",
                        leaveStatus="Wait 15 Mins",
                        travelTime=32,
                        crowdLevel="High",
                        explanation="Gate B is covered but highly congested because fans are crowding the doors to avoid the rain. Elevators are crowded.",
                        routeSteps=["Wait in Concourse B", "Exit Gate B East", "Board accessible shuttle"]
                    ),
                    ExitPlanModel(
                        gateName="Gate C (West)",
                        leaveStatus="Leave Now",
                        travelTime=25,
                        crowdLevel="Low",
                        explanation="Gate C is clear but completely unsheltered. Not recommended during heavy rainfall.",
                        routeSteps=["Exit Gate C West", "Walk 400m unsheltered bypass", "Enter platform elevator C1"]
                    )
                ]
            elif priority == PriorityEnum.LEAST_WALKING:
                primary = ExitPlanModel(
                    gateName="Gate A (South)",
                    leaveStatus="Leave Now",
                    travelTime=20,
                    crowdLevel="Medium",
                    explanation="Gate A is the closest exit to public transit. Since it has moderate crowding, you will spend the least amount of time walking in the rain.",
                    routeSteps=[
                        "Exit Gate A turnstiles immediately",
                        "Walk 150m under the covered skyway directly to the Metro station"
                    ]
                )
                alternatives = [
                    ExitPlanModel(
                        gateName="Gate B (East)",
                        leaveStatus="Wait 15 Mins",
                        travelTime=35,
                        crowdLevel="High",
                        explanation="Gate B is fully covered but suffers from high gridlock as fans congregate under the canopy.",
                        routeSteps=["Wait in Concourse B", "Exit Gate B", "Walk 250m to station"]
                    ),
                    ExitPlanModel(
                        gateName="Gate C (West)",
                        leaveStatus="Leave Now",
                        travelTime=24,
                        crowdLevel="Low",
                        explanation="Gate C is clear, but requires a 400m walk through unsheltered pathways, exposing you to heavy rain.",
                        routeSteps=["Exit Gate C", "Walk 400m outer perimeter in rain", "Enter station"]
                    )
                ]
            else:
                if dest == DestinationEnum.TAXI:
                    primary = ExitPlanModel(
                        gateName="Gate A (South)",
                        leaveStatus="Leave Now",
                        travelTime=16,
                        crowdLevel="Medium",
                        explanation="Taxi wait times are very low (6 min) due to an surge of dispatch cabs. Exiting via Gate A takes 10 mins and puts you right at the Taxi stand with minimal wait.",
                        routeSteps=[
                            "Exit through Gate A (South)",
                            "Follow signs to the Taxi dispatch terminal",
                            "Board taxi in Lane 1"
                        ]
                    )
                else:  # Metro, Parking, Bus
                    primary = ExitPlanModel(
                        gateName="Gate C (West)",
                        leaveStatus="Leave Now",
                        travelTime=22,
                        crowdLevel="Low",
                        explanation="Gate C is completely clear (6 min wait) and leads to the West Metro entrance, bypassing the flooded and gridlocked East Gate B structures. Bring an umbrella for the 400m walk.",
                        routeSteps=[
                            "Exit Gate C (West) immediately",
                            "Follow the West perimeter road",
                            "Enter Metro Station via West platform"
                        ]
                    )
                alternatives = [
                    ExitPlanModel(
                        gateName="Gate B (East)",
                        leaveStatus="Wait 20 Mins",
                        travelTime=36,
                        crowdLevel="High",
                        explanation="Gate B is highly congested due to rain sheltering. Fans are refusing to leave the covered concourse, causing gridlock.",
                        routeSteps=["Wait in stadium concourse", "Exit Gate B", "Proceed to Metro"]
                    ),
                    ExitPlanModel(
                        gateName="Gate A (South)",
                        leaveStatus="Leave Now",
                        travelTime=28,
                        crowdLevel="Medium",
                        explanation="Moderate crowds, but the walking paths are partially flooded, slowing down pedestrian traffic.",
                        routeSteps=["Exit Gate A", "Follow signs to Metro", "Navigate wet pedestrian walkways"]
                    )
                ]

        else:
            # Parking Congestion Scenario (Gate A Low, Gate B Med, Gate C High)
            # Bus Wait 3m, Parking Exit 20m
            if dest == DestinationEnum.PARKING:
                primary = ExitPlanModel(
                    gateName="Gate B (East)",
                    leaveStatus="Wait 20 Mins",
                    travelTime=35,
                    crowdLevel="Medium",
                    explanation="There is severe congestion in the North Parking Lot (Gate C exit). We advise waiting 20 mins in the Stadium Club or exiting via Gate B and taking the South parking link road to avoid the gridlock.",
                    routeSteps=[
                        "Wait 20 mins inside the stadium concourse/lounges",
                        "Exit via Gate B (East)",
                        "Take the South Link Road bypass to the Parking structures"
                    ]
                )
                alternatives = [
                    ExitPlanModel(
                        gateName="Gate A (South)",
                        leaveStatus="Leave Now",
                        travelTime=40,
                        crowdLevel="Low",
                        explanation="Gate A is clear, but requires a long detour walk around the stadium to reach the parking lots.",
                        routeSteps=["Exit Gate A South", "Walk around East perimeter", "Arrive at Parking lot"]
                    ),
                    ExitPlanModel(
                        gateName="Gate C (West)",
                        leaveStatus="Leave Now",
                        travelTime=45,
                        crowdLevel="High",
                        explanation="Not recommended. Gate C leads directly into the core parking gridlock. Vehicles are moving at less than 5 km/h.",
                        routeSteps=["Exit Gate C West", "Proceed to vehicle", "Queue in parking exit lane"]
                    )
                ]
            else:
                primary = ExitPlanModel(
                    gateName="Gate A (South)",
                    leaveStatus="Leave Now",
                    travelTime=10,
                    crowdLevel="Low",
                    explanation="Gate A is completely clear with a 5-minute wait time. It offers the fastest route to the Metro and Bus terminals, bypassing the parking exit traffic near Gate C.",
                    routeSteps=[
                        "Exit Gate A (South) immediately",
                        "Follow the direct green pathway",
                        "Arrive at the Transit terminal"
                    ]
                )
                alternatives = [
                    ExitPlanModel(
                        gateName="Gate B (East)",
                        leaveStatus="Leave Now",
                        travelTime=18,
                        crowdLevel="Medium",
                        explanation="Gate B has moderate flow. A good option if you are seated in the East stands.",
                        routeSteps=["Exit Gate B East", "Follow transit signs", "Arrive at station"]
                    ),
                    ExitPlanModel(
                        gateName="Gate C (West)",
                        leaveStatus="Wait 15 Mins",
                        travelTime=32,
                        crowdLevel="High",
                        explanation="Avoid Gate C. Heavy pedestrian and vehicle conflict in this zone is slowing exit speeds down.",
                        routeSteps=["Exit Gate C West", "Proceed via outer bypass", "Arrive at transit terminal"]
                    )
                ]

        return ExitRecommendationModel(
            primary=primary,
            alternatives=alternatives
        )
