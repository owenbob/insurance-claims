
const { Contract } = require('fabric-contract-api');

class autoInsuranceClaim extends Contract {

    async initLedger(ctx) {
    console.log("Initialized");
    }
    
    async submitClaim(
        ctx, 
        policyNumber, 
        accidentLocation,
        VehicleMake,
        VehicleModel,
        VehicleRegistration,
        AccidentDescription,
        AccidentDate,
        AccidentTime,
        AccidentLocation
        ) {
            console.info('Fill in Claim');

            const claim = {
                docType: "claim",
                policy: policyNumber,
                location: accidentLocation,
                make: VehicleMake,
                model: VehicleModel,
                registration: VehicleRegistration,
                accidentDescription: AccidentDescription,
                accidentDate: AccidentDate,
                accidentTime: AccidentTime,
                accidentLocation: AccidentLocation
            };

            await ctx.stub.putState(policyNumber, Buffer.from(JSON.stringify(claim)));
            console.info('completed startClaim');
        }
    
    async retrieveClaim(ctx, policyNumber) {
        let policyBytes = await ctx.stub.getState(policyNumber);
            if (!policyBytes || policyBytes.toString().length <= 0) {
                throw new Error(policyNumber + ' does not exist: ');
        }
        console.info(`Policy -> ${policyBytes.toString()}`)
        return policyBytes;
        }
    
    async retrieveAllClaims() {
        let iterator = await ctx.stub.getStateByRange("", "")
        let allResults = [];
                while (true) {
                    let res = await iterator.next();
                    if (res.value && res.value.value.toString()) {
                        let jsonRes = {};
                        console.log(res.value.value.toString('utf8'));

                        jsonRes.Key = res.value.key;
                        try {
                            jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
                        } catch (err) {
                            console.log(err);
                            jsonRes.Record = res.value.value.toString('utf8');
                        }
                        allResults.push(jsonRes);
                    }
                    if (res.done) {
                        await iterator.close();
                        console.info(allResults);
                        return Buffer.from(JSON.stringify(allResults));
                    }
                }
    }
    
    async addPoliceRecord(
        ctx, 
        policyNumber, 
        policeRecord, 
        PoliceOfficerName, 
        PoliceOfficerBadgeNumber,
        ) {
        let policyBytes = await ctx.stub.getState(policyNumber);
            if (!policyBytes || policyBytes.toString().length <= 0) {
                throw new Error(policyNumber + ' does not exist: ');
            }
        let claim = JSON.parse(policyBytes.toString())
        claim["policeRecord"] = policeRecord
        claim["policeOfficerName"] = PoliceOfficerName
        claim["policeOfficerBadgeNumber"] = PoliceOfficerBadgeNumber
        await ctx.stub.putState(policyNumber, Buffer.from(JSON.stringify(claim)));
        console.info('completed addPoliceRecord');
    }

    async addAdjustorReport(ctx, policyNumber, adjustorReport) {
        const ClientIdentity = require('fabric-shim').ClientIdentity;
        let cid = new ClientIdentity(ctx.stub);


        let policyBytes = await ctx.stub.getState(policyNumber);
        if (!policyBytes || policyBytes.toString().length <= 0) {
            throw new Error(policyNumber + ' does not exist: ');
        }
        if (cid.assertAttributeValue('hf.role', 'Adjustor')) {
        
            let claim = JSON.parse(policyBytes.toString())
            claim["adjustorReport"] = adjustorReport
            await ctx.stub.putState(policyNumber, Buffer.from(JSON.stringify(claim)));
            console.info('completed addAdjustorReport');
        }
        else{
            throw new Error("You are not an Adjustor");
        }
    }


        async faultAssessment(ctx, policyNumber, assessmentReport) {
        const ClientIdentity = require('fabric-shim').ClientIdentity;
        let cid = new ClientIdentity(ctx.stub);


        let policyBytes = await ctx.stub.getState(policyNumber);
        if (!policyBytes || policyBytes.toString().length <= 0) {
            throw new Error(policyNumber + ' does not exist: ');
        }
        if (cid.assertAttributeValue('hf.role', 'Manager')) {
        
            let claim = JSON.parse(policyBytes.toString())
            claim["assessmentReport"] = assessmentReport
            await ctx.stub.putState(policyNumber, Buffer.from(JSON.stringify(claim)));
            console.info('completed faultAssessment');
        }
        else{
            throw new Error("You are not an Manager");
        }
    }

}