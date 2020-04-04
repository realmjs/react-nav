# react-nav

## Note to doc
1. Navigator Component
1. route handler & navigator
1. page event: load, enter, leave...
1. page injector
1. global popup
1. Navigator Props: noUrl

## Tests for memory leak
1. click button 'Unmount Nav', then click button 'Global Popup'  -> fixed
1. click button 'Unmount Nav', then click button 'Welcome'  -> fixed
1. click button 'Move to Page Welcome (after 5s)', then click button 'Unmount Nav'  -> not fixed, goes to user notes
