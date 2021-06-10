// buildMetaData to put in sample
function buildMetaData(sample) { 

        d3.json("static/js/samples.json").then((data) => { // use d3.json() and .then() function to go over the .json file
                // console.log(data)

                var metadata = data.metadata; // create a var and pull the metadata from the json
                var metaArray = metadata.filter(sampleObj => sampleObj.id == sample); // filter the metadata for each sample id 
                var result = metaArray[0];
                // console.log(sampleArray)

                // use d3.select() to update the index.html <div> 
                var samplesMetaData = d3.select("#sample-metadata");
                
                // clear any existing metadata
                samplesMetaData.html(" "); 
                
                // append each key and value pair in the sampleMetaData filter using Object.entries()
                Object.entries(result).forEach(([key, value]) => {
                        samplesMetaData.append("h6").text(`${key.toUpperCase()}: ${value}`);
                });
        });
};
    
// buildCharts to put in sample to build charts - bubble and bar
function buildCharts(sample) {

        d3.json("static/js/samples.json").then((data) => { // use d3.json() and .then() function to go over the .json file
                
                var sampledata = data.samples; // create a var and pull the samples from the json
                var sampleArray = sampledata.filter(sampleObj => sampleObj.id == sample);
                var result = sampleArray[0]

                // grab var that we will use: otu_ids, otu_labels, and sample_values
                var otuIds = result.otu_ids;
                var otuLabels = result.otu_labels;
                var sampleValues = result.sample_values;
                var yticks = otuIds.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
                
                // build a bubble chart and plot with Plotly.newPlot()
                var bubbleChart = {
                        title: 'Top 10 Bacteria Found'
                        //, margin: { t: 0 }
                        , hovermode: "closest"
                        , xaxis: { title: "OTU NUMBERS" }
                        //, margin: { t: 30}
                };
                var bubbleData = [
                        {
                        x: otuIds,
                        y: sampleValues,
                        text: otuLabels,
                        mode: 'markers',
                        marker: {
                                size: sampleValues,
                                color: otuIds,
                                colorscale: "Portland"
                        }
                    }
                ];
                
                Plotly.newPlot('bubble', bubbleData, bubbleChart)
                
                // build a bar chart and plot with Plotly.newPlot()
                var barChart = {
                        title: "Top 10 Bacteria Found",
                        margin: { t: 30, l: 150 }
                };

                var barData = [
                        {
                        y: yticks,
                        x: sampleValues.slice(0, 10).reverse(),
                        text: otuLabels.slice(0, 10).reverse(),
                        type: "bar",
                        orientation: "h",
                        }
                ];
    
                
    
                Plotly.newPlot("bar", barData, barChart);
        });
    };
    
// Use init() to initialisattion ome elements on the page
function init() {
        // select the selection element in the page
        var selection = d3.select("#selDataset");
        // console.log(selection)
            
        // - loop over the samples.json data to append the .name attribute into the value of an option HTML tag (lookup HTML documentation on selection menus)
        d3.json("static/js/samples.json").then((data) => {
                var subjectNames = data.names;
                    
                // - extract the first sample from the data
                subjectNames.forEach((sample) => {
                        // console.log(sample)
                        selection.append('option')
                                .text(sample)
                                .property('value', sample);
                        });
                                
                // - call your two functions to build the metadata and build the charts on the first sample, so that new visitors see some data/charts before they select something from the selection
                var firstSample = subjectNames[0]
                buildCharts(firstSample);
                buildMetaData(firstSample);
            });
    }
    
// Write a function called optionChanged() that takes a new sample as an argument. It should do the following:
function optionChanged(newSample) {
// - call your two functions to build the metadata and build the charts on the new sample
        buildCharts(newSample);
        buildMetaData(newSample);
}
    
// Initialize the dashboard by calling your init() function
init();