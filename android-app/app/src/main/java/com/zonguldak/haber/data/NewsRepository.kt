package com.zonguldak.haber.data

import android.content.Context
import com.zonguldak.haber.model.NewsItem
import com.zonguldak.haber.model.NewsSource
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.OkHttpClient
import okhttp3.Request
import org.json.JSONArray

class NewsRepository(private val context: Context) {
    private val client = OkHttpClient()
    private val parser = RssParser()

    suspend fun loadSources(): List<NewsSource> = withContext(Dispatchers.IO) {
        val json = context.assets.open("news_sources.json").bufferedReader().use { it.readText() }
        val array = JSONArray(json)
        val sources = mutableListOf<NewsSource>()
        for (i in 0 until array.length()) {
            val obj = array.getJSONObject(i)
            sources.add(NewsSource(obj.getString("name"), obj.getString("rss")))
        }
        sources
    }

    suspend fun fetchNews(): List<NewsItem> = withContext(Dispatchers.IO) {
        val sources = loadSources()
        val items = mutableListOf<NewsItem>()
        sources.forEach { source ->
            val request = Request.Builder().url(source.rss).build()
            client.newCall(request).execute().use { response ->
                val body = response.body?.string().orEmpty()
                items.addAll(parser.parse(body, source.name))
            }
        }
        items.sortedByDescending { it.pubDate }
    }
}
