// server/utils/email.js
// Gmail SMTP ile OTP e-postasi gonderimi

import nodemailer from 'nodemailer'
import { getSetting } from './db'

export async function sendOTPEmail(email, token, scope) {
  const mode = getSetting('smtp_mode')
  const expireHours = parseInt(getSetting('otp_expire_hours') || '24')
  
  // Site'in dis adresi (prod'da gercek domain olacak)
  const baseUrl = process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3737'
  const link = `${baseUrl}/admin/?token=${token}`

  // Her zaman konsola yaz (debug icin)
  console.log('\n===== OTP TOKEN =====')
  console.log(`Alici: ${email} | Kapsam: ${scope} | Gecerlilik: ${expireHours}h`)
  console.log(`Token: ${token}`)
  console.log(`Link: ${link}`)
  console.log('=====================\n')

  if (mode !== 'smtp') return

  const host = getSetting('smtp_host')
  const port = parseInt(getSetting('smtp_port') || '587')
  const user = getSetting('smtp_user')
  const pass = getSetting('smtp_pass')

  if (!host || !user || !pass) {
    console.warn('SMTP ayarlari eksik, sadece log modunda calisiliyor.')
    return
  }

  const scopeLabels = { blog: 'Blog', news: 'Haber', publications: 'Yayin', full: 'Tam Erisim' }
  const scopeLabel = scopeLabels[scope] || scope

  const transporter = nodemailer.createTransport({
    host, port,
    secure: port === 465,
    auth: { user, pass },
  })

  await transporter.sendMail({
    from: `"MrML Lab" <${user}>`,
    to: email,
    subject: `MrML Lab -- Gecici Giris Linkiniz (${scopeLabel})`,
    html: `<!DOCTYPE html>
<html lang="tr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;padding:40px 20px;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="background:#111118;border:1px solid rgba(255,255,255,0.07);border-radius:12px;overflow:hidden;">
        <tr><td style="background:#18181f;padding:24px 32px;border-bottom:1px solid rgba(255,255,255,0.07);">
          <span style="font-size:22px;font-weight:800;letter-spacing:-0.5px;">
            <span style="color:#f0f0f0;">Mr</span><span style="color:#C69749;">ML</span>
            <span style="color:#5a5d70;font-weight:400;font-size:17px;"> Lab</span>
          </span>
        </td></tr>
        <tr><td style="padding:32px 32px 28px;">
          <p style="color:#b0b3c6;font-size:14px;margin:0 0 8px;">Merhaba,</p>
          <h1 style="color:#f0f0f0;font-size:20px;font-weight:700;margin:0 0 20px;line-height:1.3;">Admin paneline giris icin gecici linkiniz hazir.</h1>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#18181f;border:1px solid rgba(255,255,255,0.07);border-radius:8px;margin-bottom:28px;">
            <tr><td style="padding:14px 18px;border-bottom:1px solid rgba(255,255,255,0.07);">
              <span style="color:#5a5d70;font-size:11px;text-transform:uppercase;letter-spacing:1px;">Erisim Kapsami</span>
              <div style="color:#C69749;font-size:14px;font-weight:600;margin-top:4px;">${scopeLabel}</div>
            </td></tr>
            <tr><td style="padding:14px 18px;">
              <span style="color:#5a5d70;font-size:11px;text-transform:uppercase;letter-spacing:1px;">Gecerlilik Suresi</span>
              <div style="color:#f0f0f0;font-size:14px;font-weight:600;margin-top:4px;">${expireHours} saat &bull; Tek kullanimlik</div>
            </td></tr>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center" style="padding-bottom:28px;">
              <a href="${link}" style="display:inline-block;background:#C69749;color:#0a0a0f;padding:14px 36px;border-radius:6px;text-decoration:none;font-weight:700;font-size:15px;">
                Admin Paneline Giris Yap
              </a>
            </td></tr>
          </table>
          <div style="background:#0a0a0f;border:1px solid rgba(255,255,255,0.05);border-radius:6px;padding:12px 16px;margin-bottom:24px;">
            <p style="color:#5a5d70;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin:0 0 6px;">Buton calismiyorsa token kodunu girin</p>
            <code style="color:#C69749;font-size:13px;letter-spacing:1px;word-break:break-all;">${token}</code>
            <p style="color:#6366f1;font-size:11px;word-break:break-all;margin:4px 0 0;"><a href="${link}" style="color:#6366f1;">${link}</a></p>
          </div>
        </td></tr>
        <tr><td style="background:#0d0d14;padding:20px 32px;border-top:1px solid rgba(255,255,255,0.05);">
          <p style="color:#3a3d50;font-size:12px;margin:0;line-height:1.6;">Bu e-posta MrML Lab admin paneli tarafindan otomatik gonderilmistir. Bu istegi siz yapmadiysa dikkate almayin.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  })

  console.log(`E-posta ${email} adresine gonderildi.`)
}
