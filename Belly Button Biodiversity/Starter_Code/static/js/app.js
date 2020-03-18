// Path to samples geoJSON
var json_path = "./samples.json";
console.log(json_path);

// Creating function for Data plotting (Bar, bubble)
function getPlot(id) {
    // Getting data from json file
    d3.json(json_path).then((data) => {
        console.log(data)

        // filter values by ID
        var samples = data.samples.filter(s => s.id.toString() === id)[0];
        console.log(samples);

        // Getting only the top 10 
        var samplevalues = samples.sample_values.slice(0, 10).reverse();

        // Get only top 10 OTU ids for the plot OTU then reverse it
        var OTU_top = (samples.otu_ids.slice(0, 10)).reverse();

        // Change the OTU IDs to the form I need
        var OTU_id = OTU_top.map(d => "OTU " + d)


        //////////////// Create the bar graph ////////////////
        // Create trace for the bar graph
        var trace_bar = {
            x: samplevalues,
            y: OTU_id,
            marker: {
                color: 'purple'
            },
            type: "bar",
            orientation: "h",
        };

        // Create data variable
        var data_bar = [trace_bar];

        // Create layout for the plot
        var layout_bar = {
            title: "Top 10 OTU",
        };

        // Plot the bar graph
        Plotly.newPlot("bar", data_bar, layout_bar);


        //////////////// Create the bubble plot ////////////////
        var OUT_ids = samples.otu_ids;
        var sample_values = samples.sample_values;
        var OUT_labels = samples.otu_labels;

        // Create trace for the bubble graph
        var trace_bubble = {
            x: OUT_ids,
            y: sample_values,
            mode: "markers",
            marker: {
                size: sample_values,
                color: OUT_ids
            },
            text: OUT_labels
        };

        // Set the layout for the bubble plot
        var layout_bubble = {
            xaxis: { title: "OTU ID" },
            height: 600,
            width: 1000
        };

        // Create data variable
        var data_bubble = [trace_bubble];

        // Plot the bubble graph
        Plotly.newPlot("bubble", data_bubble, layout_bubble);

    });
}

// Create function to get the necessary data
function getInfo(id) {
    // Read json file
    d3.json(json_path).then((data) => {

        // Get the metadata info for the demographic info panel
        var metadata = data.metadata;
        console.log(metadata)

        // Filter meta data info by id
        var result = metadata.filter(meta => meta.id.toString() === id)[0];

        // Select demographic panel to put data
        var demographicInfo = d3.select("#sample-metadata");

        // Empty the demographic info panel each time before getting new id info
        demographicInfo.html("");

        // Append info to the panel
        Object.entries(result).forEach((key) => {
            demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");
        });
    });
}


// Create function for initial data showing
function start() {
    // Select dropdown menu 
    var dropdown = d3.select("#selDataset");

    // Read the data 
    d3.json(json_path).then((data) => {
        console.log(data)

        // Get the ID data to the dropdwown menu
        data.names.forEach(function (name) {
            dropdown.append("option").text(name).property("value");
        });

        // Call  functions to display the data and the plots on the page
        getPlot(data.names[0]);
        getInfo(data.names[0]);
    });
}


// Create the function for the change event
function optionChanged(id) {
    getPlot(id);
    getInfo(id);
}

start();