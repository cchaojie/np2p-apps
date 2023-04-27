const EPS = 0.00001;


//var mouseInterface = false;
//var touchInterface = false;


// create a scene with a better shadow
createScene();


scene.remove(light)
renderer.shadowMap.type = THREE.PCFSoftShadowMap;


// PointLight and DirectionaLight make problems with older GPU
var light = new THREE.SpotLight('white', 0.5);
light.position.set(0, 100, 50);
light.penumbra = 1;
light.shadow.mapSize.width = Math.min(4 * 1024, renderer.capabilities.maxTextureSize / 2);
light.shadow.mapSize.height = light.shadow.mapSize.width;
light.shadow.radius = 2;
light.castShadow = true;
scene.add(light);


var controls = new THREE.OrbitControls(camera, renderer.domElement);


// create gauge indicator
var gauge = new THREE.Mesh(
		new THREE.CircleGeometry(10, 32, 9 / 4 * Math.PI, Math.PI / 2),
		new THREE.MeshPhongMaterial(
		{
			side: THREE.DoubleSide,
			color: 'blue',
			transparent: true,
			opacity: 0.75,
			alphaMap: gaugeTexture()
		})
	),
	gaugeMaterial = new THREE.MeshBasicMaterial(
	{
		color: 'navy'
	});
	
gauge.add(new THREE.Mesh(new THREE.TorusGeometry(10, 0.1, 8, 32, Math.PI / 2).rotateZ(Math.PI / 4), gaugeMaterial));
gauge.add(new THREE.Mesh(new THREE.ConeGeometry(0.7, 3, 6).translate(-10, 0, 0).rotateZ(5 * Math.PI / 4), gaugeMaterial));
gauge.add(new THREE.Mesh(new THREE.ConeGeometry(0.7, 3, 6).translate(10, 0, 0).rotateZ(3 * Math.PI / 4), gaugeMaterial));


function gaugeTexture(size = 256)
{
	var canvas = document.createElement('canvas');
	canvas.width = size;
	canvas.height = size;
	var r = size / 2;

	var ctx = canvas.getContext('2d');
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, size, size);

	var grd = ctx.createRadialGradient(r, r, r / 2, r, r, r);
	grd.addColorStop(0, "black");
	grd.addColorStop(1, "gray");

	// Fill with gradient
	ctx.fillStyle = grd;
	ctx.fillRect(1, 1, size - 2, size - 2);

	var start = Math.PI,
		end = 2 * Math.PI;

	ctx.strokeStyle = 'white';
	ctx.lineWidth = 1;
	ctx.beginPath();
	for (var rr = r; rr > 0; rr -= 25)
		ctx.arc(size / 2, size / 2, rr, start, end);

	for (var i = 0; i <= 12; i++)
	{
		ctx.moveTo(r, r);
		var a = start + i / 12 * (end - start);
		ctx.lineTo(r + r * Math.cos(a), r + r * Math.sin(a));
	}
	ctx.stroke();

	var texture = new THREE.CanvasTexture(canvas, THREE.UVMapping);
	texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
	texture.repeat.set(1, 1);

	return texture;
}


// name body parts and their motions
var names = [
	['body', '倾斜', '转动', '弯曲'],
	['pelvis', '倾斜', '转动', '弯曲'],
	['torso', '倾斜', '转动', '弯曲'],
	['neck', '倾斜', '转动', '点头'],
	['head', '倾斜', '转动', '点头'],
	['l_leg', '叉开', '转动', '抬起'],
	['l_knee', '左右', '旋转', '弯曲'],
	['l_ankle', '倾斜', '转动', '弯曲'],
	['l_arm', '叉开', '转动', '抬起'],
	['l_elbow', '左右', '旋转', '弯曲'],
	['l_wrist', '倾斜', '转动', '弯曲'],
	['l_finger_0', '叉开', '转动', '弯曲'],
	['l_finger_1', '叉开', '旋转', '弯曲'],
	['l_finger_2', '叉开', '旋转', '弯曲'],
	['l_finger_3', '叉开', '旋转', '弯曲'],
	['l_finger_4', '叉开', '旋转', '弯曲'],
	['l_mid_0', '左右', '旋转', '弯曲'],
	['l_mid_1', '左右', '旋转', '弯曲'],
	['l_mid_2', '左右', '旋转', '弯曲'],
	['l_mid_3', '左右', '旋转', '弯曲'],
	['l_mid_4', '左右', '旋转', '弯曲'],
	['l_tip_0', '左右', '旋转', '弯曲'],
	['l_tip_1', '左右', '旋转', '弯曲'],
	['l_tip_2', '左右', '旋转', '弯曲'],
	['l_tip_3', '左右', '旋转', '弯曲'],
	['l_tip_4', '左右', '旋转', '弯曲'],
	['r_leg', '叉开', '转动', '抬起'],
	['r_knee', '左右', '旋转', '弯曲'],
	['r_ankle', '倾斜', '转动', '弯曲'],
	['r_arm', '叉开', '转动', '抬起'],
	['r_elbow', '左右', '旋转', '弯曲'],
	['r_wrist', '倾斜', '转动', '弯曲'],
	['r_finger_0', '叉开', '转动', '弯曲'],
	['r_finger_1', '叉开', '旋转', '弯曲'],
	['r_finger_2', '叉开', '旋转', '弯曲'],
	['r_finger_3', '叉开', '旋转', '弯曲'],
	['r_finger_4', '叉开', '旋转', '弯曲'],
	['r_mid_0', '左右', '旋转', '弯曲'],
	['r_mid_1', '左右', '旋转', '弯曲'],
	['r_mid_2', '左右', '旋转', '弯曲'],
	['r_mid_3', '左右', '旋转', '弯曲'],
	['r_mid_4', '左右', '旋转', '弯曲'],
	['r_tip_0', '左右', '旋转', '弯曲'],
	['r_tip_1', '左右', '旋转', '弯曲'],
	['r_tip_2', '左右', '旋转', '弯曲'],
	['r_tip_3', '左右', '旋转', '弯曲'],
	['r_tip_4', '左右', '旋转', '弯曲'],
];


var models = [];
var model = null;

function addModel( )
{
	model = new Male();
	models.push( model );
	
	model.l_mid_0 = model.l_finger_0.mid;
	model.l_mid_1 = model.l_finger_1.mid;
	model.l_mid_2 = model.l_finger_2.mid;
	model.l_mid_3 = model.l_finger_3.mid;
	model.l_mid_4 = model.l_finger_4.mid;
	
	model.r_mid_0 = model.r_finger_0.mid;
	model.r_mid_1 = model.r_finger_1.mid;
	model.r_mid_2 = model.r_finger_2.mid;
	model.r_mid_3 = model.r_finger_3.mid;
	model.r_mid_4 = model.r_finger_4.mid;
	
	model.l_tip_0 = model.l_finger_0.tip;
	model.l_tip_1 = model.l_finger_1.tip;
	model.l_tip_2 = model.l_finger_2.tip;
	model.l_tip_3 = model.l_finger_3.tip;
	model.l_tip_4 = model.l_finger_4.tip;
	
	model.r_tip_0 = model.r_finger_0.tip;
	model.r_tip_1 = model.r_finger_1.tip;
	model.r_tip_2 = model.r_finger_2.tip;
	model.r_tip_3 = model.r_finger_3.tip;
	model.r_tip_4 = model.r_finger_4.tip;
	
	for (var nameData of names)
	{
		var name = nameData[0];
		for (var part of model[name].children[0].children)
			part.name = name;
		for (var part of model[name].children[0].children[0].children)
			part.name = name;
		if (model[name].children[0].children[1])
			for (var part of model[name].children[0].children[1].children)
				part.name = name;
		model[name].nameUI = {
			x: nameData[1],
			y: nameData[2],
			z: nameData[3]
		};
	}

	renderer.render(scene, camera);
}

addModel( );





var mouse = new THREE.Vector2(), // mouse 3D position
	mouseButton = undefined, // pressed mouse buttons
	raycaster = new THREE.Raycaster(), // raycaster to grab body part
	dragPoint = new THREE.Mesh(), // point of grabbing
	obj = undefined; // currently selected body part


var cbInverseKinematics = document.getElementById('inverse-kinematics'),
	cbBiologicalConstraints = document.getElementById('biological-constraints'),
	cbRotZ = document.getElementById('rot-z'),
	cbRotX = document.getElementById('rot-x'),
	cbRotY = document.getElementById('rot-y'),
	cbMovX = document.getElementById('mov-x'),
	cbMovY = document.getElementById('mov-y'),
	cbMovZ = document.getElementById('mov-z'),
	btnGetPosture = document.getElementById('gp'),
	btnSetPosture = document.getElementById('sp'),
	btnExportPosture = document.getElementById('ep'),
	btnGetImage = document.getElementById('gimg'),
	btnGetAnime = document.getElementById('ganime'),
	btnGetVideo = document.getElementById('gvideo'),
	btnAddModel = document.getElementById('am'),
	btnRemoveModel = document.getElementById('rm'),
	divKeyFrames = jQuery('#kframes');

var animeFrames=[];
var animeFrameImgs=[];
var animeIndex=0;
var isAnime=false;


// set up event handlers
document.addEventListener('pointerdown', onPointerDown);
document.addEventListener('pointerup', onPointerUp);
document.addEventListener('pointermove', onPointerMove);

cbRotZ.addEventListener('click', processCheckBoxes);
cbRotX.addEventListener('click', processCheckBoxes);
cbRotY.addEventListener('click', processCheckBoxes);
cbMovX.addEventListener('click', processCheckBoxes);
cbMovY.addEventListener('click', processCheckBoxes);
cbMovZ.addEventListener('click', processCheckBoxes);


btnGetPosture.addEventListener('click', getPosture);
btnSetPosture.addEventListener('click', setPosture);
btnExportPosture.addEventListener('click', exportPosture);

btnGetImage.addEventListener('click', getImage);
btnGetAnime.addEventListener('click', getAnime);
btnGetVideo.addEventListener('click', getVideo);

btnAddModel.addEventListener('click', addModel);
btnRemoveModel.addEventListener('click', removeModel);


controls.addEventListener('start', function ()
{
	renderer.setAnimationLoop(drawFrame);
});


controls.addEventListener('end', function ()
{
	renderer.setAnimationLoop(null);
	renderer.render(scene, camera);
});


window.addEventListener('resize', function ()
{
	renderer.render(scene, camera);
});


function processCheckBoxes(event)
{
	if (event)
	{
		if (event.target.checked)
		{
			cbRotX.checked = cbRotY.checked = cbRotY.checked = cbRotZ.checked = cbMovX.checked = cbMovY.checked = cbMovZ.checked = false;
			event.target.checked = true;
		}
	}

	if (!obj) return;

	if (cbRotZ.checked)
	{
		obj.rotation.reorder('XYZ');
	}
	
	if (cbRotX.checked)
	{
		obj.rotation.reorder('YZX');
	}
	
	if (cbRotY.checked)
	{
		obj.rotation.reorder('ZXY');
	}
}


function onPointerUp(event)
{
	controls.enabled = true;
	mouseButton = undefined;
	deselect();
	renderer.setAnimationLoop(null);
	renderer.render(scene, camera);
}


function select(object)
{
	deselect();
	obj = object;
	obj?.select(true);
}


function deselect()
{
	gauge.parent?.remove(gauge);
	obj?.select(false);
	obj = undefined;
}


function onPointerDown(event)
{
	userInput(event);

	gauge.parent?.remove(gauge);
	dragPoint.parent?.remove(dragPoint);

	raycaster.setFromCamera(mouse, camera);

	var intersects = raycaster.intersectObjects(models, true);

	if (intersects.length && (intersects[0].object.name || intersects[0].object.parent.name))
	{
		controls.enabled = false;

		var scanObj;
		for( scanObj=intersects[0].object; !(scanObj instanceof Mannequin) && !(scanObj instanceof THREE.Scene); scanObj = scanObj?.parent )
		{
		}
		
		if( scanObj instanceof Mannequin ) model = scanObj;

		var name = intersects[0].object.name || intersects[0].object.parent.name;

		if (name == 'neck') name = 'head';
		if (name == 'pelvis') name = 'body';

		select(model[name]);

		document.getElementById('rot-x-name').innerHTML = model[name].nameUI.x || 'N/A';
		document.getElementById('rot-y-name').innerHTML = model[name].nameUI.y || 'N/A';
		document.getElementById('rot-z-name').innerHTML = model[name].nameUI.z || 'N/A';

		dragPoint.position.copy(obj.worldToLocal(intersects[0].point));
		obj.imageWrapper.add(dragPoint);

		if (!cbMovX.checked && !cbMovY.checked && !cbMovZ.checked) obj.imageWrapper.add(gauge);
		gauge.position.y = (obj instanceof Ankle) ? 2 : 0;

		processCheckBoxes();
	}
	renderer.setAnimationLoop(drawFrame);
}


function relativeTurn(joint, rotationalAngle, angle)
{
	if ( rotationalAngle.startsWith( 'position.' ) )
	{
		// it is translation, not rotation
		rotationalAngle = rotationalAngle.split('.').pop();
		joint.position[rotationalAngle] += angle;
		return;
	}

	if (joint.biologicallyImpossibleLevel)
	{
		if (cbBiologicalConstraints.checked)
		{
			// there is a dedicated function to check biological possibility of joint
			var oldImpossibility = joint.biologicallyImpossibleLevel();

			joint[rotationalAngle] += angle;
			joint.updateMatrix();
			joint.updateWorldMatrix(true); // ! important, otherwise get's stuck

			var newImpossibility = joint.biologicallyImpossibleLevel();

			if (newImpossibility > EPS && newImpossibility >= oldImpossibility - EPS)
			{
				// undo rotation
				joint[rotationalAngle] -= angle;
				return;
			}
		}
		else
		{
			joint.biologicallyImpossibleLevel();
			joint[rotationalAngle] += angle;
		}
		// keep the rotation, it is either possible, or improves impossible situation
	}
	else
	{
		// there is no dedicated function, test with individual rotation range

		var val = joint[rotationalAngle] + angle,
			min = joint.minRot[rotationalAngle],
			max = joint.maxRot[rotationalAngle];

		if (cbBiologicalConstraints.checked || min == max)
		{
			if (val < min - EPS && angle < 0) return;
			if (val > max + EPS && angle > 0) return;
			if (min == max) return;
		}

		joint[rotationalAngle] = val;
	}
	joint.updateMatrix();
} // relativeTurn


function kinematic2D(joint, rotationalAngle, angle, ignoreIfPositive)
{
	// returns >0 if this turn gets closer

	// swap Z<->X for wrist
	if (joint instanceof Wrist)
	{
		if (rotationalAngle == 'x')
			rotationalAngle = 'z';
		else if (rotationalAngle == 'z')
			rotationalAngle = 'x';
	}

	var screenPoint = new THREE.Vector3().copy(dragPoint.position);
	screenPoint = obj.localToWorld(screenPoint).project(camera);

	var distOriginal = mouse.distanceTo(screenPoint),
		oldAngle = joint[rotationalAngle];

	if (joint instanceof Head)
	{ // head and neck
		oldParentAngle = joint.parentJoint[rotationalAngle];
		relativeTurn(joint, rotationalAngle, angle / 2);
		relativeTurn(joint.parentJoint, rotationalAngle, angle / 2);
		joint.parentJoint.updateMatrixWorld(true);
	}
	else
	{
		relativeTurn(joint, rotationalAngle, angle);
	}
	joint.updateMatrixWorld(true);

	screenPoint.copy(dragPoint.position);
	screenPoint = obj.localToWorld(screenPoint).project(camera);

	var distProposed = mouse.distanceTo(screenPoint),
		dist = distOriginal - distProposed;

	if (ignoreIfPositive && dist > 0) return dist;

	joint[rotationalAngle] = oldAngle;
	if (joint instanceof Head)
	{ // head and neck
		joint.parentJoint[rotationalAngle] = oldParentAngle;
	}
	joint.updateMatrixWorld(true);

	return dist;
}


function inverseKinematics(joint, rotationalAngle, step)
{
	// try going in postive or negative direction
	var kPos = kinematic2D(joint, rotationalAngle, 0.001),
		kNeg = kinematic2D(joint, rotationalAngle, -0.001);

	// if any of them improves closeness, then turn in this direction
	if (kPos > 0 || kNeg > 0)
	{
		if (kPos < kNeg) step = -step;
		kinematic2D(joint, rotationalAngle, step, true);
	}
}


function animate(time)
{
	// no selected object
	if (!obj || !mouseButton) return;

	var elemNone = !cbRotZ.checked && !cbRotX.checked && !cbRotY.checked && !cbMovX.checked && !cbMovY.checked && !cbMovZ.checked,
		spinA = (obj instanceof Ankle) ? Math.PI / 2 : 0;

	gauge.rotation.set(0, 0, -spinA);
	if (cbRotX.checked || elemNone && mouseButton & 0x2) gauge.rotation.set(0, Math.PI / 2, 2 * spinA);
	if (cbRotY.checked || elemNone && mouseButton & 0x4) gauge.rotation.set(Math.PI / 2, 0, -Math.PI / 2);

	var joint = (cbMovX.checked || cbMovY.checked || cbMovZ.checked) ? model.body : obj;
	
	do {
		for (var step = 5; step > 0.1; step *= 0.75)
		{
			if (cbRotZ.checked || elemNone && (mouseButton & 0x1))
				inverseKinematics(joint, 'z', step);
			if (cbRotX.checked || elemNone && (mouseButton & 0x2))
				inverseKinematics(joint, 'x', step);
			if (cbRotY.checked || elemNone && (mouseButton & 0x4))
				inverseKinematics(joint, 'y', step);

			if (cbMovX.checked)
				inverseKinematics(joint, 'position.x', step);
			if (cbMovY.checked)
				inverseKinematics(joint, 'position.y', step);
			if (cbMovZ.checked)
				inverseKinematics(joint, 'position.z', step);
		}

		joint = joint.parentJoint;
	}
	while (joint && !(joint instanceof Mannequin) && !(joint instanceof Pelvis) && !(joint instanceof Torso) && cbInverseKinematics.checked);
}


function onPointerMove(event)
{
	if (obj) userInput(event);
}


function userInput(event)
{
	//event.preventDefault();

	mouseButton = event.buttons || 0x1;

	mouse.x = event.clientX / window.innerWidth * 2 - 1;
	mouse.y = -event.clientY / window.innerHeight * 2 + 1;
}


function getPosture()
{
	if( !model ) return;
	
	prompt('The current posture is shown below. Copy it to the clipboard.', model.postureString);
}


function getImage()
{
	if( !model ) return;
	
	var originalWidth=renderer.domElement.width,originalHeight=renderer.domElement.height;
	var widthOfScreenshot=512,heightOfScreenshot=512;
	if(originalWidth>originalHeight){
		widthOfScreenshot=512;
		if(originalWidth<widthOfScreenshot)widthOfScreenshot=originalWidth;
		heightOfScreenshot=widthOfScreenshot*originalHeight/originalWidth;
	}else{
		if(originalHeight<heightOfScreenshot)heightOfScreenshot=originalHeight;
		widthOfScreenshot=heightOfScreenshot*originalWidth/originalHeight;
	}

	renderer.setSize( widthOfScreenshot, heightOfScreenshot );
	renderer.render( scene, camera );

	divKeyFrames.append('<div><div><img class="posImg" style="width:100%;" src="'+renderer.domElement.toDataURL()+'" /><span class="posStr" style="display:none;">'+model.postureString+'</span><div style="height:40px;"><button style="float:left;width:33%;" class="btnDelete" onclick="deleteFrame(this)">删除</button><button style="float:left;width:33%;" class="btnEdit" onclick="editFrame(this)">编辑</button><button style="float:left;width:33%;" class="btnEdit" onclick="saveFrame(this)">保存帧</button></div></div><div style="height:40px;"><div style="float:left;">间隔</div><div style="float:left;"><input class="frameCount" type="number" value="10" style="width:50px;" /></div><div style="float:left;">帧</div></div></div>');

	renderer.setSize( originalWidth, originalHeight );
	renderer.render( scene, camera );

	jQuery(btnGetVideo).prop('disabled',false);
}

function getAnime(){
	if(jQuery(btnGetAnime).text()=="预览动画"){
		jQuery(btnGetAnime).text("停止动画");

		animeFrames=[];
		animeFrameImgs=[];

		$.each(divKeyFrames.find(".posStr"),function(posInd,posStr){
			animeFrames[animeFrames.length]=JSON.parse($(posStr).text());
			animeFrameImgs[animeFrameImgs.length]=$(posStr).parent().parent().find(".posImg").attr("src");
			var frameCount=parseInt($(posStr).parent().parent().find(".frameCount").val());
			if(frameCount>0){
				if(posInd<divKeyFrames.find(".posStr").length-1){
					generateMiddleFrames(JSON.parse($(posStr).text()),JSON.parse($(divKeyFrames.find(".posStr")[posInd+1]).text()),frameCount);
				}
			}
		});

		animeIndex=0;
		isAnime=true;
		runAnime();
	}else{
		isAnime=false;
		jQuery(btnGetAnime).text("预览动画");
	}
}

function runAnime(){
	if(!model)return;
	if(!isAnime)return;

	if(animeFrames.length>0&&animeIndex<animeFrames.length){
		var oldPosture = model.posture;
		try
		{
			model.postureString = JSON.stringify(animeFrames[animeIndex]);
		}
		catch (error)
		{
			model.posture = oldPosture;
			if (error instanceof MannequinPostureVersionError)
				alert(error.message);
			else
				alert('The provided posture was either invalid or impossible to understand.');
			console.error(error);
		}
		
		var originalWidth=renderer.domElement.width,originalHeight=renderer.domElement.height;
		var widthOfScreenshot=512,heightOfScreenshot=512;
		if(originalWidth>originalHeight){
			widthOfScreenshot=512;
			if(originalWidth<widthOfScreenshot)widthOfScreenshot=originalWidth;
			heightOfScreenshot=widthOfScreenshot*originalHeight/originalWidth;
		}else{
			if(originalHeight<heightOfScreenshot)heightOfScreenshot=originalHeight;
			widthOfScreenshot=heightOfScreenshot*originalWidth/originalHeight;
		}
		renderer.setSize( widthOfScreenshot, heightOfScreenshot );
		renderer.render( scene, camera );
		
		animeFrameImgs[animeIndex]=renderer.domElement.toDataURL();
		animeIndex++;

		renderer.setSize( originalWidth, originalHeight );
		renderer.render(scene, camera);
		
		setTimeout(function(){
			runAnime();
		},100);
	}else if(animeIndex==animeFrames.length){
		isAnime=false;
		jQuery(btnGetAnime).text("预览动画");
	}
}

function generateMiddleFrames(from,to,count){
	for(var i=0;i<count;i++){
		console.log((i+1)/(count+1));
		animeFrames[animeFrames.length]=Mannequin.blend(from,to,(i+1)/(count+1));
		animeFrameImgs[animeFrameImgs.length]="";
	}
}

function S4() {
   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}
function guid() {
   return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

function getVideo(){
	$("#divResult").css("display","block");
	$("#divResult").html("<h1>正在生成...</h1>");
	getAnime();

	setTimeout(function(){
		var taskId=guid();
		const settings = {
			"async": true,
			"crossDomain": true,
			"url": "http://119.91.202.207:10081/api/NP2P/NewTask",
			"method": "POST",
			"headers": {
				"accept": "text/plain",
				"Content-Type": "application/json-patch+json"
			},
			"data": "{\"threejsPoseTaskId\": \""+taskId+"\"}"
		};
		
		$.ajax(settings).done(function (response) {
			if(response.status){
				$.each(animeFrameImgs,function(posInd,posImg){
					createFrame(response.data,posInd,posImg);
				});
			}
		});
	},(animeFrames.length*1000/10)+3000);
}

var isCheckVideo=false;

function createFrame(taskId,posInd,posImg){
	const settings = {
		"async": true,
		"crossDomain": true,
		"url": "http://119.91.202.207:10081/api/NP2P/CreateFrame",
		"method": "POST",
		"headers": {
			"accept": "text/plain",
			"Content-Type": "application/json-patch+json"
		},
		"data": "{\"threejsPoseTaskId\": \""+taskId+"\",\"frameImage\": \""+posImg+"\",\"frameIndex\": "+posInd+",\"prompt\": \""+$("#prompt").val()+"\",\"seed\": \""+$("#seed").val()+"\"}"
	};
	
	$.ajax(settings).done(function (response) {
		if(response.status){
			$("#divResult").html("<h1>帧"+posInd+"上传成功, 视频生成较慢，请耐心等待...</h1>");
			if(!isCheckVideo){
				isCheckVideo=true;
				checkVideo(taskId);
			}
		}
	});
}

function checkVideo(taskId){
	const settings = {
		"async": true,
		"crossDomain": true,
		"url": "http://119.91.202.207:10081/api/NP2P/GetTask?taskId="+taskId,
		"method": "POST",
		"headers": {
			"accept": "text/plain",
			"Content-Type": "application/json-patch+json"
		},
		"data": "{}"
	};
	
	$.ajax(settings).done(function (response) {
		if(response.status){
			$("#divResult").html('<h1>视频生成成功</h1><video src="http://119.91.202.207:10081/np2p/'+taskId+'/result.mp4" controls="controls"></video>');
		}else{
			setTimeout(function(){
				checkVideo(taskId);
			},1000);
		}
	});
}

function saveFrame(obj){
	isAnime=false;
	if( !model ) return;
	renderer.render(scene, camera);
	$(obj).parent().parent().find(".posStr").text(model.postureString);
	$(obj).parent().parent().find(".posImg").attr("src",renderer.domElement.toDataURL());
}

function deleteFrame(obj){
	isAnime=false;
	$(obj).parent().parent().parent().remove();
}

function editFrame(obj){
	isAnime=false;
	if( !model ) return;
	var posStr=$(obj).parent().parent().find(".posStr").text();
	if (posStr)
	{
		var oldPosture = model.posture;

		try
		{
			model.postureString = posStr;
		}
		catch (error)
		{
			model.posture = oldPosture;
			if (error instanceof MannequinPostureVersionError)
				alert(error.message);
			else
				alert('The provided posture was either invalid or impossible to understand.');
			console.error(error);
		}
		renderer.render(scene, camera);
	}
}

function setPosture()
{
	if( !model ) return;
	
	var string = prompt('Reset the posture to:', '{"version":7,"data":["0,[0,0,0],...]}');

	if (string)
	{
		var oldPosture = model.posture;

		try
		{
			model.postureString = string;
		}
		catch (error)
		{
			model.posture = oldPosture;
			if (error instanceof MannequinPostureVersionError)
				alert(error.message);
			else
				alert('The provided posture was either invalid or impossible to understand.');
			console.error(error);
		}
		renderer.render(scene, camera);
	}
}


function exportPosture()
{
	if( !model ) return;
	
	console.log(models)
	model.exportGLTF( 'mannequin.glb', models );
}



function removeModel()
{
	if( !model ) return;
	scene.remove( model );
	models = models.filter( x => x!=model );
	
	if( models.length > 0 )
		model = models[0];
	else
		model = null;

	renderer.render(scene, camera);
}