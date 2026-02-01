package com.zonguldak.haber.data

import com.zonguldak.haber.model.NewsItem
import org.xmlpull.v1.XmlPullParser
import org.xmlpull.v1.XmlPullParserFactory

class RssParser {
    fun parse(xml: String, source: String): List<NewsItem> {
        if (xml.isBlank()) return emptyList()
        val items = mutableListOf<NewsItem>()
        val factory = XmlPullParserFactory.newInstance()
        val parser = factory.newPullParser()
        parser.setInput(xml.reader())

        var eventType = parser.eventType
        var currentTitle = ""
        var currentLink = ""
        var currentDate = ""
        var insideItem = false

        while (eventType != XmlPullParser.END_DOCUMENT) {
            when (eventType) {
                XmlPullParser.START_TAG -> {
                    when (parser.name.lowercase()) {
                        "item" -> {
                            insideItem = true
                            currentTitle = ""
                            currentLink = ""
                            currentDate = ""
                        }
                        "title" -> if (insideItem) currentTitle = parser.nextText()
                        "link" -> if (insideItem) currentLink = parser.nextText()
                        "pubdate" -> if (insideItem) currentDate = parser.nextText()
                    }
                }
                XmlPullParser.END_TAG -> {
                    if (parser.name.equals("item", ignoreCase = true) && insideItem) {
                        if (currentTitle.isNotBlank() && currentLink.isNotBlank()) {
                            items.add(
                                NewsItem(
                                    title = currentTitle.trim(),
                                    link = currentLink.trim(),
                                    pubDate = currentDate.trim(),
                                    source = source
                                )
                            )
                        }
                        insideItem = false
                    }
                }
            }
            eventType = parser.next()
        }
        return items
    }
}
