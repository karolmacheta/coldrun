# coldrun

![alt text](https://github.com/karolmacheta/coldrun/blob/main/tests.jpg)

Task Desc:

The goal is to prepare a suite of automatic E2E tests for API application available at: http://qa-api-mock-3.eu-central-1.elasticbeanstalk.com/
The application implements the business requirements for Truck management.

Each Truck:

must have unique alphanumeric code

must have a name

must have a status included in the following set: "Out Of Service", "Loading", "To Job", "At Job", "Returning"

"Out Of Service" status can be set regardless of the current status of the Truck

Each status can be set if the current status of the Truck is "Out of service"

The remaining statuses can only be changed in the following order:
Loading -> To Job -> At Job -> Returning

When Truck has "Returning" status it can start "Loading" again.

may have a description

User must be able to perform CRUD operations on the trucks including the ability to query a filtered and sorted list of Trucks.