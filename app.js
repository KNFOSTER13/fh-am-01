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

  const rm=document.cr

