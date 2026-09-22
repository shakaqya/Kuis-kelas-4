(function(){
'use strict';
const KEY='kelas4_quiz_history_v1';
const esc=s=>String(s??'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
function qs(){return [...document.querySelectorAll('input[type="radio"][name],input[type="checkbox"][name]')];}
function groups(){const seen=new Set(),a=[];qs().forEach(x=>{if(!seen.has(x.name)){seen.add(x.name);a.push(x.name)}});return a;}
function questionBox(name){const x=document.querySelector('input[name="'+CSS.escape(name)+'"]');return x&&x.closest('.q,.card,.question,section,article,fieldset,div');}
function getTitle(box,i){return (box?.querySelector('h2,h3,h4,p')?.innerText||('Soal '+(i+1))).trim();}
function method(title){
 const t=title.toLowerCase();
 if(/what time|time is it|o'clock|jam/.test(t)) return 'Perhatikan informasi waktu pada soal. Cocokkan angka/jarum atau keterangan waktunya, lalu pilih jawaban yang sesuai.';
 if(/how many|berapa/.test(t)) return 'Cari jumlah yang ditanyakan. Hitung atau gunakan informasi pada soal, lalu cocokkan dengan pilihan jawaban.';
 if(/where|di mana|next to|behind|between|in front/.test(t)) return 'Cari kata yang menunjukkan tempat atau posisi. Perhatikan hubungan antarobjek, kemudian pilih posisi yang tepat.';
 if(/does|do you|is |are |has |have |can |must|should/.test(t)) return 'Perhatikan kata tanya dan pola kalimat. Tentukan informasi yang diminta, lalu cocokkan dengan pilihan yang paling tepat.';
 if(/which|what|who|when|why|how/.test(t)) return 'Baca kata tanya dengan teliti. Tentukan informasi yang diminta, kemudian bandingkan semua pilihan sebelum memilih.';
 return 'Baca soal sampai selesai, tentukan kata kunci, hubungkan dengan materi, bandingkan pilihan jawaban, lalu pilih jawaban yang paling sesuai.';
}
function injectStyle(){
 if(document.getElementById('k4q-style'))return;
 const s=document.createElement('style');s.id='k4q-style';s.textContent='.k4q-panel{background:#fff;border-radius:18px;padding:18px;margin:18px 0;box-shadow:0 5px 18px #0002}.k4q-row{display:flex;gap:10px;flex-wrap:wrap;align-items:center}.k4q-row input{flex:1;min-width:220px;padding:11px;border:1px solid #bbb;border-radius:10px}.k4q-btn{border:0;border-radius:10px;padding:11px 15px;font-weight:800;cursor:pointer;background:#176b4b;color:#fff}.k4q-btn.alt{background:#283593}.k4q-btn.warn{background:#ef6c00}.k4q-history{margin-top:12px}.k4q-history div{padding:9px;border-bottom:1px solid #ddd}.k4q-review{margin-top:18px}.k4q-card{border:1px solid #ddd;border-radius:14px;padding:14px;margin:10px 0;background:#fafafa}.k4q-card .method{background:#eef7ff;border-radius:10px;padding:10px;margin-top:10px}.k4q-card .chosen{font-weight:700}.k4q-card .unanswered{color:#b71c1c}.k4q-note{font-size:13px;color:#607d8b;margin-top:7px}';
 document.head.appendChild(s);
}
function resultText(){const el=document.querySelector('#score,.score,#result');return el?.innerText||''}
function numericScore(){
 const t=resultText(),m=t.match(/(\d+)\s*\/\s*(\d+)/);if(m)return {correct:+m[1],total:+m[2],nilai:Math.round(+m[1]/+m[2]*100)};
 const p=t.match(/(\d+(?:[.,]\d+)?)\s*%/);if(p)return {correct:null,total:null,nilai:Math.round(parseFloat(p[1].replace(',','.')))};
 return null;
}
function history(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return[]}}
function renderHistory(){
 const el=document.getElementById('k4q-history');if(!el)return;
 const h=history();el.innerHTML=h.length?h.map((x,i)=>'<div><b>'+esc((i+1)+'. '+x.nama)+'</b> — '+esc(x.nilai+' ('+(x.correct==null?'hasil tersimpan':x.correct+'/'+x.total)+')')+'<br><small>'+esc(x.quiz)+' · '+esc(x.waktu)+'</small></div>').join(''):'Belum ada nilai tersimpan pada perangkat ini.';
}
function buildReview(){
 const old=document.getElementById('k4q-review');if(old)old.remove();
 const gs=groups();if(!gs.length)return;
 const wrap=document.createElement('section');wrap.id='k4q-review';wrap.className='k4q-panel k4q-review';
 wrap.innerHTML='<h2>📝 Koreksi & Cara Mengerjakan</h2><p class="k4q-note">Setiap soal ditampilkan kembali bersama jawaban siswa dan langkah pengerjaannya.</p>';
 gs.forEach((name,i)=>{
   const box=questionBox(name);if(!box)return;
   const title=getTitle(box,i);
   const opts=[...box.querySelectorAll('label')].filter(l=>l.querySelector('input[name="'+CSS.escape(name)+'"]'));
   const chosen=[...box.querySelectorAll('input[name="'+CSS.escape(name)+'"]:checked')].map(x=>x.closest('label')?.innerText?.trim()||x.value);
   const card=document.createElement('div');card.className='k4q-card';
   card.innerHTML='<b>'+esc(title)+'</b><div style="margin-top:8px">'+(chosen.length?'<span class="chosen">Jawabanmu: '+esc(chosen.join(', '))+'</span>':'<span class="unanswered">Belum dijawab</span>')+'</div><div class="method"><b>📖 Cara mengerjakan:</b> '+esc(method(title))+'</div>';
   wrap.appendChild(card);
 });
 const target=document.querySelector('#result,.result')||document.querySelector('form')||document.body;target.insertAdjacentElement('afterend',wrap);
 wrap.scrollIntoView({behavior:'smooth',block:'start'});
}
function doCheck(){
 const candidates=[...document.querySelectorAll('button,input[type="button"],input[type="submit"]')].filter(b=>/periksa|check|lihat nilai|lihat hasil/i.test(b.innerText||b.value||'')&&!b.closest('#k4q-panel'));
 const b=candidates[0];if(b)b.click();
 setTimeout(()=>{buildReview();saveIfScore(false)},250);
}
function saveIfScore(force){
 const s=numericScore();if(!s){if(force)alert('Periksa nilai terlebih dahulu, lalu tekan Simpan Nilai.');return}
 const nama=(document.getElementById('k4q-name')?.value||'Siswa').trim()||'Siswa';
 const item={nama,nilai:s.nilai,correct:s.correct,total:s.total,quiz:document.title||location.pathname,waktu:new Date().toLocaleString('id-ID')};
 const h=history();h.unshift(item);localStorage.setItem(KEY,JSON.stringify(h.slice(0,100)));renderHistory();
 const msg=document.getElementById('k4q-save-msg');if(msg)msg.textContent='✅ Nilai tersimpan: '+nama+' — '+s.nilai;
}
function setup(){
 injectStyle();
 if(document.getElementById('k4q-panel'))return;
 const panel=document.createElement('section');panel.id='k4q-panel';panel.className='k4q-panel';
 panel.innerHTML='<h2>🎓 Penilaian Quiz</h2><div class="k4q-row"><input id="k4q-name" placeholder="Nama siswa" autocomplete="name"><button class="k4q-btn" id="k4q-check">✅ Periksa Nilai</button><button class="k4q-btn alt" id="k4q-correct">📝 Koreksi & Cara Mengerjakan</button><button class="k4q-btn" id="k4q-save">💾 Simpan Nilai</button><button class="k4q-btn warn" id="k4q-reset">🔄 Ulangi Quiz</button></div><div id="k4q-save-msg" class="k4q-note"></div><h3>📊 Riwayat Nilai</h3><div id="k4q-history" class="k4q-history"></div>';
 const form=document.querySelector('form');if(form)form.insertAdjacentElement('afterend',panel);else document.body.insertBefore(panel,document.body.firstChild);
 const nm=localStorage.getItem('k4q-name')||'';document.getElementById('k4q-name').value=nm;
 document.getElementById('k4q-name').addEventListener('input',e=>localStorage.setItem('k4q-name',e.target.value));
 document.getElementById('k4q-check').onclick=doCheck;
 document.getElementById('k4q-correct').onclick=()=>{doCheck()};
 document.getElementById('k4q-save').onclick=()=>saveIfScore(true);
 document.getElementById('k4q-reset').onclick=()=>{if(form)form.reset();const r=document.querySelector('#result,.result');if(r)r.style.display='none';const v=document.getElementById('k4q-review');if(v)v.remove();document.getElementById('k4q-save-msg').textContent='';window.scrollTo({top:0,behavior:'smooth'})};
 renderHistory();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
})();