package com.zonguldak.haber.ui

import android.content.Intent
import android.net.Uri
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.zonguldak.haber.R
import com.zonguldak.haber.model.NewsItem

class NewsAdapter : RecyclerView.Adapter<NewsAdapter.NewsViewHolder>() {
    private val items = mutableListOf<NewsItem>()

    fun submit(items: List<NewsItem>) {
        this.items.clear()
        this.items.addAll(items)
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): NewsViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_news, parent, false)
        return NewsViewHolder(view)
    }

    override fun onBindViewHolder(holder: NewsViewHolder, position: Int) {
        holder.bind(items[position])
    }

    override fun getItemCount(): Int = items.size

    class NewsViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val title: TextView = itemView.findViewById(R.id.newsTitle)
        private val meta: TextView = itemView.findViewById(R.id.newsMeta)

        fun bind(item: NewsItem) {
            title.text = item.title
            meta.text = "${item.source} · ${item.pubDate}"
            itemView.setOnClickListener {
                val intent = Intent(Intent.ACTION_VIEW, Uri.parse(item.link))
                itemView.context.startActivity(intent)
            }
        }
    }
}
