function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  console.log(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var sampleArray = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var desiredSample =sampleArray.filter(text => text.id == sample ); 
    //  5. Create a variable that holds the first sample in the array.
    var info = desiredSample[0];
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var threeinfo = {"otu_ids":info.otu_ids,"otu_labels":info.otu_labels,"sample_values":info.sample_values};

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    all_otu_ids=threeinfo.otu_ids
    otu_ids=all_otu_ids.slice(0,10).reverse();
    yticks = otu_ids.map(row=> "OTU "+ row);
    
    all_sample_values=threeinfo.sample_values;
    sample_values=all_sample_values.slice(0,10).reverse();
    all_otu_labels=threeinfo.otu_labels;
    otu_labels=all_otu_labels.slice(0,10);
    


    // 8. Create the trace for the bar chart. 
    var barData = {
      x: sample_values.map(row => row),
      y: yticks,
      text: otu_labels.map(row => row),
      name: "Top 10 Bacteria Cultures Found",
      type: "bar",
      orientation: "h"

    };
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
      }
     
    };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", [barData], barLayout);

    // 1. Create the trace for the bubble chart.
    var bubbleData = {
      x: otu_ids.map(row=> row),
      y: sample_values.map(row => row),
      text:  otu_labels.map(row => row),
      mode: 'markers',
      marker: {
        color: [otu_ids[0],otu_ids[1],otu_ids[2],otu_ids[3],otu_ids[4],otu_ids[5],otu_ids[6],otu_ids[7],otu_ids[8],otu_ids[9]],
        size: sample_values.map(row => row),
      }
    };
    
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title:"Bacteria Cultures Per Sample",
      xaxis:{title:"OTU ID"},
      hovermode: "closest"
 
    };
    
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble",[bubbleData],bubbleLayout); 
    // 4. Create the trace for the gauge chart.
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var Wfreq = parseFloat(result.wfreq);
    
    var gaugeData = [
      {
        //domain: { x: [0, 1], y: [0, 1] },
        type: "indicator",
        mode: "gauge+number",
        value: Wfreq,
        title: { text: "Belly Button Washing Frequency"},
        gauge :{
          axis:{range:[null,10]},
          bar:{color:"black"},
          bgcolor:"white",
          steps:[
            {range:[0,2],color:"cyan"},
            {range:[2,4],color:"yellow"},
            {range:[4,6],color:"red"},
            {range:[6,8],color:"pink"},
            {range:[8,10],color:"brown"}
          ],
      }

     
    }
  ];
        
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width:400,
      height:300,
      margin: { t: 25, r: 25, l: 25, b: 25 },
      paper_bgcolor: "lavender"

    };
    
    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge",gaugeData,gaugeLayout);   
  });
}
