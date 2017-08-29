import XRAnchor from './XRAnchor.js'

/*
XRPresentationFrame provides all of the values needed to render a single frame of an XR scene to the XRDisplay.
*/
export default class XRPresentationFrame {
	constructor(session){
		this._session = session
	}

	get views(){
		//readonly attribute FrozenArray<XRView> views;
		return this._session._display._views
	}

	get hasPointCloud(){
		//readonly attribute boolean hasPointCloud;
		return false
	}

	get pointCloud(){
		//readonly attribute XRPointCloud? pointCloud;
		return null
	}

	get hasLightEstimate(){
		//readonly attribute boolean hasLightEstimate;
		return false
	}

	get lightEstimate(){
		//readonly attribute XRLightEstimate? lightEstimate;
		return null
	}

	get anchors(){
		//readonly attribute sequence<XRAnchor> anchors;
		let results = []
		for(let value of this._session.reality._anchors.values()){
			results.push(value)
		}
		return results
	}

	addAnchor(anchor){
		//DOMString? addAnchor(XRAnchor anchor);
		return this._session.reality._addAnchor(anchor)
	}

	findAnchor(coordinates){
		// XRAnchorOffset? findAnchor(XRCoordinates); // cast a ray to find or create an anchor at the first intersection in the Reality
		return this._session.reality._findAnchor(coordinates)
	}

	removeAnchor(uid){
		// void removeAnchor(DOMString uid);
		return this._session.reality._removeAnchor(uid)
	}

	getAnchor(uid){
		// XRAnchor? getAnchor(DOMString uid);
		return this._session.reality._getAnchor(uid)
	}

	getCoordinateSystem(...types){
		// XRCoordinateSystem? getCoordinateSystem(...XRFrameOfReferenceType types); // Tries the types in order, returning the first match or null if none is found
		return this._session._getCoordinateSystem(...types)
	}

	getViewPose(coordinateSystem){
		// XRViewPose? getViewPose(XRCoordinateSystem coordinateSystem);
		switch(coordinateSystem.type){
			case XRCoordinateSystem.HEAD_MODEL:
				return this._session._display._headPose
			case XRCoordinateSystem.EYE_LEVEL:
				return this._session._display._eyeLevelPose
			case XRCoordinateSystem.STAGE:
				return this._session._display._stagePose
			default:
				return null
		}
	}
}