/* SD8 // six cyber-bush branches, no empty placeholders, zero dependencies. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const NS = 'http://www.w3.org/2000/svg';
  const published = window.SD8_CONFIG || {ownerLogin:'learner091-newbie',displayName:'SD8',projects:[]};
  const STORE = 'sd8-six-sector-tree-final-v4';
  const PREVIOUS_STORE='sd8-eight-sector-tree-v3';
  const OLD_STORE = 'sd8-cyber-tree-local-edit-v2';
  // Six locations match the principal bush-covered branches visible in the artwork.
  // Branches without a project stay as pure illustration: no badges, labels, or cards.
  const zones = [
    {id:1,x:470,y:201,label:'TOP CROWN'},
    {id:2,x:675,y:341,label:'UPPER RIGHT'},
    {id:3,x:275,y:331,label:'UPPER LEFT'},
    {id:4,x:136,y:509,label:'WEST CANOPY'},
    {id:5,x:797,y:519,label:'EAST CANOPY'},
    {id:6,x:160,y:661,label:'LOWER CANOPY'}
  ];
  const ZONE_COUNT=zones.length;
  // Import from the old eight-branch version without losing older saved work.
  const migratedZone=id=>({7:6,8:3}[id]||Math.min(ZONE_COUNT,Math.max(1,id||1)));
  const trim = (value,limit=500) => String(value??'').trim().slice(0,limit);
  const httpUrl = input => {try {const u=new URL(input);return (u.protocol==='https:'||u.protocol==='http:')?u.href:'';} catch {return ''}};
  const normalize = (p,i=0) => ({
    id:trim(p.id || `item-${i+1}`,100),zone:migratedZone(Number(p.zone)||([1,2][i]||(i%ZONE_COUNT)+1)),
    name:trim(p.name,80),type:p.type==='Work'?'Work':'Project',category:trim(p.category||'Other',35),
    status:trim(p.status||'Building',35),year:trim(p.year,12),description:trim(p.description,800),
    tags:Array.isArray(p.tags)?p.tags.slice(0,12).map(s=>trim(s,36)).filter(Boolean):[],
    repoUrl:httpUrl(p.repoUrl),liveUrl:httpUrl(p.liveUrl)
  });
  const defaults = () => (Array.isArray(published.projects)?published.projects:[]).map(normalize).filter(p=>p.name);
  let projects=defaults();
  let localMode=false;
  try {
    const local=JSON.parse(localStorage.getItem(STORE)||'null');
    if(Array.isArray(local)){projects=local.map(normalize).filter(p=>p.name);localMode=true;}
    else {
      const old=JSON.parse(localStorage.getItem(PREVIOUS_STORE)||localStorage.getItem(OLD_STORE)||'null');
      if(Array.isArray(old)){projects=old.map(normalize).filter(p=>p.name);localMode=true;}
    }
  } catch {/* storage may be disabled */}
  let selectedZone=projects.find(p=>p.zone===1)?.zone||projects[0]?.zone||1,selectedId=projects.find(p=>p.zone===1)?.id||projects[0]?.id||null,editId=null,search='';
  const profile=`https://github.com/${encodeURIComponent(published.ownerLogin||'learner091-newbie')}`;
  $('github-profile').href=profile;
  const append = (tag,parent,text,className) => {const el=document.createElement(tag);if(className)el.className=className;if(text!==undefined&&text!==null)el.textContent=text;if(parent)parent.appendChild(el);return el;};
  const countIn = id => projects.filter(p=>p.zone===id);
  const curZone = () => zones.find(z=>z.id===selectedZone);
  const persist = () => {try{localStorage.setItem(STORE,JSON.stringify(projects));localMode=true;return true;}catch{return false;}};
  const message = text => {$('editor-message').textContent=text;};
  const pad = n => String(n).padStart(2,'0');
  const preventInvalid = input => {const value=input.trim();return !value || !!httpUrl(value);};

  function drawEnergy(){
    const layer=$('energy-lines');layer.replaceChildren();
    zones.forEach((z,i)=>{
      // Same origin for every route: all six visible branches receive power from SD8.
      const x=z.x,y=z.y,midX=470+(x-470)*.08,branchX=470+(x-470)*.33;
      const path=`M 470 1253 C 455 1100, 510 934, 483 808 C 478 727, ${midX} ${Math.max(620,y+145)}, ${branchX} ${Math.max(460,y+82)} S ${x} ${y+20}, ${x} ${y}`;
      const base=document.createElementNS(NS,'path');base.setAttribute('d',path);base.setAttribute('class','energy-line');layer.appendChild(base);
      const trace=document.createElementNS(NS,'path');trace.setAttribute('d',path);trace.setAttribute('class','energy-trace');trace.style.animationDelay=`-${i*.44}s`;layer.appendChild(trace);
      const orb=document.createElementNS(NS,'circle');orb.setAttribute('r','4.2');orb.setAttribute('class','energy-spark');
      const motion=document.createElementNS(NS,'animateMotion');motion.setAttribute('path',path);motion.setAttribute('dur',`${5+i*.42}s`);motion.setAttribute('begin',`${i*.48}s`);motion.setAttribute('repeatCount','indefinite');orb.appendChild(motion);layer.appendChild(orb);
    });
  }

  function renderNodes(){
    const holder=$('zone-nodes');holder.replaceChildren();
    zones.forEach((z,i)=>{
      const items=countIn(z.id);
      // IMPORTANT: An unoccupied bush shows no node, label or placeholder.
      if(!items.length)return;
      const button=append('button',holder,null,'zone-node'+(z.id===selectedZone?' is-selected':''));
      button.type='button';button.style.left=`${z.x/941*100}%`;button.style.top=`${z.y/1672*100}%`;button.style.animationDelay=`${i*.06}s`;
      button.setAttribute('aria-label',`Branch ${pad(z.id)}: ${items.map(p=>p.name).join(', ')}`);
      button.setAttribute('aria-pressed',String(selectedZone===z.id));
      append('span',button,`${pad(z.id)} ◉`,'zone-index');
      append('span',button,items[0].name,'zone-name');
      append('span',button,`${pad(items.length)} ${items.length===1?'ITEM':'ITEMS'}`,'zone-info');
      button.addEventListener('click',()=>selectZone(z.id));
    });
  }
  function link(parent,text,url){if(!httpUrl(url))return;const a=append('a',parent,text,'inspector-link');a.href=url;a.target='_blank';a.rel='noopener noreferrer';}
  function addButton(parent,label,zoneId){const b=append('button',parent,label,'inspector-add');b.type='button';b.addEventListener('click',()=>openEditor(null,zoneId));}
  function renderInspector(){
    const content=$('inspector-body');content.replaceChildren();
    let items=countIn(selectedZone);
    if(!items.length){
      const first=projects[0];
      if(first){selectedZone=first.zone;selectedId=first.id;items=countIn(selectedZone);}
    }
    $('inspector').hidden=!items.length;
    if(!items.length)return;
    const p=items.find(item=>item.id===selectedId)||items[0];
    selectedId=p.id;
    const box=append('div',content,null,'details-body');
    append('span',box,`CONNECTED // BRANCH ${pad(selectedZone)} / ${pad(ZONE_COUNT)}`,'inspector-index');
    append('div',box,'⌘','inspector-symbol');
    append('span',box,'◈ ACTIVE BUSH CLUSTER','inspector-category');
    append('h2',box,p.name);
    append('p',box,p.description,'details-description');
    const row1=append('div',box,null,'data-row');append('span',row1,'STATUS');append('span',row1,p.status||'—');
    const row2=append('div',box,null,'data-row');append('span',row2,'TYPE / YEAR');append('span',row2,`${p.type} · ${p.year||'—'}`);
    const tags=append('div',box,null,'tag-wrap');p.tags.forEach(t=>append('span',tags,t));
    link(box,'↗ VIEW REPOSITORY',p.repoUrl);link(box,'↗ VISIT LIVE WEBSITE',p.liveUrl);
    if(items.length>1){
      append('span',box,`BUSH ITEMS / ${items.length}`,'inspector-index');
      const picker=append('div',box,null,'project-picker');items.forEach(item=>{
        const b=append('button',picker,item.name);b.type='button';b.setAttribute('aria-pressed',String(item.id===p.id));b.addEventListener('click',()=>{selectedId=item.id;renderInspector();});
      });
    }
    addButton(box,'+ ADD ANOTHER ITEM TO THIS BUSH',selectedZone);
  }
  function selectZone(id,projectId=null,scroll=false){
    if(!(id>=1&&id<=ZONE_COUNT))return;
    selectedZone=id;selectedId=projectId || countIn(id)[0]?.id || null;
    renderNodes();renderInspector();renderDirectory();
    if(scroll)$('tree').scrollIntoView({behavior:'smooth',block:'start'});
  }
  function renderDirectory(){
    const container=$('sector-grid');container.replaceChildren();
    zones.forEach(z=>{
      const items=countIn(z.id);
      // Public directory must show only real work, never an empty branch.
      if(!items.length)return;
      const filtered=items.filter(p=>[p.name,p.description,p.category,p.type,...p.tags].join(' ').toLowerCase().includes(search));
      if(!filtered.length)return;
      const card=append('article',container,null,'sector-card');
      const header=append('div',card,null,'sector-card-header');append('span',header,`BRANCH // ${pad(z.id)}`);append('span',header,'◉ ACTIVE','sector-state');
      append('h3',card,items.length===1?items[0].name:`${items.length} CONNECTED ITEMS`);
      append('p',card,`${z.label} • ${items.length} ${items.length===1?'project/work item':'project/work items'}`);
      filtered.forEach(item=>{const b=append('button',card,item.name,'sector-card-item');b.type='button';append('small',b,`${item.type} / ${item.status}`);b.addEventListener('click',()=>selectZone(z.id,item.id,true));});
      // Editing and adding are intentionally kept in Manage Tree, not on public cards.
    });
    if(!container.children.length)append('p',container,search?'No matching projects or work. Try another search.':'Projects will appear here when added through Manage Tree.','directory-note');
  }
  function update(){
    if(!zones.some(z=>z.id===selectedZone) || !countIn(selectedZone).length)selectedZone=projects[0]?.zone||1;
    if(!projects.some(p=>p.id===selectedId&&p.zone===selectedZone))selectedId=countIn(selectedZone)[0]?.id||null;
    $('project-total').textContent=pad(projects.length);
    renderInspector();renderNodes();renderDirectory();renderManagerList();
  }
  $('search-projects').addEventListener('input',event=>{search=event.target.value.trim().toLowerCase();renderDirectory();});

  // Local editor: anyone may preview edits, but publishing requires repository write access.
  const dialog=$('editor'),form=$('editor-form');
  const fields={name:'field-name',zone:'field-zone',type:'field-type',category:'field-category',status:'field-status',description:'field-description',year:'field-year',tags:'field-tags',repoUrl:'field-repo',liveUrl:'field-live'};
  const zoneOptions=$('field-zone');zones.forEach(z=>{const o=append('option',zoneOptions,`${pad(z.id)} — ${z.label}`);o.value=z.id;});
  const set = (key,value) => {$(fields[key]).value=value??'';};
  function fill(projectId=null,zoneId=selectedZone){
    editId=projectId;
    const p=projects.find(item=>item.id===projectId);
    set('name',p?.name||'');set('zone',p?.zone||zoneId);set('type',p?.type||'Project');set('category',p?.category||'Web');set('status',p?.status||'Building');set('year',p?.year||String(new Date().getFullYear()));set('description',p?.description||'');set('tags',p?.tags?.join(', ')||'');set('repoUrl',p?.repoUrl||'');set('liveUrl',p?.liveUrl||'');
    $('editor-delete').hidden=!p;renderManagerList();message('');
  }
  function renderManagerList(){
    const list=$('editor-list');list.replaceChildren();
    if(!projects.length)append('p',list,'No projects yet. Add the first one!','editor-empty');
    projects.forEach(p=>{const b=append('button',list,null,'editor-item');b.type='button';b.setAttribute('aria-pressed',String(p.id===editId));append('strong',b,p.name);append('small',b,`SECTOR ${pad(p.zone)} · ${p.type}`);b.addEventListener('click',()=>fill(p.id,p.zone));});
  }
  function openEditor(id=null,zone=selectedZone){fill(id,zone);if(!dialog.open)dialog.showModal();}
  $('manage-open').addEventListener('click',()=>openEditor(projects.find(p=>p.zone===selectedZone)?.id||null,selectedZone));
  $('editor-close').addEventListener('click',()=>dialog.close());
  $('editor-add').addEventListener('click',()=>{fill(null,selectedZone);$('field-name').focus();});
  dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
  function slug(name){const base=name.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'new-item';let id=base,i=2;while(projects.some(p=>p.id===id))id=`${base}-${i++}`;return id;}
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const name=trim($('field-name').value,80),category=trim($('field-category').value,35);
    const repo=$('field-repo').value,live=$('field-live').value;
    if(!name||!category){message('Please enter a name and category.');return;}
    if(!preventInvalid(repo)||!preventInvalid(live)){message('Links must be valid HTTP or HTTPS URLs.');return;}
    const data=normalize({id:editId||slug(name),name,zone:Number($('field-zone').value),type:$('field-type').value,category,status:$('field-status').value,year:$('field-year').value,description:$('field-description').value,tags:$('field-tags').value.split(',').map(s=>s.trim()).filter(Boolean),repoUrl:repo,liveUrl:live});
    if(editId){const ix=projects.findIndex(p=>p.id===editId);if(ix>=0)projects[ix]=data;else projects.push(data);}else projects.push(data);
    selectedZone=data.zone;selectedId=data.id;editId=data.id;
    const saved=persist();update();fill(data.id,data.zone);
    message(saved?'Saved in this browser. Export projects.js to publish.':'Saved in this page only. Export projects.js now to preserve changes.');
  });
  $('editor-delete').addEventListener('click',()=>{
    const p=projects.find(item=>item.id===editId);if(!p)return;
    if(!confirm(`Remove "${p.name}" from your local tree?`))return;
    projects=projects.filter(item=>item.id!==p.id);
    if(selectedId===p.id)selectedId=null;
    persist();fill(null,p.zone);update();message('Removed locally. Export projects.js to publish this change.');
  });
  $('editor-reset').addEventListener('click',()=>{
    if(!confirm('Restore the published projects.js entries and discard local edits?'))return;
    projects=defaults();try{localStorage.removeItem(STORE);localStorage.removeItem(PREVIOUS_STORE);localStorage.removeItem(OLD_STORE);}catch{}
    localMode=false;selectedZone=1;selectedId=projects.find(p=>p.zone===1)?.id||null;fill(null,1);update();message('Restored the published project list.');
  });
  $('editor-export').addEventListener('click',()=>{
    const config={ownerLogin:published.ownerLogin||'learner091-newbie',displayName:published.displayName||'SD8',projects};
    const text='/* SD8 published projects: upload this file to GitHub repository root */\nwindow.SD8_CONFIG = '+JSON.stringify(config,null,2)+';\n';
    const obj=new Blob([text],{type:'text/javascript;charset=utf-8'}),url=URL.createObjectURL(obj);
    const a=document.createElement('a');a.href=url;a.download='projects.js';document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1500);
    message('Exported projects.js. Replace that file in your GitHub Pages repository to publish your changes.');
  });

  drawEnergy();update();
  // Do not auto-scroll to project hash on page load. First impression is the entire canopy.
})();
