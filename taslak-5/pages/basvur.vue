<script setup>
useHead({ title: 'Basvur | MrML Lab' })
useScrollReveal()

const positions = [
  { title: 'Doktora Ogrencisi', desc: 'Termoelektrik malzeme veya mikro robotik alaninda doktora pozisyonlari. TUBITAK bursu imkani ile.', areas: ['Termoelektrik', 'Mikro Robotik'], icon: 'fa-solid fa-graduation-cap' },
  { title: 'Postdok Arastirmaci', desc: 'Biyomekanik veya mekatronik tasarim alanlarinda deneyimli postdok pozisyonu.', areas: ['Biyomekanik', 'Mekatronik'], icon: 'fa-solid fa-flask' },
  { title: 'Yuksek Lisans Ogrencisi', desc: 'Mekatronik, biyomedikal muhendislik veya malzeme bilimi altyapisi ile yuksek lisans.', areas: ['Tum Alanlar'], icon: 'fa-solid fa-user-graduate' },
]
</script>

<template>
  <div>
    <section class="page-hero">
      <div class="container">
        <div class="scroll-reveal slide-up">
          <span class="hero-eyebrow">Kariyer</span>
          <h1 class="page-hero-title">Ekibimize <span class="accent-text">Katil</span></h1>
          <p class="page-hero-sub">Merak ve tutkuyla hareket eden arastirmacilari ariyoruz. Birlikte bilimin sinirlarini zorlayalim.</p>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-header scroll-reveal slide-up"><h2>Acik Pozisyonlar</h2></div>
        <div class="positions-list">
          <div v-for="(pos, i) in positions" :key="i" class="position-card scroll-reveal slide-up" :data-delay="i * 100">
            <div class="position-icon"><i :class="pos.icon"></i></div>
            <div class="position-info">
              <h3>{{ pos.title }}</h3>
              <p>{{ pos.desc }}</p>
              <div class="position-tags">
                <span v-for="area in pos.areas" :key="area" class="badge badge-gold">{{ area }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Form -->
        <div class="apply-form scroll-reveal slide-up" style="margin-top:64px;">
          <h2>Basvuru Formu</h2>
          <div class="section-divider"></div>
          <p style="color:var(--text-muted);margin-bottom:32px;">Ozgecmis ve niyet mektubunuzu asagidaki e-posta adresine gonderin veya formu doldurun.</p>
          <div class="form-row">
            <div class="form-group"><label class="form-label">Adiniz *</label><input type="text" class="form-control"></div>
            <div class="form-group"><label class="form-label">E-posta *</label><input type="email" class="form-control"></div>
          </div>
          <div class="form-group">
            <label class="form-label">Ilgilendiginiz Pozisyon</label>
            <select class="form-control">
              <option v-for="p in positions" :key="p.title" :value="p.title">{{ p.title }}</option>
            </select>
          </div>
          <div class="form-group"><label class="form-label">Motivasyon Mektubu</label><textarea class="form-control" rows="6" placeholder="Neden MrML Lab? Arastirma ilginiz nedir?"></textarea></div>
          <button class="btn btn-primary">Basvuruyu Gonder <i class="fa-solid fa-paper-plane"></i></button>
          <p style="font-size:13px;color:var(--text-muted);margin-top:12px;">Veya direkt e-posta: <a href="mailto:join@mrml-lab.edu" style="color:var(--gold);">join@mrml-lab.edu</a></p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page-hero { padding: 140px 0 80px; background: radial-gradient(ellipse at top, rgba(198,151,73,0.08) 0%, transparent 60%); border-bottom: 1px solid var(--border); }
.page-hero-title { font-size: clamp(36px, 5vw, 60px); font-weight: 800; margin: 12px 0; }
.page-hero-sub { color: var(--text-muted); font-size: 18px; max-width: 540px; }
.positions-list { display: flex; flex-direction: column; gap: 20px; margin-top: 24px; }
.position-card { display: flex; gap: 24px; background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 28px; transition: border-color 0.2s; }
.position-card:hover { border-color: var(--gold); }
.position-icon { width: 52px; height: 52px; border-radius: 12px; background: rgba(198,151,73,0.12); color: var(--gold); display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
.position-info h3 { font-size: 18px; font-weight: 700; margin-bottom: 8px; }
.position-info p { color: var(--text-muted); font-size: 14px; line-height: 1.6; margin-bottom: 14px; }
.position-tags { display: flex; gap: 8px; flex-wrap: wrap; }
.apply-form { max-width: 700px; }
</style>
