/* SD8 Cyber Tree | Zero-dependency dynamic project and work explorer. */
(() => {
  'use strict';
  const published = window.CYBER_TREE_CONFIG || {};
  const STORAGE_KEY = 'sd8-cyber-tree-local-edit-v2';
  const NS = 'http://www.w3.org/2000/svg';
  const $ = id => document.getElementById(id);
  const palette = {Web:'#50eef2', AI:'#ad85ff', 'Game Dev':'#f18cbf', Startup:'#fbbf78', Tools:'#79e6b3', Research:'#86b6ff', Design:'#ffd586', Work:'#efb6fa'};
  const icons = {Web:'⌘',AI:'✳','Game Dev':'◇',Startup:'↗',Tools:'⚙',Research:'◈',Design:'✦',Work:'⬡'};
  const colorOf = p => palette[p.category] || '#60d7ec';
  const validLink = value => {try {const u=new URL(value);return ['https:','http:'].includes(u.protocol)?u.href:null;}catch{return null;}};
  const cleanText = (s,max=800) => String(s ?? '').trim().slice(0,max);
  const cleanProject = (p,i=0) => ({
    id:cleanText(p.id || `leaf-${i+1}`,100),
    name:cleanText(p.name,80),type:p.type==='Work'?'Work':'Project',
    category:cleanText(p.category||'Other',35)||'Other',status:cleanText(p.status||'Building',35),
    year:cleanText(p.year,12),description:cleanText(p.description,800),
    tags:(Array.isArray(p.tags)?p.tags:[]).slice(0,12).map(t=>cleanText(t,45)).filter(Boolean),
    repoUrl:validLink(p.repoUrl)||'',liveUrl:validLink(p.liveUrl)||''
  });
  const clonePublished = () => (Array.isArray(published.projects) ? published.projects : []).map(cleanProject).filter(p=>p.name);
  let projects=clonePublished();
  try {const cache=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null'); if(Array.isArray(cache))projects=cache.map(cleanProject).filter(p=>p.name);}catch{}
  let activeCategory='All',activeSearch='',selectedId=projects[0]?.id||null,editingId=null;

  const profileUrl=`https://github.com/${encodeURIComponent(published.ownerLogin||'learner091-newbie')}`;
  ['header-github','hero-github','footer-github'].forEach(id=>$(id).href=profileUrl);
  $('copyright-year').textContent=new Date().getFullYear();
  $('footer-name').textContent=published.displayName||'SD8';

  function dom(tag,className,text,parent){const el=document.createElement(tag);if(className)el.className=className;if(text!==undefined&&text!==null)el.textContent=text;if(parent)parent.appendChild(el);return el;}
  function svg(tag,attrs={},parent){const el=document.createElementNS(NS,tag);Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,String(v)));if(parent)parent.appendChild(el);return el;}
  function getCategories(){return [...new Set(projects.map(p=>p.category))];}
  function persist(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(projects));return true;}catch{return false;}}
  function note(msg){$('manager-message').textContent=msg;}
  function matches(p){const found=activeCategory==='All'||p.category===activeCategory;return found && [p.name,p.type,p.category,p.description,...p.tags].join(' ').toLowerCase().includes(activeSearch);}
  function updateCounts(){ $('metric-projects').textContent=String(projects.length).padStart(2,'0');$('metric-categories').textContent=String(getCategories().length).padStart(2,'0');$('node-counter').textContent=`${String(projects.length).padStart(2,'0')} NODES`; }

  function positionsFor(n){
    if(n===0)return [];
    if(n===1)return [{x:500,y:190}];
    if(n===2)return [{x:290,y:190},{x:710,y:190}];
    if(n===3)return [{x:210,y:192},{x:500,y:110},{x:790,y:192}];
    if(n===4)return [{x:150,y:196},{x:360,y:95},{x:640,y:95},{x:850,y:196}];
    if(n===5)return [{x:160,y:175},{x:390,y:98},{x:610,y:98},{x:840,y:175},{x:500,y:338}];
    if(n===6)return [{x:150,y:176},{x:363,y:99},{x:637,y:99},{x:850,y:176},{x:215,y:387},{x:785,y:387}];
    // For 7+ leaves: grow the tree vertically, with all nodes visible.
    return Array.from({length:n},(_,i)=>{
      const row=Math.floor(i/4), start=row*4, inRow=Math.min(4,n-start), col=i-start;
      return {x:1000*(col+1)/(inRow+1), y:112+row*151};
    });
  }
  function renderTree(){
    const positions=positionsFor(projects.length);
    const maxNodeY=positions.length ? Math.max(...positions.map(p=>p.y)) : 100;
    const height=Math.max(700,maxNodeY+330),rootY=height-76,delta=rootY-624;
    $('tree-svg').setAttribute('viewBox',`0 0 1000 ${height}`);
    $('tree-svg').setAttribute('aria-label',`Interactive SD8 project tree with ${projects.length} project or work leaves`);
    document.querySelector('.tree-base').setAttribute('transform',`translate(0 ${delta})`);
    document.querySelector('.root-emblem').setAttribute('transform',`translate(0 ${delta})`);
    // A scalable background uses the new tree height.
    const grid=$('tree-svg').querySelector('rect');grid.setAttribute('height',String(height));
    const stars=$('star-field'),branches=$('tree-branches'),leaves=$('tree-leaves');
    stars.replaceChildren();branches.replaceChildren();leaves.replaceChildren();
    for(let i=0;i<Math.max(64,Math.floor(height/11));i++){
      svg('circle',{cx:(i*149+37)%985+7,cy:(i*229+83)%height,r:i%8===0?1.9:.9,fill:i%3===0?'#82a7fc':'#53a9c7',opacity:i%5===0?.5:.23},stars);
    }
    projects.forEach((p,i)=>{
      const {x,y}=positions[i],c=colorOf(p),midX=500+(x-500)*.18;
      const path=`M500 ${rootY} C ${midX} ${rootY-130}, ${x} ${y+Math.min(135,Math.max(60,(rootY-y)*.35))}, ${x} ${y}`;
      const branch=svg('g',{'data-id':p.id,class:'branch'+(!matches(p)?' is-muted':'')},branches);
      svg('path',{d:path,stroke:c,class:'branch branch-halo'},branch);
      svg('path',{d:path,stroke:c,class:'branch branch-core'},branch);
      svg('circle',{cx:x,cy:y,r:4,class:'branch-junction'},branch);
      const leaf=svg('g',{class:'project-leaf'+(!matches(p)?' is-muted':'')+(p.id===selectedId?' is-active':''),transform:`translate(${x} ${y})`,role:'button',tabindex:'0','aria-pressed':p.id===selectedId?'true':'false','aria-label':`View ${p.type.toLowerCase()} ${p.name}`,'data-id':p.id,style:`--leaf-color:${c}`},leaves);
      svg('path',{d:'M -93 -30 Q -38 -81 39 -43 Q 76 -28 95 17 Q 29 58 -37 37 Q -82 23 -93 -30 Z',class:'leaf-shadow'},leaf);
      svg('path',{d:'M -93 -30 Q -38 -81 39 -43 Q 76 -28 95 17 Q 29 58 -37 37 Q -82 23 -93 -30 Z',class:'leaf-body'},leaf);
      svg('path',{d:'M -78 -22 Q -12 4 76 15',class:'leaf-trace'},leaf);
      svg('path',{d:'M -32 -37 Q -10 -10 0 1 M 12 -37 Q 21 -10 31 7 M -39 23 Q -15 9 0 1',class:'leaf-vein'},leaf);
      svg('circle',{cx:-70,cy:-25,r:3,class:'leaf-ping'},leaf);
      const num=svg('text',{x:-59,y:-24,class:'leaf-num'},leaf);num.textContent=String(i+1).padStart(2,'0');
      const raw=p.name.length>21?p.name.slice(0,20)+'…':p.name;
      const name=svg('text',{x:0,y:0,'text-anchor':'middle',class:'leaf-title'},leaf);name.textContent=raw;
      const subt=svg('text',{x:0,y:21,'text-anchor':'middle',class:'leaf-subtitle'},leaf);subt.textContent=`${p.type} / ${p.category}`.toUpperCase().slice(0,29);
      const title=svg('title',{},leaf);title.textContent=`${p.name} — ${p.type} / ${p.category}`;
      leaf.addEventListener('click',()=>selectProject(p.id,true));
      leaf.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();selectProject(p.id,true);}});
    });
  }

  function detailLink(label,url,parent){const a=dom('a','detail-link',label,parent);a.href=url;a.target='_blank';a.rel='noopener noreferrer';}
  function renderInspector(){
    const p=projects.find(q=>q.id===selectedId),box=$('inspector-content');box.replaceChildren();
    if(!p){dom('p','detail-note','No leaves yet. Use MANAGE LEAVES to add a project or work.',box);return;}
    dom('span','inspector-index',`SELECTED NODE / ${String(projects.indexOf(p)+1).padStart(3,'0')}`,box);
    const orb=dom('div','inspector-orb',null,box);orb.style.setProperty('--orb-color',colorOf(p));dom('span',null,icons[p.category]||'◈',orb);
    dom('span','inspector-category',`◈ ${p.type.toUpperCase()} / ${p.category.toUpperCase()}`,box);
    dom('h3',null,p.name,box);dom('p','inspector-desc',p.description||'Description coming soon.',box);
    const status=dom('div','status-line',null,box);dom('span',null,'STATUS',status);dom('span','status-value',p.status||'—',status);
    const year=dom('div','status-line',null,box);dom('span',null,'YEAR',year);dom('span','status-value',p.year||'—',year);
    const tech=dom('div','tech-list',null,box);p.tags.forEach(tag=>dom('span',null,tag,tech));
    const links=dom('div','inspector-links',null,box);
    if(validLink(p.repoUrl))detailLink('VIEW REPOSITORY ↗',p.repoUrl,links);
    if(validLink(p.liveUrl))detailLink('OPEN LIVE WORK ↗',p.liveUrl,links);
    if(!validLink(p.repoUrl)&&!validLink(p.liveUrl))dom('div','detail-note','Links can be added when you are ready to share them.',links);
  }
  function selectProject(id,fromTree=false){
    if(!projects.some(p=>p.id===id))return;selectedId=id;
    renderTree();renderInspector();renderGrid();
    if(!fromTree)$('atlas').scrollIntoView({behavior:'smooth',block:'start'});
    try{history.replaceState(null,'',`#project-${encodeURIComponent(id)}`);}catch{}
  }
  function renderFilters(){
    const wrap=$('category-filters');wrap.replaceChildren();
    for(const category of ['All',...getCategories()]){
      const b=dom('button','filter',category==='All'?'ALL NODES':category.toUpperCase(),wrap);
      b.type='button';b.setAttribute('aria-pressed',String(category===activeCategory));
      b.addEventListener('click',()=>{activeCategory=category;renderFilters();renderTree();renderGrid();});
    }
  }
  function renderGrid(){
    const grid=$('project-grid');grid.replaceChildren();let count=0;
    projects.forEach((p,i)=>{
      if(!matches(p))return;count++;
      const card=dom('button','project-card',null,grid);card.type='button';card.style.setProperty('--project-color',colorOf(p));
      card.setAttribute('aria-label',`Show details for ${p.name}`);
      const top=dom('div','card-top',null,card);dom('span',null,`NODE // ${String(i+1).padStart(3,'0')}`,top);dom('span','indicator',`◈ ${p.type} / ${p.category}`,top);
      dom('h3',null,p.name,card);dom('p',null,(p.description||'').length>115?p.description.slice(0,114)+'…':p.description,card);
      const bottom=dom('div','card-bottom',null,card);dom('span',null,(p.status||'Unknown').toUpperCase(),bottom);dom('span',null,'↗',bottom);
      card.addEventListener('click',()=>selectProject(p.id));
    });
    $('empty-state').hidden=count!==0;
  }
  function refresh(){
    if(!projects.some(p=>p.id===selectedId))selectedId=projects[0]?.id||null;
    if(activeCategory!=='All'&&!getCategories().includes(activeCategory))activeCategory='All';
    updateCounts();renderFilters();renderTree();renderInspector();renderGrid();renderManagerList();
  }
  $('project-search').addEventListener('input',e=>{activeSearch=e.target.value.trim().toLowerCase();renderTree();renderGrid();});

  // Editor: user-friendly, browser-local preview. Published state remains projects.js.
  const dialog=$('manager'),form=$('project-form');
  function setField(id,value){$(id).value=value||'';}
  function fillForm(id){
    editingId=id||null;
    const p=projects.find(q=>q.id===id);
    setField('edit-id',p?.id);setField('edit-name',p?.name);setField('edit-type',p?.type||'Project');setField('edit-category',p?.category||'Web');
    setField('edit-status',p?.status||'Building');setField('edit-year',p?.year||String(new Date().getFullYear()));
    setField('edit-description',p?.description);setField('edit-tags',p?.tags?.join(', '));setField('edit-repo',p?.repoUrl);setField('edit-live',p?.liveUrl);
    $('manager-delete').hidden=!p;
    renderManagerList();
  }
  function renderManagerList(){
    const box=$('manager-list');box.replaceChildren();
    if(!projects.length)dom('p','manager-empty','No leaves yet — add your first one.',box);
    projects.forEach(p=>{
      const b=dom('button','manager-item'+(editingId===p.id?' manager-item-active':''),null,box);b.type='button';
      dom('strong',null,p.name,b);dom('small',null,`${p.type} / ${p.category}`,b);
      b.addEventListener('click',()=>fillForm(p.id));
    });
  }
  function openManager(e){e?.preventDefault();if(!dialog.open){fillForm(projects[0]?.id||null);dialog.showModal();}}
  $('nav-manage').addEventListener('click',openManager);
  $('manager-close').addEventListener('click',()=>dialog.close());
  $('manager-add').addEventListener('click',()=>{fillForm(null);$('edit-name').focus();});
  dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
  function uniqueSlug(name){const base=name.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')||'new-leaf';let slug=base,i=2;while(projects.some(p=>p.id===slug))slug=`${base}-${i++}`;return slug;}
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const name=cleanText($('edit-name').value,80),category=cleanText($('edit-category').value,35);
    if(!name||!category){note('Name and category are required.');return;}
    const repo=$('edit-repo').value.trim(),live=$('edit-live').value.trim();
    if((repo&&!validLink(repo))||(live&&!validLink(live))){note('Links must be valid http or https URLs.');return;}
    const p=cleanProject({id:editingId||uniqueSlug(name),name,type:$('edit-type').value,category,status:$('edit-status').value,year:$('edit-year').value,description:$('edit-description').value,tags:$('edit-tags').value.split(',').map(s=>s.trim()),repoUrl:repo,liveUrl:live});
    if(editingId){const index=projects.findIndex(q=>q.id===editingId);if(index>=0)projects[index]=p;else projects.push(p);}else projects.push(p);
    selectedId=p.id;editingId=p.id;
    const saved=persist();refresh();fillForm(p.id);note(saved?'Leaf saved in this browser. Export projects.js to publish.':'Leaf updated, but browser storage is unavailable. Export now to preserve it.');
  });
  $('manager-delete').addEventListener('click',()=>{
    if(!editingId)return;const p=projects.find(q=>q.id===editingId);if(!p)return;
    if(!confirm(`Remove "${p.name}" from this local tree? You can restore it with RESET LOCAL EDITS until you publish.`))return;
    projects=projects.filter(q=>q.id!==editingId);editingId=null;persist();fillForm(projects[0]?.id||null);refresh();note('Leaf removed locally. Export projects.js to publish the change.');
  });
  $('manager-reset').addEventListener('click',()=>{
    if(!confirm('Discard your local changes and restore the projects in the published projects.js file?'))return;
    projects=clonePublished();try{localStorage.removeItem(STORAGE_KEY);}catch{}
    editingId=null;selectedId=projects[0]?.id||null;fillForm(selectedId);refresh();note('Restored projects from the published projects.js.');
  });
  $('manager-export').addEventListener('click',()=>{
    const config={ownerLogin:published.ownerLogin||'learner091-newbie',displayName:published.displayName||'SD8',projects};
    const text='/* SD8 project list. Replace projects.js in your GitHub Pages repository to publish edits. */\nwindow.CYBER_TREE_CONFIG = '+JSON.stringify(config,null,2)+';\n';
    const file=new Blob([text],{type:'text/javascript;charset=utf-8'}),url=URL.createObjectURL(file);
    const link=document.createElement('a');link.href=url;link.download='projects.js';document.body.appendChild(link);link.click();link.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
    note('Downloaded projects.js — replace the old file in your GitHub Pages repository to publish.');
  });
  if(location.hash.startsWith('#project-')){
    const id=decodeURIComponent(location.hash.slice(9));if(projects.some(p=>p.id===id))selectedId=id;
  }
  refresh();
  if(location.hash==='#manage')openManager();
})();
