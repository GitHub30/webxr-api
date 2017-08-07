
## XR

	interface XR {
		Promise<sequence<XRDisplay>> getDisplays();

		attribute EventHandler ondisplayconnect;
		attribute EventHandler ondisplaydisconnect;
	};

_The interfaces with "VR" in the name have been changed to "XR" to indicate that they are used for both VR and AR._

## XRDisplay

	interface XRDisplay : EventTarget {
		readonly attribute DOMString displayName;
		readonly attribute boolean isExternal;

		Promise<boolean> supportsSession(XRSessionCreateParametersInit parameters);
		Promise<XRSession> requestSession(XRSessionCreateParametersInit parameters);

		attribute EventHandler ondeactivate;
	};

Each XRDisplay represents a method of using a specific type of hardware to render AR or VR realities and layers.

_The VRDevice interface was renamed XRDisplay to denote that it is specifically for graphical display types and not other types of devices._

A Pixel XL could expose several displays: a flat display, a magic window display, a Cardboard display, and a Daydream display.

A PC with an attached HMD could expose a flat display and the HMD.

A PC with no attached HMD could expose single a flat display.

### Todo

- calibration
- orientation reset

## XRSession

	interface XRSession : EventTarget {
		readonly attribute XRDisplay display;
		readonly attribute XRSessionCreateParameters createParameters;

		attribute double depthNear;
		attribute double depthFar;

		attribute XRLayer layer;
		attribute Reality reality; // Defaults to most recently used Reality


		Reality createEmptyReality(DOMString name, boolean shared=false);
		Promise<sequence <Reality>> getRealities();
		Promise<boolean> requestRealityChange(Reality reality); // resolves true if the request is accepted

		Promise<XRFrameOfReference?> requestFrameOfReference(XRFrameOfReferenceType type);

		long requestFrame(XRFrameRequestCallback callback);
		void cancelFrame(long handle);

		Promise<void> endSession();

		attribute EventHandler onblur;
		attribute EventHandler onfocus;
		attribute EventHandler onresetpose;
		attribute EventHandler onended;
		attribute EventHandler onrealitychanged;
	};

A script that wishes to make use of an XRDisplay can request an XRSession. This session provides a list of the available realities that the script may request as well as access to the frame of reference,  and sampling frames.

_The XRSession plays the same basic role as the VRSession, with the addition of Reality management._

## Reality

	interface Reality : EventTarget {
		readonly atttribute DOMString realityName;
		readonly attribute XRCoordinates stageLocation;
		readonly attribute isShared; // True if sessions other than the creator can access this Reality
		readonly attribute isPassthrough; // True if the Reality is a view of the outside world, not a fully VR

		Promise<XRLayer?> requestLayer(); // Null if the UA refuses access from this script context to the layer for this reality

		Promise<boolean> changeStageLocation(XRCoordinates coordinates);
		Promise<boolean> resetStageLocation();

		attribute EventHandler onchange;
	};

A Reality represents a view of the world, be it the real world via sensors or a virtual world that is rendered with WebGL or WebGPU.

Realities can be shared among XRSessions, with multiple scripts rendering into their separate XRLayer.context that are then composited by the UA with the Reality layer being the rearmost layer.

A script can request an empty Reality from the session in order to create a fully virtual environment by requesting and then rendering into the Reality's XRLayer.

### Todo
- Need to expose the stage origin and bounds
- configuration (e.g. change white balance on camera input, change options on map view)

## XRPointCloud

	interface XRPointCloud {
		readonly attribute Float32Array points;
	}

## XRLightEstimate

	interface XRLightEstimate {
		readonly attribute double ambientIntensity;
		readonly attribute double ambientColorTemperature;
	}

## XRAnchor

	interface XRAnchor {
		readonly attribute DOMString uid;
		readonly attribute XRCoordinates coordinates;
	}

## XRPlaneAnchor

	interface XRPlaneAnchor : XRAnchor {
		readonly attribute Float32Array orientation; // quaternion?
		readonly attribute double width;
		readonly attribute double length;
	}

## XRManifold

	interface XRManifold {
		TBD
	}

### Todo

- expose the manifold vertices and edges as well as its extent (FOV only, full sphere, etc)

## XRPresentationFrame

	interface XRPresentationFrame {
		readonly attribute FrozenArray<XRView> views;

		readonly attribute boolean hasPointCloud;
		readonly attribute XRPointCloud pointCloud;

		readonly attribute boolean hasManifold;
		readonly attribute XRManifold manifold;

		readonly attribute boolean hasLightEstimate;
		readonly attribute XRLightEstimate lightEstimate;
		
		long addAnchor(XRAnchor anchor);
		void removeAnchor(DOMString uid);
		XRAnchor? getAnchor(DOMString uid);
		<sequence <XRAnchor>> getAnchors();

		XRDisplayPose? getDisplayPose(XRCoordinateSystem coordinateSystem);
	};

_The XRPresentationFrame differs from the VRPresentationFrame with the addition of the point cloud, manifold, light estimates, and anchor management._

### Todo

- access camera image buffer aor texture

## XRView

	interface XRView {
		readonly attribute XREye eye;
		readonly attribute Float32Array projectionMatrix;

		XRViewport? getViewport(XRLayer layer);
	};

## XRViewport

	interface XRViewport {
		readonly attribute long x;
		readonly attribute long y;
		readonly attribute long width;
		readonly attribute long height;
	};


## XRCartographicCoordinates

	interface XRCartographicCoordinates {
		attribute double latitude;
		attribute double longitude;
		attribute double positionAccuracy;
		attribute double altitude;
		attribute double altitudeAccuracy;
		attribute Float32Array orientation; // quaternion from 0,0,0,1 EUS?
	}

The XRCartographicCoordinates are used in conjunction with the XRCoordinateSystem to represent a frame of reference that may optionally be positioned in relation to the nearest planet.

## XRCoordinateSystem

	interface XRCoordinateSystem {
		readonly attribute XRCartographicCoordinates? mapLocation;

		Float32Array? getTransformTo(XRCoordinateSystem other);
	};

## XRFrameOfReference

	enum XRFrameOfReferenceType { "headModel", "eyeLevel", "stage", "spatial" };

	interface XRFrameOfReference : XRCoordinateSystem {
		readonly attribute XRStageBounds? bounds;
		attribute EventHandler onboundschange;
	};


## XRCoordinates

	interface XRCoordinates {
		attribute XRCoordinateSystem coordinateSystem;
		attribute double x;
		attribute double y;
		attribute double z;

		XRCoordinates? getTransformedCoordinates(otherCoordinateSystem)
	};

## XRDisplayPose

	interface XRDisplayPose {
		readonly attribute Float32Array poseModelMatrix;

		Float32Array getViewMatrix(XRView view);
	};

## XRLayer

	interface XRLayer : EventTarget {
		readonly attribute boolean hasFocus;

		attribute EventHandler onfocus;
		attribute EventHandler onblur;
	};

The focus and blur events are separate from the session events with the same names. The UA selects a single layer at a time to receive focus for input events, usually based on actions taken by the user.

### Todo

- misbehavior: visual, CPU, GPU, network

## XRWebGLLayer

	typedef (WebGLRenderingContext or WebGL2RenderingContext) XRWebGLRenderingContext;

	[Constructor(XRSession session, XRWebGLRenderingContext context, optional XRWebGLLayerInit layerInit)]

	interface XRWebGLLayer : XRLayer {
		readonly attribute XRWebGLRenderingContext context;

		readonly attribute boolean antialias;
		readonly attribute boolean depth;
		readonly attribute boolean stencil;
		readonly attribute boolean alpha;
		readonly attribute boolean multiview;

		readonly attribute WebGLFramebuffer framebuffer;
		readonly attribute long framebufferWidth;
		readonly attribute long framebufferHeight;

		void requestViewportScaling(double viewportScaleFactor);
	};


