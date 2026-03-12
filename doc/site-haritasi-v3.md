# MRML Lab -- Site Haritasi v3

Bu dokuman, MRML Lab arastirma laboratuvari web sitesinin tum sayfa, yazi, tag, kategori ve global komponent yapisini tanimlar.

---

## Sayfalar

### Anasayfa
**URL:** `/`
**Layout:**
- Hero / Landing Section (Lab adi, slogan, arka plan gorseli veya video)
- Kisa Tanitim Blogu (Lab hakkinda 2-3 cumle)
- One Cikan Arastirma Alanlari (3 alan, kart yapisiyla)
- Son Haberler (Son 3-4 haber, slider veya grid)
- One Cikan Projeler & Yayinlar (Secili projeler ve yayinlar)
- Ekip One Cikani (Lab yoneticisi veya one cikan arastirmacilar)
- Rakamlarla Lab (Yayın sayisi, proje sayisi, ekip uyesi sayisi vb.)
- Bize Katil / Iletisim CTA (Basvuru ve iletisim yonlendirme blogu)
- Footer

---

### Hakkinda
**URL:** `/hakkinda`
**Layout:**
- Baslik & Giris Metni
- Lab Tanitimi (Detayli aciklama, gorseller)
- Misyon & Vizyon
- Tarihce / Kilometre Taslari (Timeline yapisiyla)
- Bagli Oldugu Kurum Bilgisi (Universite, fakulte, bolum)
- Footer

---

### Arastirmalar
**URL:** `/arastirmalar`
**Layout:**
- Baslik & Giris Metni
- Arastirma Alanlari Ozeti (Kartlar ile listeleme, her biri tekil sayfaya yonlendirir)
- Projeler Ozeti (Devam eden, tamamlanan, fonlanan projelere yonlendirme)
- Yayinlar Ozeti (Son yayinlara yonlendirme)
- Footer

---

### Ekip (Listeleme)
**URL:** `/ekip`
**Layout:**
- Baslik & Giris Metni
- Filtreleme Alani (Rol / derece bazli: PI, Arastirmaci, Ogrenci, Mezun)
- Ekip Uyeleri Grid (Kart yapisi: foto, isim, unvan, arastirma alani)
  - Her kart, kisi tekil sayfasina yonlendirir
- Footer

---

### Kisi Sayfasi (Tekil -- Sablon)
**URL:** `/ekip/{kisi-slug}`
**Layout:**
- Kisi Bilgi Blogu (Profil fotografi, isim, unvan, iletisim bilgileri)
- Biyografi
- Arastirma Alanlari & Ilgi Alanlari
- Yayinlar Listesi (Bu kisiye ait yayinlar)
- Projeler Listesi (Bu kisinin dahil oldugu projeler)
- Egitim Bilgileri
- Oduller & Basarilar
- Sosyal Medya & Akademik Profiller (Google Scholar, ORCID, ResearchGate, LinkedIn)
- Footer

---

### Arastirma Alani (Tekil -- Sablon)
**URL:** `/arastirmalar/alanlar/{alan-slug}`
**Layout:**
- Baslik & Hero Gorseli
- Alan Tanitimi (Detayli aciklama)
- Ilgili Projeler (Bu alandaki projeler)
- Ilgili Yayinlar (Bu alandaki yayinlar)
- Ilgili Ekip Uyeleri (Bu alanda calisan kisiler)
- Ilgili Donanim (Bu alanda kullanilan ekipmanlar)
- Footer

---

### Projeler (Listeleme)
**URL:** `/arastirmalar/projeler`
**Layout:**
- Baslik & Giris Metni
- Filtreleme Alani (Durum: Devam Eden / Tamamlanan / Iptal Edilen, Fon Kaynagi: TUBITAK / AB / Horizon / Diger)
- Proje Kartlari Grid (Baslik, durum etiketi, arastarma alani, kisa aciklama)
- Footer

---

### Proje (Tekil -- Sablon)
**URL:** `/arastirmalar/projeler/{proje-slug}`
**Layout:**
- Baslik & Durum Etiketi
- Proje Ozeti
- Detayli Aciklama
- Proje Ekibi (Ilgili kisi sayfalarina baglanti)
- Bagli Arastirma Alani
- Ilgili Yayinlar
- Fon Bilgileri (Kaynak, tutar, sure)
- Proje Gorselleri / Galeri
- Footer

---

### Yayinlar (Listeleme)
**URL:** `/yayinlar`
**Layout:**
- Baslik & Giris Metni
- Filtreleme ve Arama Alani (Tur: Dergi Makalesi / Konferans Bildirisi / Tez, Yil, Arastirma Alani, Yazar)
- Yayin Listesi (Baslik, yazarlar, yil, tur etiketi, DOI linki)
- Sayfalama (Pagination)
- Footer

---

### Yayin (Tekil -- Sablon)
**URL:** `/yayinlar/{yayin-slug}`
**Layout:**
- Baslik & Tur Etiketi
- Yazarlar (Kisi sayfalarina baglanti)
- Ozet (Abstract)
- Yayin Detaylari (Dergi/Konferans adi, cilt, sayi, sayfa, yil)
- DOI & Tam Metin Linki
- Anahtar Kelimeler / Taglar
- Ilgili Projeler
- Atif Bilgisi (BibTeX formatinda kopyalanabilir)
- Footer

---

### Donanim (Listeleme)
**URL:** `/donanim`
**Layout:**
- Baslik & Giris Metni
- Kategori Filtreleme (Laboratuvar Donanimi, Deney Donanimi, Simulasyon Donanimi)
- Donanim Kartlari Grid (Gorsel, isim, kategori, kisa aciklama)
- Footer

---

### Donanim (Tekil -- Sablon)
**URL:** `/donanim/{donanim-slug}`
**Layout:**
- Donanim Adi & Gorselleri
- Teknik Ozellikler
- Kullanim Amaci / Aciklama
- Bagli Arastirma Alanlari
- Bagli Projeler
- Footer

---

### Dersler (Listeleme)
**URL:** `/dersler`
**Layout:**
- Baslik & Giris Metni
- Ders Kartlari (Ders adi, ders kodu, donem, seviye)
- Footer

---

### Ders (Tekil -- Sablon)
**URL:** `/dersler/{ders-slug}`
**Layout:**
- Ders Adi & Kodu
- Ders Tanitimi / Icerik Ozeti
- Ders Veren Kisiler (Kisi sayfalarina baglanti)
- Donem & Seviye Bilgisi
- Ders Materyalleri (Varsa)
- Footer

---

### Haberler (Listeleme)
**URL:** `/haberler`
**Layout:**
- Baslik
- Haber Kartlari (Gorsel, baslik, tarih, kategori etiketi, kisa ozet)
- Kategori ve Tag Filtreleme
- Sayfalama
- Footer

---

### Etkinlikler (Listeleme)
**URL:** `/etkinlikler`
**Layout:**
- Baslik
- Yaklaşan Etkinlikler (One cikarilmis blok)
- Gecmis Etkinlikler (Kronolojik liste)
- Takvim Gorunumu (Opsiyonel)
- Footer

---

### Bize Katil / Basvur
**URL:** `/basvur`
**Layout:**
- Baslik & Giris Metni (Lab'a katilmanin avantajlari)
- Acik Pozisyonlar Listesi (Pozisyon adi, tur, son basvuru tarihi)
- Yuksek Lisans / Doktora Basvurulari Bilgi Blogu
- Isbirligi Teklifleri Bilgi Blogu
- Basvuru Formu veya Yonlendirme
- Footer

---

### Iletisim
**URL:** `/iletisim`
**Layout:**
- Baslik
- Iletisim Bilgileri (Adres, telefon, e-posta)
- Iletisim Formu
- Harita (Google Maps embed)
- Sosyal Medya Baglantiları
- Footer

---

### Kurumsal Kimlik Dokumani
**URL:** `/kurumsal-kimlik`
**Layout:**
- Baslik & Giris Metni
- Logo Kullanim Kurallari
- Renk Paleti
- Tipografi
- Indirilebilir Materyaller (Logo dosyalari, sablonlar)
- Footer

---

### Gizlilik ve Cerezler
**URL:** `/gizlilik`
**Layout:**
- Baslik
- Gizlilik Politikasi Metni
- Cerez Kullanim Politikasi
- Footer

---

### KVKK
**URL:** `/kvkk`
**Layout:**
- Baslik
- KVKK Aydinlatma Metni
- Veri Sahibi Basvuru Formu (Opsiyonel)
- Footer

---

### Aydinlatma Metni
**URL:** `/aydinlatma-metni`
**Layout:**
- Baslik
- Aydinlatma Metni Icerigi
- Footer

---
---

## Yazilar (Post Tipleri)

Dinamik icerik tipleri. Her birinin listeleme ve tekil sayfa sablonu vardir.

### Haberler
**URL Yapisi:** `/haberler/{haber-slug}`
**Tekil Layout:**
- Baslik & Kapak Gorseli
- Tarih & Yazar
- Kategori & Tag Etiketleri
- Haber Icerigi (Zengin metin, gorseller, videolar)
- Iliskili Haberler (Benzer tag/kategorideki diger haberler)
- Paylasim Butonlari
- Footer

**Taksonomi Iliskileri:**
- Haber Taglari
- Haber Kategorileri

---

### Etkinlikler
**URL Yapisi:** `/etkinlikler/{etkinlik-slug}`
**Tekil Layout:**
- Baslik & Kapak Gorseli
- Tarih, Saat, Konum Bilgisi
- Etkinlik Turu Etiketi (Workshop, Seminer, Konferans, vb.)
- Etkinlik Aciklamasi (Zengin metin)
- Konusmacilar / Katilimcilar (Kisi sayfalarina baglanti)
- Kayit Formu veya Linki (Yaklaşan etkinlikler icin)
- Galeri (Gecmis etkinlikler icin)
- Footer

---

### Blog
**URL Yapisi:** `/blog/{yazi-slug}`
**Tekil Layout:**
- Baslik & Kapak Gorseli
- Tarih & Yazar (Kisi sayfasina baglanti)
- Kategori & Tag Etiketleri
- Yazi Icerigi (Zengin metin, kod bloklari, gorseller)
- Yazar Bilgi Kutusu (Kisa bio, foto)
- Iliskili Yazilar
- Yorum Alani (Opsiyonel)
- Paylasim Butonlari
- Footer

**Taksonomi Iliskileri:**
- Yazi Taglari
- Yazi Kategorileri

---
---

## Taglar (Etiketler)

Icerikleri yatay olarak gruplayan, hiyerarsik olmayan siniflandirma yapisi. Her tag bir listeleme sayfasi olusturur.

### Yazi Taglari
**URL Yapisi:** `/tag/yazi/{tag-slug}`
**Aciklama:** Blog yazilarini etiketlemek icin kullanilir.
**Listeleme Sayfasi Layout:**
- Tag Adi & Aciklamasi
- Bu tag'e sahip tum blog yazilari (Kart listesi)
- Sayfalama
- Footer

**Ornek Taglar:**

| Tag Adi | Slug |
|---|---|
| Makine Ogrenimi | `makine-ogrenimi` |
| Termoelektrik | `termoelektrik` |
| Mikro Robotik | `mikro-robotik` |
| Mekatronik | `mekatronik` |
| Kraniofasiyal Muhendislik | `kraniofasiyal-muhendislik` |
| Norocerrahi Muhendisligi | `norocerrahi-muhendisligi` |
| Sonlu Elemanlar Analizi | `sonlu-elemanlar-analizi` |
| 3D Baski | `3d-baski` |

---

### Haber Taglari
**URL Yapisi:** `/tag/haber/{tag-slug}`
**Aciklama:** Haberleri etiketlemek icin kullanilir.
**Listeleme Sayfasi Layout:**
- Tag Adi & Aciklamasi
- Bu tag'e sahip tum haberler (Kart listesi)
- Sayfalama
- Footer

**Ornek Taglar:**

| Tag Adi | Slug |
|---|---|
| TUBITAK | `tubitak` |
| AB Projesi | `ab-projesi` |
| Konferans | `konferans` |
| Odul | `odul` |
| Isbirligi | `isbirligi` |
| Tez Savunmasi | `tez-savunmasi` |

---

### Ekipman Taglari
**URL Yapisi:** `/tag/ekipman/{tag-slug}`
**Aciklama:** Laboratuvar ekipmanlarini etiketlemek icin kullanilir.
**Listeleme Sayfasi Layout:**
- Tag Adi & Aciklamasi
- Bu tag'e sahip tum ekipmanlar (Kart listesi)
- Footer

**Ornek Taglar:**

| Tag Adi | Slug |
|---|---|
| Olcum Aleti | `olcum-aleti` |
| Termal Test | `termal-test` |
| Mikrofabrikasyon | `mikrofabrikasyon` |
| Goruntuleme | `goruntuleme` |

---
---

## Kategoriler

Icerikleri dikey olarak siniflandiran, hiyerarsik yapiyi destekleyen siniflandirma yapisi. Her kategori bir listeleme sayfasi olusturur.

### Kategoriler -- Haberler
**URL Yapisi:** `/kategori/haber/{kategori-slug}`
**Aciklama:** Haberleri konularina gore siniflandirir.
**Listeleme Sayfasi Layout:**
- Kategori Adi & Aciklamasi
- Bu kategorideki tum haberler (Kart listesi, tarih sirali)
- Sayfalama
- Footer

**Ornek Kategoriler:**

| Kategori Adi | Slug |
|---|---|
| Proje Haberleri | `proje-haberleri` |
| Akademik Basarilar | `akademik-basarilar` |
| Etkinlik Duyurulari | `etkinlik-duyurulari` |
| Laboratuvar Gelismeleri | `lab-gelismeleri` |
| Medya Yansimalari | `medya-yansimalari` |

---

### Kategoriler -- Yazilar (Blog)
**URL Yapisi:** `/kategori/yazi/{kategori-slug}`
**Aciklama:** Blog yazilarini konularina gore siniflandirir.
**Listeleme Sayfasi Layout:**
- Kategori Adi & Aciklamasi
- Bu kategorideki tum blog yazilari (Kart listesi, tarih sirali)
- Sayfalama
- Footer

**Ornek Kategoriler:**

| Kategori Adi | Slug |
|---|---|
| Arastirma Notlari | `arastirma-notlari` |
| Teknik Yazilar | `teknik-yazilar` |
| Lab Kultur & Yasam | `lab-kultur-yasam` |
| Rehberler & Egitim | `rehberler-egitim` |

---

### Ekipman (Donanim) Kategorileri
**URL Yapisi:** `/kategori/ekipman/{kategori-slug}`
**Aciklama:** Laboratuvar donanim ve ekipmanlarini turlerine gore siniflandirir.
**Listeleme Sayfasi Layout:**
- Kategori Adi & Aciklamasi
- Bu kategorideki tum ekipmanlar (Kart listesi)
- Footer

**Ornek Kategoriler:**

| Kategori Adi | Slug |
|---|---|
| Laboratuvar Donanimi | `lab-donanimi` |
| Deney Donanimi | `deney-donanimi` |
| Simulasyon Donanimi | `simulasyon-donanimi` |
| Olcum & Test Donanimi | `olcum-test-donanimi` |

---
---

## Global Komponentler

Birden fazla sayfada tekrar eden, site genelinde kullanilan arayuz bilesenleri.

### Masaustu -- Mega Menu
**Gorunurluk:** Tum masaustu sayfalarda, header icinde
**Layout:**
- Logo (Sol taraf)
- Ana Navigasyon Linkleri:
  - Anasayfa
  - Hakkinda
  - Arastirmalar (Mega menu acilir)
    - Arastirma Alanlari (Alt baslantiler)
    - Projeler
    - Yayinlar
  - Ekip
  - Donanim
  - Dersler
  - Haberler & Etkinlikler
  - Blog
- Sag Taraf Aksiyonlar:
  - Dil Degistirme (TR / EN)
  - Arama Butonu
  - Bize Katil / Basvur CTA Butonu

---

### Mobil Header & Hamburger Menu
**Gorunurluk:** Tum mobil sayfalarda
**Layout:**
- Logo (Sol taraf)
- Hamburger Menu Ikonu (Sag taraf)
- Acilir Tam Ekran Menu:
  - Tum navigasyon linkleri (Accordion yapisiyla alt menuleri acar)
  - Dil Degistirme
  - Arama
  - Bize Katil / Basvur CTA

---

### Footer
**Gorunurluk:** Tum sayfalarda, sayfanin en altinda
**Layout:**
- Logo & Lab Kisa Tanitimi
- Hizli Linkler (Anasayfa, Hakkinda, Arastirmalar, Ekip, Iletisim)
- Iletisim Bilgileri (Adres, telefon, e-posta)
- Sosyal Medya Ikonlari (Twitter/X, LinkedIn, YouTube, Google Scholar, GitHub)
- Bagla Kurum Logolari (Universite, fakulte)
- Yasal Linkler (Gizlilik, KVKK, Aydinlatma Metni)
- Telif Hakki Notu

---

### Gorusunuzu Iletin Formu (Geri Bildirim)
**Gorunurluk:** Secili sayfalarda floating buton veya sidebar ile
**Layout:**
- Acilir/Kapanir Panel veya Modal
- Ad Soyad Alani
- E-posta Alani
- Konu Secimi (Dropdown: Genel, Basvuru, Isbirligi, Sikayet, Oneri)
- Mesaj Alani (Textarea)
- KVKK Onay Checkbox'i
- Gonder Butonu

---

### Cerez Bildirimi Banner
**Gorunurluk:** Ilk ziyarette tum sayfalarda
**Layout:**
- Cerez kullanim bilgilendirmesi
- Kabul Et / Reddet / Ayarlar butonlari
- Gizlilik sayfasina baglanti

---

### Arama Overlay
**Gorunurluk:** Arama butonuna tiklandiginda tum sayfalarda
**Layout:**
- Tam ekran veya dropdown arama paneli
- Arama input alani
- Anlık sonuclar (Sayfalar, kisiler, yayinlar, haberler)
- Kategori bazli sonuc gruplama

---
---

## Temel Konular / Referans Tablolari

### Arastirma Gruplari

| Arastirma Grubu | Slug |
|---|---|
| Thermoelectric Research Group | `thermoelectric-research` |
| Craniofacial and Neurosurgery Engineering | `craniofacial-neurosurgery` |
| Microrobotics and Mechatronics | `microrobotics-mechatronics` |

### Proje Durumlari

| Durum |
|---|
| Devam Eden |
| Tamamlanan |
| Iptal Edilen |

### Fon Kaynaklari

| Kaynak |
|---|
| TUBITAK |
| AB / Horizon |
| Universite BAP |
| Sanayi Isbirligi |
| Diger |

### Yayin Turleri

| Tur |
|---|
| Dergi Makaleleri |
| Konferans Bildirileri |
| Yuksek Lisans Tezleri |
| Doktora Tezleri |

### Ekip Dereceleri / Unvanlari

| Derece |
|---|
| Profesor |
| Docent |
| Asistan Docent |
| Arastirma Gorevlisi |
| Bagimsiz Arastirmaci |
| Arastirma Yardimcisi |
| Doktora Ogrencisi |
| Yuksek Lisans Ogrencisi |
| Stajyer |
| Mezun (Alumni) |

### Etkinlik Turleri

| Tur |
|---|
| Seminer |
| Workshop |
| Konferans |
| Tez Savunmasi |
| Lab Acik Gunu |
| Misafir Konusmaci |

---
---

## Sayfa Hiyerarsi Semasi

```
/                                    Anasayfa
/hakkinda                            Hakkinda
/arastirmalar                        Arastirmalar (Genel bakis)
  /arastirmalar/alanlar/{slug}       Arastirma Alani (Tekil)
  /arastirmalar/projeler             Projeler (Listeleme)
  /arastirmalar/projeler/{slug}      Proje (Tekil)
/yayinlar                            Yayinlar (Listeleme)
  /yayinlar/{slug}                   Yayin (Tekil)
/ekip                                Ekip (Listeleme)
  /ekip/{slug}                       Kisi Sayfasi (Tekil)
/donanim                             Donanim (Listeleme)
  /donanim/{slug}                    Donanim (Tekil)
/dersler                             Dersler (Listeleme)
  /dersler/{slug}                    Ders (Tekil)
/haberler                            Haberler (Listeleme)
  /haberler/{slug}                   Haber (Tekil)
/etkinlikler                         Etkinlikler (Listeleme)
  /etkinlikler/{slug}                Etkinlik (Tekil)
/blog                                Blog (Listeleme)
  /blog/{slug}                       Blog Yazisi (Tekil)
/basvur                              Bize Katil / Basvur
/iletisim                            Iletisim
/kurumsal-kimlik                     Kurumsal Kimlik Dokumani
/gizlilik                            Gizlilik ve Cerezler
/kvkk                                KVKK
/aydinlatma-metni                    Aydinlatma Metni
/tag/yazi/{slug}                     Yazi Tag Arsivi
/tag/haber/{slug}                    Haber Tag Arsivi
/tag/ekipman/{slug}                  Ekipman Tag Arsivi
/kategori/haber/{slug}               Haber Kategori Arsivi
/kategori/yazi/{slug}                Yazi Kategori Arsivi
/kategori/ekipman/{slug}             Ekipman Kategori Arsivi
```
