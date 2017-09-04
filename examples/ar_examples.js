

/*
ARSimplestExample shows how to populate the stage group that is rendered on the stage 
*/
class ARSimplestExample extends XRExampleBase {
	constructor(domElement){
		super(domElement, false)
	}

	// Called during construction to allow the app to populate this.stageGroup (a THREE.Group)
	initializeStageGroup(){
		this.stageGroup.add(new THREE.AmbientLight('#FFF', 1))
		this.stageGroup.add(new THREE.DirectionalLight('#FFF', 0.6))
		loadObj('./models/', 'Axis.obj').then(node => {
			this.stageGroup.add(node)
		}).catch((...params) =>{
			console.error('could not load axis', ...params)
		})
	}

	// Called once per frame, before render to give the app a chance to update this.stageGroup (a THREE.Group)
	updateStageGroup(frame, stageCoordinateSystem, stagePose){
		// Spin the group to show this method is called
		//this.children[0].rotation.x += 0.005
		//this.children[0].rotation.y += 0.01
	}
}

class ARAnchorExample extends XRExampleBase {
	constructor(domElement){
		super(domElement, false)
		this.anchorsToAdd = [] // { node, x, y, z }
		this.anchoredNodes = [] // { anchorUID, node }

		this.addObjectButton = document.createElement('button')
		this.addObjectButton.setAttribute('class', 'add-object-button')
		this.addObjectButton.innerText = 'Add'
		this.el.appendChild(this.addObjectButton)
		this.addObjectButton.addEventListener('click', ev => {
			this.addAnchoredModel(this.createSceneGraphNode(), 0, 0, -0.5)
		})
	}

	// Called during construction
	initializeStageGroup(){
	}

	createSceneGraphNode(){
		let geometry = new THREE.BoxBufferGeometry(0.2, 0.2, 0.2)
		let material = new THREE.MeshPhongMaterial({ color: '#FF9999' })
		return new THREE.Mesh(geometry, material)
	}

	/*
		addAnchoredModel creates an anchor at (x,y,z) and positions the sceneGraphNode on the anchor from that point on
	*/
	addAnchoredModel(sceneGraphNode, x, y, z){
		// Save this info for use during the next render frame
		this.anchorsToAdd.push({
			node: sceneGraphNode,
			x: x, y: y, z: z
		})
	}

	// Called once per frame
	updateStageGroup(frame, stageCoordinateSystem, stagePose){
		// Create anchors for newly anchored nodes
		for(let anchorToAdd of this.anchorsToAdd){
			const anchor = new XRAnchor(new XRCoordinates(this.session.display, coordinateSystem, [anchorToAdd.x, anchorToAdd.y, anchorToAdd.z]))
			const anchorUID = frame.addAnchor(anchor)
			this.anchoredNodes.push({
				anchorUID: anchorUID,
				node: anchorToAdd.node
			})
			console.log("Added anchor", anchorUID)
		}
		this.anchorsToAdd = []
		
		// Update anchored node positions in the scene graph
		for(let anchoredNode of this.anchoredNodes){
			const anchor = frame.getAnchor(anchoredNode.anchorUID)
			if(anchor === null){
				console.error('Unknown anchor ID', anchoredNode.anchorId)
			} else {
				const localCoordinates = anchor.coordinates.getTransformedCoordinates(coordinateSystem)
				anchoredNode.node.matrix.fromArray(localCoordinates.poseMatrix)
			}
		}
	}
}