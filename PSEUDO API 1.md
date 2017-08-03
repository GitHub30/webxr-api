
## XR

	interface XR {
		Promise<sequence<XRDisplay>> getDisplays();
	};


## XRDisplay

	interface XRDisplay : EventTarget {
		readonly attribute DOMString displayName;
		readonly attribute boolean isExternal;

		Promise<boolean> supportsSession(XRSessionCreateParametersInit parameters);
		Promise<XRSession> requestSession(XRSessionCreateParametersInit parameters);

		attribute EventHandler ondeactivate;
	};

### Todo

- calibration and orientation reset

## Reality

	interface Reality : EventTarget {
		readonly atttribute DOMString realityName;
		readonly attribute XRCoordinates stageLocation;
		readonly attribute isPassthrough; // True if the Reality is a view of the outside world, not a fully VR

		readonly attribute boolean hasPointCloud;
		readonly attribute boolean hasLightEstimate;

		Promise<boolean> requestStageLocation(float x, float y float z, XRCoordinates)
		Promise<boolean> requestResetStageLocation()

		Promise<XRPointCloud> getPointCloud()

		Promise<XRLightEstimate> getLightEstimate()

		attribute EventHandler onchange;
	};

### Todo

- requesting a different reality data (e.g. camera image, VR "empty" reality, or a map "street view")
- configuration
- offer a manifold aor a point cloud?
- picking


## XRPointCloud

	interface XRPointCloud {
		readonly attribute Float32Array points;
	}

## XRLightEstimate

	interface XRLightEstimate {
		readonly attribute float ambientIntensity;
		readonly attribute float ambientColorTemperature;
	}

## XRAnchor

	interface XRAnchor {
		readonly attribute long id;
		readonly attribute Float32Array center; // x, y, z
	}

## XRPlaneAnchor

	interface XRPlaneAnchor : XRAnchor {
		readonly attribute Float32Array orientation; // quaternion?
		readonly attribute Float32Array extent; // width, length
	}

## XRSession

	interface XRSession : EventTarget {
		readonly attribute XRDisplay display;
		readonly attribute XRSessionCreateParameters createParameters;

		attribute double depthNear;
		attribute double depthFar;

		attribute XRLayer layer;
		attribute Reality reality;

		Promise<sequence <Reality>> getRealities();

		Promise<XRFrameOfReference> requestFrameOfReference(XRFrameOfReferenceType type);

		long requestFrame(XRFrameRequestCallback callback);
		void cancelFrame(long handle);

		long addAnchor(XRAnchor anchor);
		void removeAnchor(long id);

		Promise<void> endSession();

		attribute EventHandler onblur;
		attribute EventHandler onfocus;
		attribute EventHandler onresetpose;
		attribute EventHandler onended;
	};

## XRPresentationFrame

	interface XRPresentationFrame {
		readonly attribute FrozenArray<XRView> views;

		XRDisplayPose? getDisplayPose(XRCoordinateSystem coordinateSystem);
	};

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

## XRCoordinateSystem

	interface XRCoordinateSystem: EventTarget {
		readonly attribute Coordinates? coordinates; // https://dev.w3.org/geo/api/spec-source.html#coordinates

		Float32Array? getTransformTo(XRCoordinateSystem other);
	};

## XRCoordinates

	interface XRCoordinates {
		readonly attribute XRCoordinateSystem
		attribute float x;
		attribute float y;
		attribute float z;
	}

## XRDisplayPose

	interface XRDisplayPose {
		readonly attribute Float32Array poseModelMatrix;

		Float32Array getViewMatrix(XRView view);
	};

## XRLayer

	interface XRLayer {};

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

### Todo

- focus / blur
- misbehavior

