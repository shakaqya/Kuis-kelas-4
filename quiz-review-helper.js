/* Universal quiz review helper for Kuis-kelas-4 */
(function(){
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