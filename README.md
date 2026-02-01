# Zonguldak Haber

Zonguldak şehrindeki haberleri günlük ve anlık takip edebilmeniz için **Android uygulaması** ve **Windows üzerinden kontrol edebileceğiniz web paneli** içeren bir başlangıç projesidir.

## Proje Yapısı
- `android-app/`: Android uygulaması (Kotlin + RecyclerView)
- `dashboard/`: Windows'ta tarayıcı üzerinden çalıştırılacak web paneli
- `shared/`: Ortak haber kaynakları listesi (JSON)

## Android Uygulaması (Telefon)
### Gereksinimler
- Android Studio (Giraffe veya daha yeni)
- JDK 17

### Çalıştırma
1. `android-app/` klasörünü Android Studio ile açın.
2. Gerçek cihaz veya emülatör seçin.
3. **Run** butonuna tıklayın.

### APK Alma
1. Android Studio'da **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
2. Oluşan APK'yı telefonunuza yükleyin.

### Hazır APK (GitHub Actions ile)
Android Studio kurmadan APK üretmek için GitHub Actions iş akışını kullanabilirsiniz:
1. Projeyi GitHub'a yükleyin.
2. **Actions** sekmesinden **Build Android APK** iş akışını çalıştırın.
3. Çalışma tamamlanınca oluşan **zonguldak-haber-apk** artifact'ini indirin.
4. İçindeki APK dosyasını telefonunuza yükleyin.

## Windows Web Paneli
### Amaç
Windows üzerinde Zonguldak haberlerini tarayıcıdan hızlıca takip edin ve kaynakları listeleyin.

### Çalıştırma (Basit HTTP Sunucusu)
```bash
cd dashboard
python -m http.server 8080
```
Tarayıcıdan `http://localhost:8080` açın.

## Haber Kaynakları
Kaynaklar `shared/news_sources.json` içinde listelenmiştir. Android ve web paneli aynı listeyi kullanır.

Kaynak eklemek için JSON'a yeni bir kayıt ekleyin:
```json
{
  "name": "Kaynak Adı",
  "rss": "https://ornek.com/rss"
}
```

> Not: Bazı RSS kaynaklarında CORS kısıtları olabilir. Web paneli, bu nedenle `allorigins.win` proxy servisini kullanır.
