import SummaryResponse from "./summaryresponse.js";
import Count from "./count.js";

export default class CountSummaryResponse extends SummaryResponse {
    constructor() {
        super();
    }

	isEmpty() {
		return Count.isEmpty(this.getResponse());
	}
}
