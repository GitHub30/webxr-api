import XRDisplay from './XRDisplay.js'
import XRSession from './XRSession.js'
import XRSessionCreateParameters from './XRSessionCreateParameters.js'
import Reality from './Reality.js'
import XRPointCloud from './XRPointCloud.js'
import XRLightEstimate from './XRLightEstimate.js'
import XRAnchor from './XRAnchor.js'
import XRPlaneAnchor from './XRPlaneAnchor.js'
import XRAnchorOffset from './XRAnchorOffset.js'
import XRStageBounds from './XRStageBounds.js'
import XRStageBoundsPoint from './XRStageBoundsPoint.js'
import XRPresentationFrame from './XRPresentationFrame.js'
import XRView from './XRView.js'
import XRViewport from './XRViewport.js'
import XRCartographicCoordinates from './XRCartographicCoordinates.js'
import XRCoordinateSystem from './XRCoordinateSystem.js'
import XRCoordinates from './XRCoordinates.js'
import XRViewPose from './XRViewPose.js'
import XRLayer from './XRLayer.js'
import XRWebGLLayer from './XRWebGLLayer.js'

import EventHandlerBase from './fill/EventHandlerBase.js'
import FlatDisplay from './display/FlatDisplay.js'
import CameraReality from './reality/CameraReality.js'

/*
XRPolyfill implements the window.XR functionality as a polyfill

Code below will check for window.XR and if it doesn't exist will install this polyfill,
so you can safely include this script in any page.
*/
class XRPolyfill extends EventHandlerBase {
	constructor(){
		super()
		window.XRDisplay = XRDisplay
		window.XRSession = XRSession
		window.XRSessionCreateParameters = XRSessionCreateParameters
		window.Reality = Reality
		window.XRPointCloud = XRPointCloud
		window.XRLightEstimate = XRLightEstimate
		window.XRAnchor = XRAnchor
		window.XRPlaneAnchor = XRPlaneAnchor
		window.XRAnchorOffset = XRAnchorOffset
		window.XRStageBounds = XRStageBounds
		window.XRStageBoundsPoint = XRStageBoundsPoint
		window.XRPresentationFrame = XRPresentationFrame
		window.XRView = XRView
		window.XRViewport = XRViewport
		window.XRCartographicCoordinates = XRCartographicCoordinates
		window.XRCoordinateSystem = XRCoordinateSystem
		window.XRCoordinates = XRCoordinates
		window.XRViewPose = XRViewPose
		window.XRLayer = XRLayer
		window.XRWebGLLayer = XRWebGLLayer


		// Reality instances that may be shared by multiple XRSessions
		this._sharedRealities = [new CameraReality(this)]
		this._privateRealities = []

		// Eventually RiftDisplay, ViveDisplay, DaydreamDisplay, GearVRDisplay, CardboardDisplay...
		this._displays = [new FlatDisplay(this, this._sharedRealities[0])]
	}

	getDisplays(){
		return new Promise((resolve, reject) => {
			resolve(this._displays)
		})
	}

	//attribute EventHandler ondisplayconnect;
	//attribute EventHandler ondisplaydisconnect;
}

/* Install XRPolyfill if window.XR does not exist */
if(typeof navigator.XR === 'undefined') navigator.XR = new XRPolyfill()
