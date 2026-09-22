/* Universal quiz review helper for Kuis-kelas-4 */
(function(){
var st=document.createElement('style');st.textContent=".universal-review{background:#fff;border-radius:20px;padding:20px;margin:20px 0;box-shadow:0 6px 22px #0002;border:2px solid #c5d8ff}.ur-top{padding:10px 14px;background:#f3f7ff;border-radius:12px;margin-bottom:14px}.ur-item{background:#f8fbff;border:1px solid #d8e5f5;border-radius:16px;padding:16px;margin:14px 0}.ur-correct{border-left:7px solid #2e7d32}.ur-wrong{border-left:7px solid #c62828}.ur-q{font-size:18px;font-weight:800;line-height:1.5;margin:6px 0 12px}.ur-options{display:grid;gap:7px}.ur-opt{padding:9px 11px;border-radius:10px;background:#fff;border:1px solid #ddd}.ur-opt.correct{background:#e8f5e9;border:2px solid #43a047;font-weight:800}.ur-opt.selected{box-shadow:inset 5px 0 #1565c0}.ur-method{margin-top:12px;padding:13px;border-radius:12px;background:#eef5ff;border:1px solid #bfd6ff}.ur-method b{color:#1565c0}.ur-graphic{margin-top:12px;padding:12px;border-radius:14px;background:linear-gradient(135deg,#fff8e1,#e3f2fd);display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:center;font-weight:800;text-align:center}.ur-box{padding:9px 12px;background:#fff;border-radius:10px;border:1px solid #c9d8e8}.ur-arrow{font-size:22px}.ur-key{color:#6a1b9a}";document.head.appendChild(st);
function esc(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
function dataAt(i){try{if(typeof data!=='undefined'&&data[i])return data[i];}catch(e){}return null;}
function answerAt(i,labels){
 const good=labels.findIndex(x=>x.classList.contains('correct')); if(good>=0)return good;
 const d=dataAt(i); if(d){if(Array.isArray(d)&&typeof d[2]==='number')return d[2];if(typeof d.a==='number')return d.a;if(typeof d.answer==='number')return d.answer;}
 try{if(typeof answers!=='undefined'&&answers&&typeof answers[i]==='number')return answers[i];}catch(e){}
 return -1;
}
function explanationAt(i,q,correct){
 try{if(typeof explanations!=='undefined'&&explanations[i])return explanations[i];}catch(e){}
 const d=dataAt(i);if(d&&d.e)return d.e;
 const item=document.querySelectorAll('.q,.card,.question,article.question')[i], ex=item&&item.querySelector('.explain');
 if(ex)return ex.textContent.replace(/Cara pengerjaan:\s*/i,'').trim();
 return 'Baca soal dengan teliti, temukan kata kunci, cocokkan dengan materi yang dipelajari, lalu periksa kembali pilihan. Jawaban yang benar: '+correct+'.';
}
function build(){
 const items=[...document.querySelectorAll('.q,.card,.question,article.question')].filter(x=>x.querySelector('input[type="radio"]')&&x.querySelector('h2,h3'));
 if(!items.length)return;
 let panel=document.getElementById('universal-review');
 if(!panel){panel=document.createElement('section');panel.id='universal-review';panel.className='universal-review';const host=document.getElementById('review')||document.getElementById('result')||items[items.length-1];host.parentNode.insertBefore(panel,host.nextSibling);}
 let h='<div class="ur-top"><h2>📖 Pembahasan Lengkap</h2><p>Setiap soal ditampilkan kembali bersama pilihan, jawaban siswa, jawaban benar, dan cara mengerjakannya.</p></div>';
 items.forEach((item,i)=>{
  const head=item.querySelector('h2,h3'), q=head?head.textContent.trim():'Soal '+(i+1);
  const labels=[...item.querySelectorAll('label')].filter(x=>x.querySelector('input[type="radio"]'));
  const selected=labels.findIndex(x=>x.querySelector('input[type="radio"]:checked')), a=answerAt(i,labels);
  const correct=a>=0&&labels[a]?labels[a].textContent.replace(/\s+/g,' ').trim():'Jawaban benar sesuai kunci';
  const ok=selected>=0&&a>=0&&selected===a;
  h+='<article class="ur-item '+(ok?'ur-correct':'ur-wrong')+'"><div class="ur-q">Soal '+(i+1)+'. '+esc(q.replace(/^\s*\d+[.)]\s*/,''))+'</div><div class="ur-options">';
  labels.forEach((l,j)=>{const t=l.textContent.replace(/\s+/g,' ').trim();h+='<div class="ur-opt '+(j===a?'correct ':'')+(j===selected?'selected':'')+'">'+esc(t)+(j===selected?' <b>← jawabanmu</b>':'')+(j===a?' <b>✓ jawaban benar</b>':'')+'</div>';});
  h+='</div><div class="ur-method"><b>📌 Cara mengerjakan:</b><br>'+esc(explanationAt(i,q,correct))+'</div><div class="ur-graphic"><span class="ur-box">📝 Soal</span><span class="ur-arrow">→</span><span class="ur-box ur-key">🔎 Kata kunci</span><span class="ur-arrow">→</span><span class="ur-box">✅ Jawaban benar</span></div></article>';
 });
 panel.innerHTML=h;panel.style.display='block';panel.scrollIntoView({behavior:'smooth',block:'start'});
}
function attach(){
 [...document.querySelectorAll('button,input[type="button"],input[type="submit"]')].filter(b=>/periksa|lihat nilai|koreksi/i.test(b.innerText||b.value||'')).forEach(b=>b.addEventListener('click',()=>setTimeout(build,150)));
 document.querySelectorAll('form').forEach(f=>f.addEventListener('submit',()=>setTimeout(build,150)));
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',attach);else attach();
})();