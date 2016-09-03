Bible API DBT server
====================

**Bible API server that relies on the Digital Bible Toolkit from [Digital Bible Platform](http://www.digitalbibleplatform.com)**

Detail
------

Provides a single endpoint whereby the system determines the type of request being made, being one of

* SEARCH - Free text search (e.g. query = beautiful are the feet of those who preach)
* CHAPTER - Search for a chapter (e.g. query = John 3)
* VERSE - Search for one verse (e.g. query = John 3:16)
* VERSES - Search for many verses (e.g. query = John 3:16-18)

Also allows required bible versions to be specified. Supported versions being

* English Standard Version (ESV)
* World English Bible (WEB)
* New American Standard Bible (NASB)
* King James Version (KJV)

Example Requests
----------------

SEARCH<br>
http://DOMAIN:52922/bible?q=beautiful+are+the+feet+of+those+who+preach&versions=esv,web,nasb,kjv

CHAPTER<br>
http://DOMAIN:52922/bible?q=John+3&versions=esv,web,nasb,kjv

VERSE<br>
http://DOMAIN:52922/bible?q=John+3:16&versions=esv,web,nasb,kjv

VERSES<br>
http://DOMAIN:52922/bible?q=John+3:16-18&versions=esv,web,nasb,kjv

HTTPS Support
=============

HTTPS is also supported on

https://DOMAIN:52923
