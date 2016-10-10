
# Five Rivers MetroParks Tribute Page
A project to help Dayton's Five Rivers MetroParks revamp their tribute page
at http://www.metroparks.org/make-a-difference/gifts/honor/

We'll be working with their web team to come up with a solution that allows
potential donors to browse available tribute items and purchase. We'll be
sketching out and designing the page as we go along, but some ideas that have
been talked about so far:
- A map that shows item locations (not all items have locations)
- A sortable table
- A filtering system of some sort that allows users to narrow down items by
park, price, or item type
- Responsive / Mobile friendly

Once we've got something that we're all happy with, we'll help integrate the
code into their Wordpress CMS. For convenience, we'll be developing this as
a standalone static site.

For more information, please contact
[Michael Bowman](mailto:bowmanmc@gmail.com) or stop by our slack channel
from http://opendayton.org/ to help!


## Developing
- Install NodeJS from https://nodejs.org/en/
- Open a terminal and navigate to where this project was checked out
- Execute ```npm install``` to install the development dependencies
- Execute ```npm start``` to start [BrowserSync](https://www.browsersync.io/)
- Alternatively, you can install [Python](https://www.python.org/) on your
system and use the built in web server. For Python 3 users,
run ```python -m http.server 9000``` and for Python 2 users, run ```python -m SimpletHTTPServer 9000```
- Open your browser to http://localhost:9000 to preview the site.


## Code of Conduct
Contributors are expected to know and follow the
[Code for Dayton Code of Conduct](https://github.com/codefordayton/codeofconduct)
