
const lstm = ml5.charRNN('models/edgar_kor', modelReady);

let is_element_added = false;

let create_text = false;

let genTextDom;

let text_data;
let gen_text = "";

let count_footnote_num = 0;

function modelReady(){
    console.log("LSTM model loaded.");
    addTextToModel();
}

function addTextToModel(){
    lstm.reset();
    generate();
}

function prepareString(result){
    console.log("test.txt loaded");
    text_data = result;
    console.log(text_data[0]);
}

function setup(){
	noCanvas();
	genTextDom = select("#generatedText");
    loadStrings('test.txt', prepareString);
}

function draw(){
    
}

async function generate(){

	if(!is_element_added){
		await lstm.feed(text_data[count_footnote_num]);
        count_footnote_num++;
        is_element_added = true;
        create_text = true;
	}
	     
    loopRNN();

}

function stopGeneration(){
    //lstm.reset();
	create_text = false;
    is_element_added = false;
    if(!create_text&&count_footnote_num<text_data.length){
        generate();
    }else{
        console.log("finished!");
        //-->generate text file
        download();
    }
}

function download(){
    var text = document.getElementById("generatedText").value;
    text = text.replace(/\n/gi, "\r\n"); // To retain the Line breaks.
    var blob = new Blob([text], { type: "text/plain"});
    var anchor = document.createElement("a");
    anchor.download = "generated.txt";
    anchor.href = window.URL.createObjectURL(blob);
    //anchor.target ="_blank";
    //anchor.style.display = "none"; // just to be safe!
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
}

async function loopRNN() {
  while (create_text) {
    await predict();
  }
}

let prev_sample = "";

async function predict() {

    let temperature = 0.5;
  
    let next = await lstm.predict(temperature);
    await lstm.feed(next.sample);
    genTextDom.html(next.sample,true);
    if(next.sample=="\n"){
            //console.log(next);
        //if(prev_sample!="."){
            //genTextDom.html(".",true);
        //}
        //genTextDom.html("<br>",true);
        stopGeneration();
    }/*else if(next.sample=="."){
        genTextDom.html(next.sample,true);
        genTextDom.html("<br>",true);
        stopGeneration();
    }*/else{
        //genTextDom.html(next.sample,true);
    }

    prev_sample = next.sample;
}


