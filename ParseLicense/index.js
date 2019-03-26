module.exports = async function (context, req) {
    const logging = false;


    function formatDate(value) {
        // 8 digit date
        if (value.indexOf("/") === -1 && value.length === 8) {
            const month = parseInt(value.slice(0, 2), 10) - 1;
            const day = parseInt(value.slice(2, 4), 10);
            const year = parseInt(value.slice(4), 10);
            return new Date(year, month, day);
        }
        else if (value.slice(4, 5) === "/")
        // 10 digit date Canadian
        {
            // CCYY/MM/DD
            // 0123456789
            const year = parseInt(value.slice(0, 4), 10);
            const month = parseInt(value.slice(5, 7), 10) - 1;
            const day = parseInt(value.slice(8), 10);
            return new Date(year, month, day);
        }
        else if (value.slice(2, 3) === "/")
        // 10 digit date USA
        {
            // MM/DD/CCYY
            // 0123456789
            const year = parseInt(value.slice(6), 10);
            const month = parseInt(value.slice(0, 2), 10) - 1;
            const day = parseInt(value.slice(3, 5), 10);
            return new Date(year, month, day);
        }
    }

    var US_DRIVER_LICENSE_CODES = {
        DAA: { length: 40, field: "fullname" },
        DAB: { length: 40, field: "lastname" },
        DAC: { length: 40, field: "firstname" },
        DAD: { length: 40, field: "middlename" },
        DAE: { length: 3, field: "namesuffix" },
        DAF: { length: 5, field: "nameprefix" },
        DAG: { length: 35, field: "address_street" },
        DAH: { length: 35, field: "address_street2" },
        DAI: { length: 20, field: "address_city" },
        DAJ: { length: 2, field: "address_state" },
        DAK: { length: 11, field: "address_postal_code" },
        DAL: { length: 35, field: "home_address_street" },
        DAM: { length: 35, field: "home_address_street2" },
        DAN: { length: 20, field: "home_address_city" },
        DAO: { length: 2, field: "home_address_state" },
        DAP: { length: 11, field: "home_address_postalcode" },
        DAQ: { length: 25, field: "licensenumber" },
        DAR: { length: 4, field: "juris_vehicle_class" },
        DAS: { length: 10, field: "juris_restriction_codes" },
        DAT: { length: 5, field: "juris_endorsement_codes" },
        DAU: {
            length: 6, field: "height_in", format: (value) => {
                const inches = parseInt(value, 10);
                const r = inches % 12;
                const ft = (inches - r) / 12;
                let response = `${ft} ft`;
                if (r > 0) {
                    response = `${response}, ${r} in.`;
                }
                return response;
            },
        },
        DAV: { length: 6, field: "height_cm" },
        DAW: { length: 3, field: "weight_lb" },
        DAX: { length: 3, field: "weight_kg" },
        DAY: {
            length: 3, field: "eyecolor", format: (value) => {
                switch (value) {
                    case "BLK": return "Black";
                    case "BLU": return "Blue";
                    case "BRO": return "Brown";
                    case "DIC": return "Dichromatic";
                    case "GRY": return "Gray";
                    case "GRN": return "Green";
                    case "HAZ": return "Hazel";
                    case "MAR": return "Maroon";
                    case "PNK": return "Pink";
                    default: return "Unknown";
                }
            },
        },
        DAZ: {
            length: 12, field: "haircolor", format: (value) => {
                switch (value) {
                    case "BAL": return "Bald";
                    case "BLK": return "Black";
                    case "BLN": return "Blond";
                    case "BRO": return "Brown";
                    case "GRY": return "Gray";
                    case "RED": return "Red/Auburn";
                    case "SDY": return "Sandy";
                    case "WHI": return "White";
                    default: return "Unknown";
                }
            },
        },
        DBA: { length: 8, field: "expireson", format: formatDate },
        DBB: { length: 8, field: "bornon", format: formatDate },
        DBC: { length: 1, field: "sex" },
        DBD: { length: 8, field: "issuedon", format: formatDate },
        DBG: { length: 15, field: "alias_firstname" },
        DBH: { length: 10, field: "organ_donor" },
        DBI: { length: 1, field: "non_resident_indicator" },
        DBK: { length: 9, field: "ssn" },
        DBL: { length: 8, field: "alis_bornon", format: formatDate },
        DBM: { length: 9, field: "alias_ssn" },
        DBN: { length: 35, field: "alias_name" },
        DBO: { length: 35, field: "alias_lastname" },
        DBP: { length: 35, field: "alias_firstname" },
        DBQ: { length: 35, field: "alias_middlename" },
        DBR: { length: 3, field: "alias_namesuffix" },
        DBS: { length: 5, field: "alias_nameprefix" },
        DCA: { length: 4, field: "juris_vehicle_class" },
        DCB: { length: 10, field: "juris_restriction_codes" },
        DCD: { length: 5, field: "juris_endorsement_codes" },
        DCE: {
            length: 1, field: "weightrange", format: (value) => {
                switch (value) {
                    case "0": return "up to 31 kg (up to 70 lbs)";
                    case "1": return "32 – 45 kg (71 – 100 lbs)";
                    case "2": return "46 - 59 kg (101 – 130 lbs)";
                    case "3": return "60 - 70 kg (131 – 160 lbs)";
                    case "4": return "71 - 86 kg (161 – 190 lbs)";
                    case "5": return "87 - 100 kg (191 – 220 lbs)";
                    case "6": return "101 - 113 kg (221 – 250 lbs)";
                    case "7": return "114 - 127 kg (251 – 280 lbs)";
                    case "8": return "128 – 145 kg (281 – 320 lbs)";
                    case "9": return "146+ kg (321+ lbs)";
                    default: return "unknown weight range code";
                }
            },
        },
        DCF: { length: 25, field: "documentdiscriminator" },
        DCG: { length: 3, field: "issuing_country" },
        DCI: { length: 33, field: "birth_place" },
        DCJ: { length: 25, field: "audit_info" },
        DCK: { length: 25, field: "inventorycontrolnumber" },
        DCL: { length: 3, field: "race" },
        DCM: { length: 4, field: "std_vehicle_class" },
        DCN: { length: 5, field: "std_endorsement_code" },
        DCO: { length: 12, field: "std_restriction_code" },
        DCP: { length: 50, field: "juris_vehicle_class_desc" },
        DCQ: { length: 50, field: "juris_endorsement_code_desc" },
        DCR: { length: 50, field: "juris_restriction_code_desc" },
        DCS: { length: 40, field: "lastname" },
        DCT: { length: 40, field: "firstname" },
        DCU: { length: 5, field: "namesuffix" },
        DDA: { length: 1, field: "compliance_type" },
        DDB: { length: 8, field: "cardrevisedon", format: formatDate },
        DDC: { length: 8, field: "hazmatendorsement_expireson", format: formatDate },
        DDD: { length: 1, field: "limiteddurationdocumentindicator" },
        DDE: { length: 1, field: "lastname_trunc" },
        DDF: { length: 1, field: "firstname_trunc" },
        DDG: { length: 1, field: "middlename_trunc" },
        DDH: { length: 8, field: "date_age18", format: formatDate },
        DDI: { length: 8, field: "date_age19", format: formatDate },
        DDJ: { length: 8, field: "date_age21", format: formatDate },
        DDK: { length: 1, field: "organ_donor" },
        DDL: { length: 1, field: "veteran" },
        PAA: { length: 2, field: "permit_class_code" },
        PAB: { length: 8, field: "permit_expireson", format: formatDate },
        PAC: { length: 25, field: "permit_id" },
        PAD: { length: 8, field: "permit_issuedon" },
        PAE: { length: 10, field: "permit_restriction_code" },
        PAF: { length: 6, field: "permit_endorsement_code" },
        ZVA: { length: 2, field: "court_restriction_code" },
    };

    function ParseUSDriversLicensePDF417(prefix, scanData) {
        // definition source: https://www.aamva.org/DL-ID-Card-Design-Standard/

        var start = scanData.toUpperCase().indexOf("ANSI");
        if (start<0) start = scanData.toUpperCase().indexOF("AAMVA");
        if (start==-1) {
            start = scanData.indexOf("\n\r")+2;
        }
        scanData = scanData.substring(start).replace(/(\r\n|\n|\r)/gm, "");
        
        if (logging) context.log("Starting at character: "+start);

        if (logging) context.log("scanData: "+scanData);
        
        const data = {};
        const format = scanData.slice(0, 5).toUpperCase();
        const validFormat = format === "ANSI " || format === "AAMVA";
        if (!validFormat) {
            context.log("Format not valid.");
            return null;
        }
        data[prefix + "iin"] = scanData.slice(5, 11);
        data[prefix + "version"] = scanData.slice(11, 13);
        data[prefix + "jurisversion"] = scanData.slice(13, 15);
        data[prefix + "entries"] = scanData.slice(15, 17);
        data[prefix + "subfiletype"] = scanData.slice(17, 19);
        const offset = scanData.slice(19, 23);
        data[prefix + "offset"] = offset;
        data[prefix + "length"] = scanData.slice(23, 27);
        let index = 31;
        if (Number(offset) !== "NaN") {
            index = Number(offset);
        }
        while (index < scanData.length) {
            const code = scanData.slice(index, index + 3);
            const config = US_DRIVER_LICENSE_CODES[code];
            index += 3;
            if (!config) {
                while (!Number.isNaN(parseInt(scanData.slice(index, index + 1), 10))) {
                    index++;
                }
                continue;
            }
            let length = config.length;
            
            // non seperated handling of double length DCT
            if (code === "DCT") {
                if (scanData.slice(index + length, index + length + 1) === " ") {
                    length = 80;
                }
            }

            let value = scanData.slice(index, index + length).trim();
          
            // comma seperated DCT (with middle name)
            if (code === "DCT" && value.indexOf(",") !== -1) {
                const middle = value.slice(value.indexOf(",") + 1);
                value = value.slice(0, value.indexOf(","));
                data[prefix + "middlename"] = middle;
            }

            data[prefix + config.field] = value;
            index += length;

            // Get formatted field
            if (config.format) {
                data[prefix + config.field + "_f"] = config.format(value);
            }
        }
        return data;
    }

    if (logging) context.log('JavaScript HTTP trigger function processed a request.');

    if (req.query.name || (req.body && req.body.data)) {
            var parsedData = ParseUSDriversLicensePDF417("usdl_", req.body.data);
            
            if (logging) 
                for(var i in parsedData)
                    context.log(i+": "+parsedData[i]);
            
            context.res = {
                // status: 200, /* Defaults to 200 */
                body: parsedData,
                headers: {
                    'Content-Type': 'application/json'
                }
            };    
    }

    // echo back on no data.
    else {
        context.res = {
            status: 400,
            body: {
                TestData: "There was no data found to parse."
            },
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }

    context.done();
};