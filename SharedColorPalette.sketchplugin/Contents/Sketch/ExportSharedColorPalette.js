@import 'common.js'

var onRun = function(context) {

  var sketch = context.api();
  var doc = sketch.selectedDocument;

  //get the name of the document and remove the file extension if there is one
  var documentName = removeFileExtension(doc.sketchObject.displayName());

  //reference the shared styles
  var sharedStyles = doc.sketchObject.documentData().layerStyles();

  //reference the number of shared styles
  var numberOfSharedStyles = Number(sharedStyles.numberOfSharedStyles());

  //allow json to be written to the folder
  var fileTypes = [NSArray arrayWithObjects:@"json", nil];

  //create select folder window to save the file
  var panel = [NSOpenPanel openPanel];
  [panel setCanChooseDirectories:true];
  [panel setCanCreateDirectories:true];
  [panel setAllowedFileTypes:fileTypes];

  //the text on the button in the panel
  panel.setPrompt("Save Color Palette");

  var clicked = [panel runModal];

  //check if Ok has been clicked
  if (clicked == NSFileHandlingPanelOKButton) {

    var isDirectory = true;
    //get the folder path
    var firstURL = [[panel URLs] objectAtIndex:0];
    //format it to a string
    var file_path = [NSString stringWithFormat:@"%@", firstURL];

    //remove the file:// path from string
    if (0 === file_path.indexOf("file://")) {
      file_path = file_path.substring(7);
    }
  }

  //create an array to hold the palette
  var paletteArray = [];

  for (var z = 0; z < numberOfSharedStyles; z++){

    layerStyle = sharedStyles.objects().objectAtIndex(z);

    //convert variables to Strings for JSON export
    var colorName = String(layerStyle.name());
    var colorHex = "#" + layerStyle.value().fill().color().immutableModelObject().hexValue();

    //push this info into the palette array
    paletteArray.push({
      name: colorName,
      value: colorHex,
    })

  }
  // Create the JSON object from paletteArray
  var jsonObj = { "Color Palette": paletteArray };
  // Convert the object to a json string and format it
  var file = NSString.stringWithString(JSON.stringify(jsonObj, null, "\t"));
  // Save the file
  [file writeToFile:file_path+documentName+".json" atomically:true encoding:NSUTF8StringEncoding error:null];

  var alertMessage = documentName+".json saved to: " + file_path;
  alert("Shared Color Palette JSON Exported!", alertMessage);

};