describe("Truck Management API Tests", () => {
    const apiUrl = "http://qa-api-mock-3.eu-central-1.elasticbeanstalk.com/";

    const timestamp = new Date().getTime();

    const sampleTruck = {
        code: `TRUCK${timestamp}`,
        name: "Test Truck",
        status: "OUT_OF_SERVICE",
        description: "Test Truck Description",
    };

    let sampleTruckId;

    it("should get a list of trucks", () => {
        cy.request("GET", `${apiUrl}trucks`).then((response) => {
            expect(response.status).to.equal(200);
        });
    });

    it("should get a list of trucks limited to 2 items", () => {
        cy.request("GET", `${apiUrl}trucks?limit=2`).then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body.length).to.equal(2);
        });
    });

    it("should create a new Truck without Description", () => {
        const sampleTruckNoDesc = {
            code: `TRUCK${timestamp+250}`,
            name: "Test Truck",
            status: "OUT_OF_SERVICE",
        };
        cy.request("POST", `${apiUrl}trucks`, sampleTruckNoDesc).then((response) => {
            sampleTruckNoDesc.id = response.body.id;
            expect(response.body).to.deep.equal(sampleTruckNoDesc);
        });
    });

    it("should not create a new Truck without Name", () => {

        const sampleTruckNoName = {
            code: `TRUCK${timestamp+500}`,
            status: "OUT_OF_SERVICE",
            description: "Test Truck Description",
        }

        cy.request({
            method: "POST",
            url: `${apiUrl}trucks`,
            body: sampleTruckNoName,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.equal(400);
        });
    });

    it("should create a new Truck", () => {
        cy.request("POST", `${apiUrl}trucks`, sampleTruck).then((response) => {
            sampleTruck.id = response.body.id;
            expect(response.body).to.deep.equal(sampleTruck);
            sampleTruckId = response.body.id;
        });
    });

    it("should retrieve the created Truck", () => {
        cy.request("GET", `${apiUrl}trucks/?code=${sampleTruck.code}`).then((response) => {
            expect(response.status).to.equal(200);
            // expect(response.body).to.deep.equal(sampleTruck);
        });
    });

    it("should update Truck status to 'LOADING'", () => {
        const updatedStatus = "LOADING";
        cy.request("PATCH", `${apiUrl}trucks/${sampleTruckId}`, {
            status: updatedStatus,
        }).then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal(updatedStatus);
        });
    });

    it("should update Truck status to 'TO_JOB'", () => {
        const updatedStatus = "TO_JOB";
        cy.request("PUT", `${apiUrl}trucks/${sampleTruckId}`, {
            status: updatedStatus,
        }).then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal(updatedStatus);
        });
    });

    it("should update Truck status to 'AT_JOB'", () => {
        const updatedStatus = "AT_JOB";
        cy.request("PUT", `${apiUrl}trucks/${sampleTruckId}`, {
            status: updatedStatus,
        }).then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal(updatedStatus);
        });
    });

    it("should update Truck status to 'RETURNING'", () => {
        const updatedStatus = "RETURNING";
        cy.request("PUT", `${apiUrl}trucks/${sampleTruckId}`, {
            status: updatedStatus,
        }).then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal(updatedStatus);
        });
    });

    it("should update Truck status to 'LOADING' after 'RETURNING'", () => {
        const updatedStatus = "LOADING";
        cy.request("PUT", `${apiUrl}trucks/${sampleTruckId}`, {
            status: updatedStatus,
        }).then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal(updatedStatus);
        });
    });

    it("should not allow changing truck with status 'RETURNING' to 'TO_JOB'", () => {
        cy.request({
            method: "PUT",
            url: `${apiUrl}trucks/${sampleTruckId}`,
            status: "TO_JOB",
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.equal(400);
            expect(response.body.status).to.equal('RETURNING');
        });
    });

    it("should update Truck description", () => {
        const updatedDescription = "Updated Truck Description";
        cy.request("PUT", `${apiUrl}trucks/${sampleTruckId}`, {
            description: updatedDescription,
        }).then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body.description).to.equal(updatedDescription);
        });
    });

    it("should not allow changing status to invalid values", () => {
        cy.request({
            method: "PUT",
            url: `${apiUrl}trucks/${sampleTruckId}`,
            status: "InvalidStatus",
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.equal(400);
        });
    });

    it("should handle invalid status when creating a Truck", () => {

        const truckWithInvalidStatus = {
            code: `TRUCK${timestamp+750}`,
            name: "Invalid Status Truck",
            status: "InvalidStatus",
            description: "Truck with an invalid status",
        };

        cy.request({
                method: "POST",
                url: `${apiUrl}trucks`,
                truckWithInvalidStatus,
                failOnStatusCode: false
            }

        ).then((response) => {
            expect(response.status).to.equal(400);
        });
    });

    it("should handle duplicate Truck code when creating a Truck", () => {
        cy.request({
            method: "POST",
            url: `${apiUrl}trucks`,
            sampleTruck,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.equal(400);
        });
    });

    it("should not update a non-existent Truck", () => {
        const nonExistentTruckCode = "NonExistentCode";
        const updatedStatus = "AT_JOB";
        cy.request({

                method: "PUT",
                url: `${apiUrl}trucks/000000000000`,
                status: "TO_JOB",
                failOnStatusCode: false
            }


        ).then((response) => {
            expect(response.status).to.equal(404);
        });
    });

    it("should query for a sorted list of trucks by ID", () => {
        cy.request("GET", `${apiUrl}trucks?sort=id`).then((response) => {
            expect(response.status).to.equal(200);

            const returnedTruckIds = response.body.map((truck) => truck.id);

            for (let i = 1; i < returnedTruckIds.length; i++) {
                expect(returnedTruckIds[i - 1]).to.be.lessThan(returnedTruckIds[i]);
            }
        });
    });

});