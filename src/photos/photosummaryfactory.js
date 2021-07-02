import CountSummaryResponse from "../quadtree/countsummaryresponse.js";

export default class PhotoSummaryFactory {

    createSummaryResponse(center) {
		let response = new CountSummaryResponse();
		response.setPoint(center);
		
		return response;
	}

}
