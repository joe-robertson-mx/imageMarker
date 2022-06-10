## Description
A widget to allow for adding points to a static or dynamic image.

## Typical usage scenario
It can be used to indicate problems or identify locations on a standardised image.

## Features and limitations
### Features:
	• Add points to an image
	• Have grids to group issues
	• Allow for color coding of problem areas in the grid
	• Use a static or dynamic image
	• Specify the Mendix object the result should be saved as
### Limitations:
	• Currently there is no OnClick action when specifying a point
	• A deafult Save button is provided, which commits the image as the entity specified in the configuration.
	
### Dependencies
	• None
	
## Installation
Download from the marketplace and place on a page within Studio Pro.

 ## Configuration
To use a Dynamic image, place the widget within a data view containing the image.
Set the following properties on the widget:

    • Image for markup - Set a dynamic or static image source to mark up
    • Columns, Rows and Show Grid Lines - Set whether you want to display the Grid on top of the image
    • Color markup - Show color coded grids to indicate marks
    • Low Limit and Upper Limit - Set the limits for the color coding markup
    • Object type - The Mendix object that the markup will be committed to on 'Save'
    • Height - Set Mendix canvas height
    • Context - Provide a parent entity to link the image created to. Please note that the association between the parent and child must contain the name of the parent entity
	• point - Provide an entity that is created for each point. Please note it must have decimal attributes named X and Y, and a single association to the Image entity named: [PointEntityName]_[ImageEntityName] 

