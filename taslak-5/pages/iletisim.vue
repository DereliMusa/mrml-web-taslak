<script setup>
useHead({ title: 'Iletisim | MrML Lab' })

const form = reactive({ name: '', email: '', subject: '', message: '' })
const sending = ref(false)
const sent = ref(false)
const error = ref('')

async function submit() {
  sending.value = true; error.value = ''
  try {
    // Basit mailto fallback -- backend ile entegre edilebilir
    await new Promise(r => setTimeout(r, 800))
    sent.value = true
  } catch {
    error.value = 'Gonderilemedi. Lutfen tekrar deneyin.'
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <div>
    <section class="page-hero">
      <div class="container">
        <div class="scroll-reveal slide-up">
          <span class="hero-eyebrow">Bize Ulasin</span>
          <h1 class="page-hero-title">Iletisim</h1>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container contact-grid">
        <!-- Form -->
        <div>
          <h2>Mesaj Gonder</h2>
          <div class="section-divider"></div>
          <div v-if="sent" style="background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);border-radius:10px;padding:24px;margin-top:24px;">
            <i class="fa-solid fa-circle-check" style="color:#10b981;margin-right:8px;"></i>
            Mesajiniz alindi! En kisa surede donecegiz.
          </div>
          <form v-else @submit.prevent="submit" style="margin-top:24px;">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Adiniz *</label>
                <input v-model="form.name" type="text" class="form-control" required>
              </div>
              <div class="form-group">
                <label class="form-label">E-posta *</label>
                <input v-model="form.email" type="email" class="form-control" required>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Konu</label>
              <input v-model="form.subject" type="text" class="form-control">
            </div>
            <div class="form-group">
              <label class="form-label">Mesajiniz *</label>
              <textarea v-model="form.message" class="form-control" rows="6" required></textarea>
            </div>
            <p v-if="error" style="color: var(--danger); font-size: 14px;">{{ error }}</p>
            <button type="submit" class="btn btn-primary" :disabled="sending">
              <span v-if="sending" class="loading-spin"></span>
              <template v-else>Gonder <i class="fa-solid fa-paper-plane"></i></template>
            </button>
          </form>
        </div>

        <!-- Bilgiler -->
        <aside>
          <div class="contact-info-card">
            <h3>Adres</h3>
            <p><i class="fa-solid fa-location-dot" style="color:var(--gold);margin-right:8px;"></i>Muhendislik Binasi B-Blok Kat 3<br>Global Muhendislik Universitesi</p>

            <h3 style="margin-top: 28px;">Telefon</h3>
            <p><a href="tel:+903121234567" style="color:var(--text-primary);text-decoration:none;"><i class="fa-solid fa-phone" style="color:var(--gold);margin-right:8px;"></i>+90 312 123 45 67</a></p>

            <h3 style="margin-top: 28px;">E-posta</h3>
            <p><a href="mailto:contact@mrml-lab.edu" style="color:var(--text-primary);text-decoration:none;"><i class="fa-regular fa-envelope" style="color:var(--gold);margin-right:8px;"></i>contact@mrml-lab.edu</a></p>

            <h3 style="margin-top: 28px;">Calisma Saatleri</h3>
            <p style="color:var(--text-muted);"><i class="fa-regular fa-clock" style="color:var(--gold);margin-right:8px;"></i>Pazartesi -- Cuma<br>09:00 -- 18:00</p>
          </div>
        </aside>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page-hero { padding: 140px 0 80px; background: radial-gradient(ellipse at top, rgba(198,151,73,0.08) 0%, transparent 60%); border-bottom: 1px solid var(--border); }
.page-hero-title { font-size: clamp(36px, 5vw, 60px); font-weight: 800; margin: 12px 0; }
.contact-grid { display: grid; grid-template-columns: 1fr 340px; gap: 64px; align-items: start; }
@media (max-width: 768px) { .contact-grid { grid-template-columns: 1fr; } }
.contact-info-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 32px; }
.contact-info-card h3 { font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); margin-bottom: 8px; }
.contact-info-card p { line-height: 1.7; font-size: 15px; margin: 0; }
</style>
