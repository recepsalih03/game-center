# Game Center Projesi

Bu proje, şirket içi etkinlikler veya arkadaş grupları için tasarlanmış, web tabanlı, gerçek zamanlı ve çok oyunculu bir oyun platformudur. Lerna ve NPM Workspaces kullanılarak modüler bir monorepo yapısında geliştirilmiştir.

## ✨ Temel Özellikler

- **Kullanıcı Sistemi:** JWT (JSON Web Token) tabanlı güvenli kullanıcı girişi ve kimlik doğrulama.
- **Dinamik Oyun Mimarisi:** Anasayfada mevcut oyunları listeler ve yeni oyunların kolayca eklenebileceği modüler bir yapı sunar.
- **Gerçek Zamanlı Lobi Sistemi:** Socket.IO kullanılarak oluşturulan, anlık olarak güncellenen lobi sistemi.
  - Şifreli veya şifresiz lobi oluşturma.
  - Aktif lobilere katılma ve lobiden ayrılma.
  - Lobi içinden diğer oyunculara gerçek zamanlı davet gönderme.
  - Lobi kurucusunun tek tuşla oyunu başlatması ve tüm lobi üyelerinin otomatik olarak oyuna yönlendirilmesi.
- **Oynanabilir Tombala Oyunu:**
  - İstemci tarafından yönetilen sayı çekme ve sunucu tarafından tüm oyunculara senkronize edilmesi.
  - Kart üzerinde manuel işaretleme.
  - "Çinko" ve "Tombala" kazanma durumlarının sunucu tarafından doğrulanması.
  - Oyun sonu ve kazananın tüm oyunculara ilan edilmesi.
- **Gelişmiş Bildirimler:**
  - `react-toastify` ile modern bildirim pencereleri.
  - Uygulama sekmesi aktif değilken sesli ve sekme başlığı ile yanıp sönen bildirimler.
- **Tema Desteği:** Aydınlık ve Karanlık mod arasında geçiş yapabilen ve kullanıcının tercihini hatırlayan arayüz.

## 🏗️ Proje Yapısı

Proje, Lerna ile yönetilen bir monorepo yapısındadır. Ana paketler `packages/` klasörü altında yer alır:

-   **/packages/client:** React ile geliştirilen, kullanıcı arayüzünü içeren ana istemci uygulaması.
-   **/packages/server:** Node.js ve Express ile geliştirilen, API ve WebSocket sunucusunu içeren arka uç uygulaması.
-   **/packages/config:** Paketler arasında paylaşılan konfigürasyon dosyalarını (örneğin, kullanıcı listesi) içerir.

## 🛠️ Kullanılan Teknolojiler

### Frontend (Client)
- **React 18**
- **TypeScript**
- **Material-UI (MUI v5)**: Arayüz bileşenleri için.
- **React Router v6:** Sayfa yönlendirmeleri için.
- **Socket.IO Client:** Gerçek zamanlı iletişim için.
- **Axios:** API istekleri için.
- **React Toastify:** Bildirimler için.

### Backend (Server)
- **Node.js**
- **Express.js:** API sunucusu için.
- **TypeScript**
- **Socket.IO:** Gerçek zamanlı iletişim ve oyun motoru için.
- **JWT (jsonwebtoken):** Kimlik doğrulama için.

## 🚀 Kurulum ve Başlatma

1.  **Tombala Oyununu Klonlama
    Öncelikle bu ana `game-center` reposunu bilgisayarınıza klonlayın.  
    cd packages
    git clone https://github.com/recepsalih03/game-tombala.git game-tombala

2.  **Bağımlılıkları Yükleme:**
    Projenin ana dizininde aşağıdaki komutu çalıştırarak tüm paketlerin bağımlılıklarını kurun. Bu komut, `react-scripts` ve `TypeScript 5` arasındaki versiyon uyuşmazlığını giderir.
    npm install --legacy-peer-deps

3.  **Alt Paketleri Derleme:**
    `client` uygulamasının `server` ve `game-tombala` paketlerindeki değişiklikleri görebilmesi için bu paketlerin derlenmesi (build edilmesi) gerekir.

    npm run build --workspace=server
    npm run build --workspace=game-tombala

4.  **Geliştirme Sunucularını Başlatma:**
    Aşağıdaki komut, hem backend sunucusunu (`localhost:4000`) hem de frontend geliştirme sunucusunu (`localhost:3000`) aynı anda başlatır.
    npm run dev

## 👤 Test Kullanıcı Bilgileri

Giriş yapmak için aşağıdaki kullanıcı bilgilerini kullanabilirsiniz. Tüm kullanıcıların şifresi aynıdır.

-   **Kullanıcı Adları:** `recep_salih`, `deneme_hesap`, `hesap_deneme`, `kullanici`
-   **Şifre (hepsi için):** `sifre1234`

---