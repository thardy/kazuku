// This class is kept simple for easier consumption.  You must not add any dependencies here.  If you need anything
//  injected, you need to change this to a service and provide it in the app module, inject into constructors, etc, etc.
export default class JsonUtils {
    // this method is a cheap, halfway-decent way to convert a string to json without blowing up if it's not json
    // Usage: const jsonBody = JsonUtils.tryParseJSON(error._body);
    static tryParseJSON (jsonString) {
        try {
            const o = JSON.parse(jsonString);

            // Handle non-exception-throwing cases:
            // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
            // but... JSON.parse(null) returns null, and typeof null === "object",
            // so we must check for that, too. Thankfully, null is falsey, so this suffices:
            if (o && typeof o === 'object') {
                return o;
            }
        }
        catch (e) { }

        return false;
    };
}

