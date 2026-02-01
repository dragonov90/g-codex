package com.zonguldak.haber

import android.os.Bundle
import android.widget.ProgressBar
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout
import com.zonguldak.haber.data.NewsRepository
import com.zonguldak.haber.ui.NewsAdapter
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class MainActivity : AppCompatActivity() {
    private lateinit var repository: NewsRepository
    private lateinit var adapter: NewsAdapter
    private lateinit var swipeRefresh: SwipeRefreshLayout
    private lateinit var updatedText: TextView
    private lateinit var loadingBar: ProgressBar

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        repository = NewsRepository(this)
        adapter = NewsAdapter()

        val recyclerView: RecyclerView = findViewById(R.id.newsRecycler)
        swipeRefresh = findViewById(R.id.swipeRefresh)
        updatedText = findViewById(R.id.updatedText)
        loadingBar = findViewById(R.id.loadingBar)

        recyclerView.layoutManager = LinearLayoutManager(this)
        recyclerView.adapter = adapter

        swipeRefresh.setOnRefreshListener { loadNews() }

        loadNews()
    }

    private fun loadNews() {
        loadingBar.visibility = ProgressBar.VISIBLE
        swipeRefresh.isRefreshing = true

        lifecycleScope.launch {
            runCatching {
                repository.fetchNews()
            }.onSuccess { items ->
                adapter.submit(items)
                updatedText.text = "Son güncelleme: ${currentTime()}"
            }.onFailure {
                updatedText.text = "Veriler alınamadı. Tekrar deneyin."
            }
            swipeRefresh.isRefreshing = false
            loadingBar.visibility = ProgressBar.GONE
        }
    }

    private fun currentTime(): String {
        val formatter = SimpleDateFormat("dd.MM.yyyy HH:mm", Locale.getDefault())
        return formatter.format(Date())
    }
}
