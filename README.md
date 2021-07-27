
#  Auto insurance claim 

##  State Machine
![state machine](https://user-images.githubusercontent.com/30471763/127201454-6a2ee0b6-9ef8-4f4b-92dc-df7c0cfe534a.png)


## State data
- States [Accident, Claim, Claim waiting decision, Benefits]
- ***Accident***
- ***Claim***
        - Policy Number
        - Vehicle details(make, model, registration, license plate)
        - Accident Details(Driver's name & license number )
        - Name of police officer
        - Badge number of police officer
        - Accident description
        - Date, time and location of accident
- ***Claim waiting decision***
        - Policy Number
- ***Benefits***
        - Policy Number

## Transition functions
```    
fillInClaim(
    PolicyNumber
    VehicleMake
    VehicleModel
    VehicleRegistration
    VehicleLicensePlate
    DriverName
    DriverLicenseNumber
    PoliceOfficerName
    PoliceOfficerBadgeNumber
    AccidentDescription
    AccidentDate
    AccidentTime
    AccidentLocation
    )

submitClaim(PolicyNumber)
claimAdjustment(PolicyNumber)
faultAdjustment(PolicyNumber)
approved(PolicyNumber)
```
## Roles
- Claimant
- Claim Adjuster
- Agent
- Broker

