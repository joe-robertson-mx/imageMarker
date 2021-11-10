# imageMarker
 A Mendix widget to markup images

## How to use
Download the widget from the Marketplace and add to a page within your Mendix project. Configure the following properties from within Studio Pro:


### General
- Image for markup - Set a dynamic or static image source to mark up
- Columns, Rows and Show Grid Lines - Set whether you want to display the Grid on top of the image
- Color markup - Show color coded grids to indicate marks
- Low Limit and Upper Limit - Set the limits for the color coding markup
- Object type - The Mendix object that the markup will be committed to on 'Save'
- Height - Set Mendix canvas height

###Colors
- Set the Colors for points, lines and markups using CSS style color description
Note: It is recommended to set the 'OK Color', 'Minor Issue Color' and 'Significant Issue Color' to be somewhat transparent (e.g. rgba(240, 52, 52, .4))
