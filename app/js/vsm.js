/*
TODO: Make box width dynamic based on length of text: PARKED
TODO: Make arrow width dynamic based on length of text: DONE
TODO: Adjust canvas size to width of drawing. See https://www.w3schools.com/tags/canvas_getimagedata.asp DONE
TODO: Add table to create boxes with GUI controls - http://jsfiddle.net/7AeDQ/ DONE
TODO: Add summary fields for input, and style/font choice
TODO: Add same summary fields to image! - NOPE
TODO: Style the table more nicely, including fonts
TODO: Add row ID to the data - DONT


*/
function textCentredXCoordinate(context, containerX, containerWidth, txtLine){
	//Given an arbitrary container, what X coordinate should we start a line
	//of text at so that it appears centred?
	var txtLineWidth = context.measureText(txtLine).width;
	return (containerX + parseInt((containerWidth - txtLineWidth) / 2));
}

function calculateArrowLength(context, txtStepWaitTime){
	return context.measureText(txtStepWaitTime).width + 20;
}

function drawVSPArrow(context, arrowFinishX, arrowFinishY, arrowLength, txtStepWaitTime,
	txtBoxColor, txtFont){
	//Draw an arrow
	context.beginPath();
	var arrowX = arrowFinishX - arrowLength;
	//var arrowY = arrowFinishY + parseInt(vspBoxHeight / 2);
	var arrowY = arrowFinishY;
	context.moveTo(arrowX, arrowY);
	context.lineTo(arrowX + arrowLength, arrowY);
	context.moveTo(arrowX + arrowLength - 5, arrowY - 5);
	context.lineTo(arrowX + arrowLength, arrowY);
	context.lineTo(arrowX + arrowLength - 5, arrowY + 5);
	context.strokeStyle = "black";
	context.stroke();
	context.fillText(txtStepWaitTime, textCentredXCoordinate(context, arrowX, arrowLength, txtStepWaitTime), arrowY - 10);
	}

function drawVSPBox(context, vspBoxPosX, vspBoxPosY, vspBoxWidth, vspBoxHeight, 
	txtStepName, txtStepWorkTime, txtStepElapsedTime, txtStepWaitTime, txtBoxColor, txtFont){

	var textStyleStageName = 'bold 14px ' + txtFont;
	var txtLine = '';
	var txtLineWidth = 0;
	var txtLineHeight = 0;
	var vspLine1Width = 0;
	var vspLine2Width = 0;
	var vspLine3Width = 0;
	var vspLine4Width = 0;
	var vspLinePosY = 0;
	var vspSpaceBetweenTextLines = 6;
	var elapsedTimeBoxWidth = 0;
	var elapsedTimeBoxHeight = 20;

	//Draw a Value Stream Box
	context.rect(vspBoxPosX,vspBoxPosY,vspBoxWidth,vspBoxHeight);
	context.shadowColor = 'black';
	context.shadowBlur = 5;
	context.shadowOffsetX = 3;
	context.shadowOffsetY = 3;
	context.fillStyle = txtBoxColor;
	context.stroke();
	context.fill();

	//Add some text
	context.beginPath();
	context.shadowColor = 'transparent';
	context.font = textStyleStageName;
	context.fillStyle = 'black';
	txtLine = txtStepName;
	vspLinePosY = vspBoxPosY + 30;
	context.fillText(txtLine,parseInt((vspBoxWidth - context.measureText(txtLine).width)/2) + vspBoxPosX, vspLinePosY);
	context.font = '14px ' + txtFont;
	txtLineHeight = context.measureText('M').width;

	txtLine = txtStepWorkTime;
	vspLinePosY = vspLinePosY + txtLineHeight + vspSpaceBetweenTextLines;
	context.fillText(txtLine, parseInt((vspBoxWidth - context.measureText(txtLine).width)/2) + vspBoxPosX, vspLinePosY);

	context.beginPath();
	txtLine = txtStepElapsedTime;
	txtLineWidth = context.measureText(txtLine).width;
	//See https://stackoverflow.com/questions/1134586/how-can-you-find-the-height-of-text-on-an-html-canvas
	txtLineHeight = context.measureText('M').width;
	elapsedTimeBoxWidth = txtLineWidth + 20;
	context.rect(parseInt((vspBoxWidth - elapsedTimeBoxWidth)/2) + vspBoxPosX,vspBoxPosY + vspBoxHeight + 10,elapsedTimeBoxWidth,elapsedTimeBoxHeight);
	context.fillStyle = '#cccccc';
	context.fill();

	context.beginPath();
	context.fillStyle = 'black';
	//Center text horizontally and vertically
	context.fillText(txtLine, parseInt((vspBoxWidth - txtLineWidth)/2) + vspBoxPosX,
		vspBoxPosY + vspBoxHeight + 10 + 
		elapsedTimeBoxHeight - parseInt((elapsedTimeBoxHeight - txtLineHeight)/2));

}

function drawVSPBoxAndArrow(context, vspBoxPosX, vspBoxPosY, vspBoxWidth, vspBoxHeight, arrowLength, 
		txtStepName, txtStepWorkTime, txtStepElapsedTime, txtStepWaitTime,
		txtBoxColor, txtFont){
	drawVSPBox(context, vspBoxPosX, vspBoxPosY, vspBoxWidth, vspBoxHeight, 
		txtStepName, txtStepWorkTime, txtStepElapsedTime, txtStepWaitTime,
		txtBoxColor, txtFont);
	if (txtStepWaitTime){
		drawVSPArrow(context, vspBoxPosX, vspBoxPosY + parseInt(vspBoxHeight / 2), arrowLength, txtStepWaitTime, txtBoxColor, txtFont);
	}
}

function drawStuff(jsondata){
	var vspBoxWidth = 120;
	var vspBoxHeight = 70;
	var lastBoxX = 20;
	var lastBoxY = 20;
	var txtStepWaitTime = "";
	var b_canvas = document.getElementById("a");
	var context = b_canvas.getContext("2d");


	var measuredata = JSON.parse(jsondata);
	var boxCount = measuredata.measurements.length;

	//This is a little tricky. Need to draw the box to know how wide the canvas is.
	//TODO: Maybe precalculate?
	b_canvas.width = lastBoxX + (boxCount * vspBoxWidth) + ((boxCount - 1) * 100) + 20;

	for (var i = 0; i < boxCount; i++){
		var boxData = measuredata.measurements[i];
		var arrowLength = 0;
		if (i > 0){
			txtStepWaitTime = boxData.StepWait;
			arrowLength = calculateArrowLength(context, txtStepWaitTime);
			lastBoxX = lastBoxX + arrowLength + vspBoxWidth;
		}
		drawVSPBoxAndArrow(context, lastBoxX, lastBoxY, vspBoxWidth, vspBoxHeight, arrowLength,
			boxData.StepName, boxData.StepWork, boxData.StepElapsed, txtStepWaitTime,
			measuredata.format.BoxColor,measuredata.format.Font);
	}

}

function testCall(){
	var testdata = getTestData();
	drawStuff(testdata);
}

//When the testbox loses focus
function refreshDrawing(){
	var testdata = document.getElementById("jsondata").value;
	drawStuff(testdata);
}

function getTestData(){
	/*
{
  "summary": {
    "Title": "Development Workflow",
    "TotalWork": "100 hrs",
    "TotalElapsed": "200 hrs",
    "TotalWait": "500 hrs"
  },
  "measurements": [
    {
      "StepName": "Planning",
      "StepWork": "60 hr avg",
      "StepElapsed": "120 hrs",
      "StepWait": ""
    },
    {
      "StepName": "Design",
      "StepWork": "10 hrs",
      "StepElapsed": "24 hrs",
      "StepWait": "10 months"
    },
    {
      "StepName": "Development",
      "StepWork": "100 hrs",
      "StepElapsed": "360 hrs",
      "StepWait": "10 days"
    }
  ]
}
	*/

	var data = {
		summary : {Title:"Development Workflow", TotalWork:"100 hrs", TotalElapsed:"200 hrs", TotalWait:"500 hrs"},
		format : {BoxColor:"#0691c3", Font:"Arial"},
		measurements : []
	};
	data.measurements.push({StepName:"Planning", StepWork:"60 hr avg", StepElapsed:"120 hrs", StepWait:""});
	data.measurements.push({StepName:"Design", StepWork:"10 hrs", StepElapsed:"24 hrs", StepWait:"10 months"});
	data.measurements.push({StepName:"Development", StepWork:"100 hrs", StepElapsed:"360 hrs", StepWait:"10 days"});
	var results = JSON.stringify(data);
	document.getElementById("jsondata").value=results;
	return JSON.stringify(data);
}

//Example code to add and delete table rows dynamically
//http://jsfiddle.net/7AeDQ/
function deleteRow(row)
{
    var i=row.parentNode.parentNode.rowIndex;
    document.getElementById('tableValueStream').deleteRow(i);
    parseTable();
}

function addRow(row)
{
    //console.log( 'hi');
    var x=document.getElementById('tableValueStream');
    var len = x.rows.length;
    var i=row.parentNode.parentNode.rowIndex;
    if (i==len-1){
	    var new_row = x.rows[1].cloneNode(true);
	    
	    new_row.cells[0].innerHTML = len;
	    
	    var inp1 = new_row.cells[1].getElementsByTagName('input')[0];
	    inp1.id += len;
	    inp1.value = '';
	    var inp2 = new_row.cells[2].getElementsByTagName('input')[0];
	    inp2.id += len;
	    inp2.value = '';
	    var inp3 = new_row.cells[3].getElementsByTagName('input')[0];
	    inp3.id += len;
	    inp3.value = '';
	    var inp4 = new_row.cells[4].getElementsByTagName('input')[0];
	    inp4.id += len;
	    inp4.value = '';
	    x.appendChild( new_row );
	    document.getElementById(inp1.id).focus();
    }
}

function parseTable(){
	var table=document.getElementById('tableValueStream');
	var data = {
		summary : {Title:"TBC", TotalWork:"0", TotalElapsed:"0", TotalWait:"0"},
		format : {BoxColor:"#0691c3", Font:"Arial"},
		measurements : []
	};

	data.format.BoxColor=document.getElementById('fmtBoxColor').value;
	data.format.Font=document.getElementById('fmtFont').value;

	for (var i = 1, row; row = table.rows[i]; i++) {
		if (i==1){
			data.measurements.push({StepName:row.cells[1].firstChild.value, StepWork:row.cells[2].firstChild.value, StepElapsed:row.cells[3].firstChild.value, StepWait:""});

		} else {
			data.measurements.push({StepName:row.cells[1].firstChild.value, StepWork:row.cells[2].firstChild.value, StepElapsed:row.cells[3].firstChild.value, StepWait:row.cells[4].firstChild.value});
		}
   		//iterate through rows
   		//rows would be accessed using the "row" variable assigned in the for loop
   		//for (var j = 1, col; col = row.cells[j]; j++) {}
     		//iterate through columns
     		//columns would be accessed using the "col" variable assigned in the for loop
   	}
	var results = JSON.stringify(data);
	document.getElementById("jsondata").value=results;
   	refreshDrawing();

}

//https://stackoverflow.com/questions/30694433/how-to-give-browser-save-image-as-option-to-button
function saveImage() {
	var canvas = document.getElementById("a");
    window.open(canvas.toDataURL('image/png'));
    var gh = canvas.toDataURL('png');

    var a  = document.createElement('a');
    a.href = gh;
    a.download = 'value-stream-map.png';

    a.click();
}
