/* =====  START OF FULL app.js  ===== */
function showPage(id){
  document.querySelectorAll('.page').forEach(p=>p.classList.add('hidden'));
  const el=document.getElementById(id);
  if(el){
    el.classList.remove('hidden');
    localStorage.setItem('fh_current_page',id);
  }
  if(id==='design-page'){
    const data=JSON.parse(localStorage.getItem('fh_blocks')||'[]');
    updateDesignFromBlocks(data);
  }
}

const ROUTES={
  'btn-to-research':'research-page','btn-back-to-brainstorm':'brainstorm-page',
  'btn-to-selection':'selection-page','btn-back-to-research':'research-page',
  'btn-to-outline':'outline-page','btn-back-to-selection':'selection-page',
  'btn-to-context':'context-page','btn-back-to-outline':'outline-page',
  'btn-to-joy':'joy-page','btn-back-to-context':'context-page',
  'btn-to-community':'community-page','btn-back-to-joy':'joy-page',
  'btn-to-guest':'guest-page','btn-back-to-community':'community-page',
  'btn-to-complete':'complete-page','btn-back-to-guest':'guest-page',
  'btn-to-design':'design-page','btn-back-to-complete':'complete-page',
  'btn-to-promote':'promote-page','btn-back-to-design':'design-page',
  'btn-to-polish':'polish-page','btn-back-to-promote':'promote-page',
  'btn-to-prepare1':'prepare1-page','btn-back-to-polish':'polish-page',
  'btn-to-prepare2':'prepare2-page','btn-back-to-prepare1':'prepare1-page',
  'btn-to-prepare3':'prepare3-page','btn-back-to-prepare2':'prepare2-page',
  'btn-to-before':'before-page','btn-back-to-prepare3':'prepare3-page',
  'btn-to-after':'after-page','btn-back-to-before':'before-page',
  'btn-to-stream':'stream-page','btn-back-to-after':'after-page'
};

document.addEventListener('click',e=>{
  const btn=e.target.closest('button');
  if(!btn) return;
  const target=ROUTES[btn.id];
  if(target) showPage(target);
});

const save=(id,val)=>localStorage.setItem(id,val);
let t;
const debounce=fn=>{ clearTimeout(t); t=setTimeout(fn,250); };

document.querySelectorAll('textarea, input[type="checkbox"]').forEach(field=>{
  const saved=localStorage.getItem(field.id);
  if(saved!==null){
    if(field.type==='checkbox') field.checked = saved==='true';
    else field.value = saved;
  }
  field.addEventListener('input',()=>debounce(()=>save(field.id,
    field.type==='checkbox'?field.checked:field.value)));
  field.addEventListener('change',()=>save(field.id,
    field.type==='checkbox'?field.checked:field.value));
});

const blocksEl=document.getElementById('blocks');
const addToolbar=document.querySelector('.add-toolbar');
const designItemsEl=document.getElementById('design-items');

function createBlock(title,text=''){
  const wrap=document.createElement('div');
  wrap.className='block'; wrap.draggable=true;

  const header=document.createElement('div');
  header.className='block-header';

  const pill=document.createElement('span');
  pill.className='block-title';
  pill.textContent=title;

  const rm=document.createElement('button');
  rm.type='button'; rm.className='remove'; rm.textContent='Remove';

  header.append(pill,rm);

  const ta=document.createElement('textarea');
  ta.placeholder='Short description…'; ta.value=text||'';

  wrap.append(header,ta);
  return wrap;
}

function saveBlocks(){
  const data=[...document.querySelectorAll('#blocks .block')]
    .map(b=>({
      title:b.querySelector('.block-title').textContent,
      text:b.querySelector('textarea').value
    }));
  localStorage.setItem('fh_blocks',JSON.stringify(data));
  updateDesignFromBlocks(data);
}

function loadBlocks(){
  const raw=localStorage.getItem('fh_blocks');
  const data=raw?JSON.parse(raw):[
    {title:'Opening',text:''},
    {title:'Urgent Topic',text:''},
    {title:'Context Corner',text:''},
    {title:'Joy or Foolishness',text:''},
    {title:'Community Check in',text:''},
    {title:'Closing',text:''}
  ];
  blocksEl.innerHTML='';
  data.forEach(b=>blocksEl.append(createBlock(b.title,b.text)));
  updateDesignFromBlocks(data);
}

function updateDesignFromBlocks(data){
  if(!designItemsEl) return;
  const saved={};
  designItemsEl.querySelectorAll('input[id^="design_"]')
    .forEach(i=>saved[i.id]=i.checked);

  designItemsEl.innerHTML='';
  data.forEach(({title})=>{
    const id='design_'+title.replace(/\s+/g,'_').toLowerCase();
    const row=document.createElement('div');
    row.className='checklist-item';

    const cb=document.createElement('input');
    cb.type='checkbox'; cb.id=id;
    const was=(localStorage.getItem(id)==='true')||saved[id];
    cb.checked=!!was;

    const label=document.createElement('label');
    label.htmlFor=id;
    label.textContent=title+' Graphic/Video';

    row.append(cb,label);
    designItemsEl.append(row);
  });
}

if(addToolbar){
  addToolbar.addEventListener('click',e=>{
    const btn=e.target.closest('button[data-add]');
    if(!btn) return;
    blocksEl.append(createBlock(btn.dataset.add));
    saveBlocks();
  });
}

document.addEventListener('click',e=>{
  if(e.target.classList.contains('remove')){
    e.target.closest('.block').remove();
    saveBlocks();
  }
});

document.addEventListener('input',e=>{
  if(e.target.closest('#blocks') && e.target.tagName==='TEXTAREA') saveBlocks();
});

let dragEl=null;
document.addEventListener('dragstart',e=>{
  const b=e.target.closest('#blocks .block');
  if(b){ dragEl=b; dragEl.classList.add('dragging'); }
});
document.addEventListener('dragend',e=>{
  const b=e.target.closest('#blocks .block');
  if(b){ b.classList.remove('dragging'); dragEl=null; saveBlocks(); }
});
document.addEventListener('dragover',e=>{
  const container=document.getElementById('blocks');
  if(!container) return;
  if(!e.target.closest('#blocks')) return;
  e.preventDefault();
  const els=[...container.querySelectorAll('.block:not(.dragging)')];
  const after=els.reduce((closest,child)=>{
    const box=child.getBoundingClientRect();
    const offset=e.clientY-box.top-box.height/2;
    return(offset<0 && offset>closest.offset)?{offset,element:child}:closest;
  },{offset:Number.NEGATIVE_INFINITY}).element;

  const dragging=container.querySelector('.block.dragging');
  if(dragging){
    if(after==null){
      if(dragging!==container.lastElementChild) container.appendChild(dragging);
    }else if(after!==dragging.nextElementSibling){
      container.insertBefore(dragging,after);
    }
  }
});

document.addEventListener('change',e=>{
  if(e.target.id && e.target.id.startsWith('design_'))
    localStorage.setItem(e.target.id,e.target.checked);
  if(e.target.id==='thumb')
    localStorage.setItem('fh_thumb',e.target.checked);
  if(e.target.closest('#polish-page')) updatePolishCounts();
});

function updatePolishCounts(){
  ['pg-editorial','pg-accuracy','pg-visual','pg-ctas'].forEach(id=>{
    const group=document.getElementById(id);
    if(!group) return;
    const boxes=group.querySelectorAll('input[type="checkbox"]');
    const done=[...boxes].filter(b=>b.checked).length;
    const total=boxes.length;
    const counter=group.querySelector('.count');
    if(counter) counter.textContent='('+done+'/'+total+')';
  });
}

const thumbSaved=localStorage.getItem('fh_thumb');
if(thumbSaved!==null){
  const t=document.getElementById('thumb');
  if(t) t.checked=thumbSaved==='true';
}

const cur=localStorage.getItem('fh_current_page')||'brainstorm-page';
loadBlocks();
showPage(cur);
updatePolishCounts();

const resetBtn=document.getElementById('btn-reset-all');
if(resetBtn){
  resetBtn.addEventListener('click',()=>{
    if(!confirm('Clear all saved notes and outline?')) return;
    localStorage.removeItem('fh_blocks');
    localStorage.removeItem('fh_thumb');
    localStorage.removeItem('fh_current_page');
    Object.keys(localStorage).forEach(k=>{
      if(/^design_/i.test(k)) localStorage.removeItem(k);
    });
    document.querySelectorAll('textarea').forEach(t=>{
      if(t.id) localStorage.removeItem(t.id);
      t.value='';
    });
    document.querySelectorAll('input[type="checkbox"]').forEach(c=>{
      if(c.id) localStorage.removeItem(c.id);
      c.checked=false;
    });
    loadBlocks();
    showPage('brainstorm-page');
    updatePolishCounts();
  });
}
/* =====  END OF FULL app.js ===== */
