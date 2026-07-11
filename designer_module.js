/* Designer Bottle & Brushing — منشئ ومصمّم الرسومات (self-contained) */
(function(){
  var LSKEY='btl_custom_charts_v1';
  var METRICS=[{v:'sales',ar:'المبيعات',en:'Sales'},{v:'production',ar:'الإنتاج',en:'Production'},{v:'brushing',ar:'الفرشة',en:'Brushing'},{v:'damaged',ar:'التالف',en:'Damaged'}];
  var DIMS=[{v:'month',ar:'حسب الشهر',en:'By Month'},{v:'branch',ar:'حسب الفرع',en:'By Branch'},{v:'region',ar:'حسب المنطقة',en:'By Region'},{v:'year',ar:'حسب السنة',en:'By Year'}];
  var TYPES=[{v:'bar',ar:'أعمدة',en:'Bar'},{v:'line',ar:'خطي',en:'Line'},{v:'area',ar:'مساحي',en:'Area'},{v:'pie',ar:'دائري',en:'Pie'},{v:'doughnut',ar:'حلقي',en:'Doughnut'},{v:'radar',ar:'راداري',en:'Radar'},{v:'polarArea',ar:'قطبي',en:'Polar'}];
  var AGGS=[{v:'sum',ar:'المجموع',en:'Sum'},{v:'avg',ar:'المتوسط',en:'Average'},{v:'max',ar:'الأعلى',en:'Max'},{v:'min',ar:'الأدنى',en:'Min'}];
  var MEN=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var MAR=['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
  var REGROUP=[{re:/رياض|riyad/i,r:'الرياض'},{re:/دمام|dammam|حسا|احسا|أحسا|هفوف|hofuf|ahsa/i,r:'المنطقة الشرقية'},{re:/قصيم|بريدة|qassim|buray/i,r:'القصيم'},{re:/جد|jed|مكة|مكه|makk|طائف|taif/i,r:'مكة المكرمة'},{re:/مدين|madin|ينبع|yanbu/i,r:'المدينة المنورة'},{re:/عسير|أبها|ابها|abha|asir/i,r:'عسير'},{re:/تبوك|tabuk/i,r:'تبوك'},{re:/حائل|حايل|hail/i,r:'حائل'},{re:/جوف|jawf|سكاكا/i,r:'الجوف'},{re:/شمالية|عرعر|arar|northern/i,r:'الحدود الشمالية'},{re:/جازان|جيزان|jizan|jazan/i,r:'جازان'},{re:/نجران|najran/i,r:'نجران'},{re:/باحة|باحه|baha/i,r:'الباحة'}];
  function toRegion(b){for(var i=0;i<REGROUP.length;i++)if(REGROUP[i].re.test(String(b||'')))return REGROUP[i].r;return String(b||'أخرى');}
  function isAr(){try{return (typeof LANG!=='undefined'&&LANG==='ar');}catch(e){return true;}}
  function L(a,e){return isAr()?a:e;}
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function ls(){try{return window.localStorage;}catch(e){return null;}}
  function rec(metric,year,mi){var d=ls();if(!d)return null;try{return JSON.parse(d.getItem('btl5g_'+metric+'_'+year+'_'+('0'+(mi+1)).slice(-2))||'null');}catch(e){return null;}}
  function years(){var d=ls();var ys={};if(d){for(var i=0;i<d.length;i++){var k=d.key(i);var m=/^btl5g_(?:sales|production|brushing|damaged)_(\d{4})_\d{2}$/.exec(k||'');if(m)ys[m[1]]=1;}}return Object.keys(ys).sort();}
  function mBranches(metric,year,mi){var r=rec(metric,year,mi);return (r&&r.branches)?r.branches:{};}
  function reduceAgg(vals,agg){vals=vals.filter(function(x){return typeof x==='number'&&!isNaN(x);});if(!vals.length)return 0;if(agg==='avg')return vals.reduce(function(a,b){return a+b;},0)/vals.length;if(agg==='max')return Math.max.apply(null,vals);if(agg==='min')return Math.min.apply(null,vals);return vals.reduce(function(a,b){return a+b;},0);}
  function series(cfg){
    var metric=cfg.metric||'sales',dim=cfg.dim||'month',agg=cfg.agg||'sum';
    var ys=(cfg.year&&cfg.year!=='all')?[cfg.year]:years(); if(!ys.length)ys=[String(new Date().getFullYear())];
    if(dim==='month'){var labels=(isAr()?MAR:MEN).slice();var values=[];for(var mi=0;mi<12;mi++){var perY=ys.map(function(y){var b=mBranches(metric,y,mi);var s=0;for(var k in b)s+=(+b[k]||0);return s;});values.push(Math.round(reduceAgg(perY,agg)));}return {labels:labels,values:values};}
    if(dim==='year'){var yl=ys.slice();var yv=ys.map(function(y){var perM=[];for(var mi=0;mi<12;mi++){var b=mBranches(metric,y,mi);var s=0;for(var k in b)s+=(+b[k]||0);perM.push(s);}return Math.round(reduceAgg(perM,(agg==='avg'||agg==='max'||agg==='min')?agg:'sum'));});return {labels:yl,values:yv};}
    var acc={};ys.forEach(function(y){for(var mi=0;mi<12;mi++){var b=mBranches(metric,y,mi);for(var k in b){var key=(dim==='region')?toRegion(k):k;if(!acc[key])acc[key]=[];acc[key].push(+b[k]||0);}}});
    var pairs=Object.keys(acc).map(function(k){return {k:k,v:Math.round(reduceAgg(acc[k],agg))};}).filter(function(p){return p.v!==0;}).sort(function(a,b){return b.v-a.v;});
    return {labels:pairs.map(function(p){return p.k;}),values:pairs.map(function(p){return p.v;})};
  }
  var PAL=['#0891b2','#2563eb','#16a34a','#f59e0b','#dc2626','#7c3aed','#0d9488','#db2777','#65a30d','#ea580c','#0ea5e9','#9333ea','#14b8a6'];
  var _charts={};
  function draw(canvas,cfg,tries){
    if(!canvas)return;
    if(typeof Chart==='undefined'){if((tries||0)<40)setTimeout(function(){draw(canvas,cfg,(tries||0)+1);},150);return;}
    var s=series(cfg);var type=cfg.type||'bar';var base=(type==='area')?'line':type;var col=cfg.color||'#0891b2';
    var multi=(type==='pie'||type==='doughnut'||type==='polarArea');var ds;
    if(multi){ds=[{data:s.values,backgroundColor:s.labels.map(function(_,i){return PAL[i%PAL.length];}),borderColor:'#fff',borderWidth:2}];}
    else if(base==='radar'){ds=[{data:s.values,label:'',backgroundColor:col+'33',borderColor:col,borderWidth:2,pointBackgroundColor:col}];}
    else {ds=[{data:s.values,label:'',backgroundColor:(type==='area')?col+'33':col,borderColor:col,borderWidth:(type==='line'||type==='area')?2.5:0,fill:(type==='area'),tension:.4,borderRadius:type==='bar'?5:0,maxBarThickness:40,pointRadius:type==='line'?3:0}];}
    var opts={responsive:true,maintainAspectRatio:false,animation:{duration:600},plugins:{legend:{display:multi,position:'bottom',labels:{font:{size:11},usePointStyle:true,boxWidth:9}},tooltip:{enabled:true}},scales:(multi||base==='radar')?{}:{x:{grid:{display:false},ticks:{font:{size:10.5}}},y:{beginAtZero:true,ticks:{font:{size:10.5}}}}};
    var id=canvas.id||('c'+Math.random().toString(36).slice(2));canvas.id=id;
    try{if(_charts[id]){_charts[id].destroy();delete _charts[id];}}catch(e){}
    try{_charts[id]=new Chart(canvas,{type:base,data:{labels:s.labels,datasets:ds},options:opts});}catch(e){}
  }
  function load(){try{return JSON.parse((ls()&&ls().getItem(LSKEY))||'[]')||[];}catch(e){return [];}}
  function store(a){try{ls().setItem(LSKEY,JSON.stringify(a));}catch(e){}}
  function upsert(c){var a=load();if(c.id){var i=-1;a.forEach(function(x,ix){if(x.id===c.id)i=ix;});if(i>=0)a[i]=c;else a.push(c);}else{c.id='cc'+Date.now();a.push(c);}store(a);return c;}
  function del(id){store(load().filter(function(x){return x.id!==id;}));}

  var F={id:'',titleAr:'',titleEn:'',type:'bar',metric:'sales',dim:'month',year:'all',agg:'sum',color:'#0891b2'};
  function opts(list,selv){return list.map(function(o){return '<option value="'+o.v+'"'+(o.v===selv?' selected':'')+'>'+esc(isAr()?o.ar:o.en)+'</option>';}).join('');}
  function yearOpts(selv){var ys=years();var o='<option value="all"'+(selv==='all'?' selected':'')+'>'+L('كل السنوات','All years')+'</option>';ys.forEach(function(y){o+='<option value="'+y+'"'+(y===selv?' selected':'')+'>'+y+'</option>';});return o;}
  function field(lbl,ctrl){return '<div style="flex:1;min-width:140px"><label class="bdz-lbl">'+lbl+'</label>'+ctrl+'</div>';}
  function sel(id,html){return '<select id="'+id+'" class="bdz-in" onchange="BTLDS._upd()">'+html+'</select>';}
  function pageHtml(){
    return '<div class="topbar" style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:14px">'
      +'<div><h1 style="margin:0;font-size:20px;color:#0f2747;display:flex;align-items:center;gap:9px">🎨 Designer Bottle &amp; Brushing</h1>'
      +'<div style="font-size:12.5px;color:#64748b;margin-top:3px">'+L('تحكّم في الألوان والعناوين وترتيب الرسومات، وأنشئ رسومات مخصّصة مربوطة بالبيانات الفعلية.','Control colors, titles, chart order, and build custom data-bound charts.')+'</div></div></div>'
      +'<div class="bdz-card" style="margin-bottom:16px"><div style="font-size:13px;font-weight:800;color:#0f2747;margin-bottom:10px">🛠️ '+L('أدوات التصميم السريع','Quick design tools')+'</div>'
      +'<div style="display:flex;flex-wrap:wrap;gap:10px">'
      +'<button class="bdz-btn bdz-btn-p" onclick="try{BDCustomize.open()}catch(e){}">⚙️ '+L('الألوان والعناوين والترتيب','Colors · Titles · Order')+'</button>'
      +'<button class="bdz-btn" onclick="try{go(\'btl-dash\')}catch(e){}">📊 '+L('فتح لوحة القارورة','Open bottle dashboard')+'</button>'
      +'</div><div style="font-size:11.5px;color:#94a3b8;margin-top:8px">'+L('أداة الألوان والعناوين والترتيب تتحكم مباشرة في لوحة القارورة الحالية.','The colors/titles/order tool controls the live bottle dashboard directly.')+'</div></div>'
      +'<div class="bdz-card" style="margin-bottom:16px"><div style="font-size:13px;font-weight:800;color:#0f2747;margin-bottom:12px">➕ '+L('منشئ الرسومات المخصّصة','Custom chart builder')+'</div>'
      +'<div style="display:flex;gap:18px;flex-wrap:wrap">'
      +'<div style="flex:1 1 320px;min-width:280px">'
        +'<div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:10px">'
          +field(L('العنوان (عربي)','Title (AR)'),'<input id="bd-title-ar" class="bdz-in" oninput="BTLDS._upd()" placeholder="'+L('مثال: مبيعات حسب المنطقة','e.g. Sales by region')+'">')
          +field(L('العنوان (إنجليزي)','Title (EN)'),'<input id="bd-title-en" class="bdz-in" oninput="BTLDS._upd()" placeholder="e.g. Sales by region">')
        +'</div>'
        +'<div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:10px">'
          +field(L('نوع الرسمة','Chart type'),sel('bd-type',opts(TYPES,F.type)))
          +field(L('المؤشر (البيانات)','Metric (data)'),sel('bd-metric',opts(METRICS,F.metric)))
        +'</div>'
        +'<div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:10px">'
          +field(L('البُعد','Dimension'),sel('bd-dim',opts(DIMS,F.dim)))
          +field(L('الحساب','Calculation'),sel('bd-agg',opts(AGGS,F.agg)))
        +'</div>'
        +'<div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:10px;align-items:flex-end">'
          +field(L('السنة','Year'),sel('bd-year',yearOpts(F.year)))
          +'<div style="min-width:70px"><label class="bdz-lbl">'+L('اللون','Color')+'</label><input id="bd-color" type="color" value="'+F.color+'" class="bdz-in" style="height:38px;padding:2px" onchange="BTLDS._upd()"></div>'
        +'</div>'
        +'<div style="display:flex;gap:9px;flex-wrap:wrap;margin-top:6px">'
          +'<button class="bdz-btn bdz-btn-p" onclick="BTLDS._add()"><span id="bd-add-lbl">'+L('حفظ الرسمة','Save chart')+'</span></button>'
          +'<button class="bdz-btn" id="bd-cancel" style="display:none" onclick="BTLDS._cancel()">'+L('إلغاء','Cancel')+'</button>'
          +'<span id="bd-msg" style="align-self:center;font-size:12px;font-weight:700;color:#16a34a"></span>'
        +'</div>'
      +'</div>'
      +'<div style="flex:1 1 340px;min-width:280px"><label class="bdz-lbl">'+L('معاينة حية','Live preview')+'</label>'
        +'<div style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:12px;height:290px;position:relative"><canvas id="bd-preview"></canvas></div></div>'
      +'</div></div>'
      +'<div class="bdz-card"><div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px"><div style="font-size:13px;font-weight:800;color:#0f2747">🗂️ '+L('الرسومات المحفوظة','Saved charts')+'</div>'
      +'<span style="font-size:11.5px;color:#94a3b8">'+L('تظهر تلقائياً في لوحة القارورة','Shown automatically on the bottle dashboard')+'</span></div>'
      +'<div id="bd-saved"></div></div>';
  }
  function readForm(){
    function g(id){var e=document.getElementById(id);return e?e.value:'';}
    F.titleAr=g('bd-title-ar');F.titleEn=g('bd-title-en');F.type=g('bd-type')||'bar';F.metric=g('bd-metric')||'sales';F.dim=g('bd-dim')||'month';F.agg=g('bd-agg')||'sum';F.year=g('bd-year')||'all';F.color=g('bd-color')||'#0891b2';
  }
  function preview(){var c=document.getElementById('bd-preview');if(c)draw(c,{type:F.type,metric:F.metric,dim:F.dim,agg:F.agg,year:F.year,color:F.color});}
  function renderSaved(){var host=document.getElementById('bd-saved');if(!host)return;var list=load();
    if(!list.length){host.innerHTML='<div style="text-align:center;color:#94a3b8;font-size:12.5px;padding:24px">'+L('لا توجد رسومات محفوظة بعد. أنشئ رسمتك الأولى بالأعلى.','No saved charts yet. Create your first above.')+'</div>';return;}
    host.innerHTML='<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px">'+list.map(function(c){var t=isAr()?(c.titleAr||c.titleEn||'—'):(c.titleEn||c.titleAr||'—');
      return '<div style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:11px 12px;box-shadow:0 1px 3px rgba(16,40,80,.05)">'
        +'<div style="display:flex;align-items:center;justify-content:space-between;gap:6px;margin-bottom:6px"><div style="font-size:12.5px;font-weight:800;color:#0f2747;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(t)+'</div>'
        +'<div style="display:flex;gap:4px"><button class="bdz-mini" title="'+L('تعديل','Edit')+'" onclick="BTLDS._edit(\''+c.id+'\')">✏️</button><button class="bdz-mini" title="'+L('حذف','Delete')+'" onclick="BTLDS._del(\''+c.id+'\')">🗑️</button></div></div>'
        +'<div style="height:150px;position:relative"><canvas id="bd-mini-'+c.id+'"></canvas></div></div>';
    }).join('')+'</div>';
    setTimeout(function(){list.forEach(function(c){var cv=document.getElementById('bd-mini-'+c.id);if(cv)draw(cv,c);});},30);
  }
  function initPage(){var root=document.getElementById('btl-designer-root');if(!root)return;F={id:'',titleAr:'',titleEn:'',type:'bar',metric:'sales',dim:'month',year:'all',agg:'sum',color:'#0891b2'};root.innerHTML=pageHtml();preview();renderSaved();}
  function msg(t){var m=document.getElementById('bd-msg');if(m){m.textContent=t;setTimeout(function(){if(m)m.textContent='';},2200);}}
  window.BTLDS={
    initPage:initPage,
    _series:series,_years:years,
    _upd:function(){readForm();preview();},
    _add:function(){readForm();if(!F.titleAr&&!F.titleEn){msg(L('أدخل عنواناً','Enter a title'));return;}var c={id:F.id||'',titleAr:F.titleAr,titleEn:F.titleEn,type:F.type,metric:F.metric,dim:F.dim,agg:F.agg,year:F.year,color:F.color};upsert(c);F.id='';var cb=document.getElementById('bd-cancel');if(cb)cb.style.display='none';var al=document.getElementById('bd-add-lbl');if(al)al.textContent=L('حفظ الرسمة','Save chart');var ta=document.getElementById('bd-title-ar'),te=document.getElementById('bd-title-en');if(ta)ta.value='';if(te)te.value='';readForm();preview();renderSaved();msg(L('✔ تم الحفظ','✔ Saved'));},
    _edit:function(id){var c=load().filter(function(x){return x.id===id;})[0];if(!c)return;F={id:c.id,titleAr:c.titleAr||'',titleEn:c.titleEn||'',type:c.type||'bar',metric:c.metric||'sales',dim:c.dim||'month',year:c.year||'all',agg:c.agg||'sum',color:c.color||'#0891b2'};
      function s(id,v){var e=document.getElementById(id);if(e)e.value=v;}
      s('bd-title-ar',F.titleAr);s('bd-title-en',F.titleEn);s('bd-type',F.type);s('bd-metric',F.metric);s('bd-dim',F.dim);s('bd-agg',F.agg);s('bd-year',F.year);s('bd-color',F.color);
      var cb=document.getElementById('bd-cancel');if(cb)cb.style.display='';var al=document.getElementById('bd-add-lbl');if(al)al.textContent=L('تحديث الرسمة','Update chart');preview();try{document.getElementById('btl-designer-root').scrollIntoView({behavior:'smooth',block:'start'});}catch(e){}},
    _cancel:function(){F.id='';var cb=document.getElementById('bd-cancel');if(cb)cb.style.display='none';var al=document.getElementById('bd-add-lbl');if(al)al.textContent=L('حفظ الرسمة','Save chart');var ta=document.getElementById('bd-title-ar'),te=document.getElementById('bd-title-en');if(ta)ta.value='';if(te)te.value='';readForm();preview();},
    _del:function(id){if(!confirm(L('حذف هذه الرسمة؟','Delete this chart?')))return;del(id);renderSaved();},
    mountDashboard:function(hostId){var host=document.getElementById(hostId);if(!host)return;var list=load();if(!list.length){host.innerHTML='';return;}
      host.innerHTML='<div style="font-weight:800;font-size:13.5px;color:#1e3a5f;margin:4px 2px 10px">🎨 '+L('الرسومات المخصّصة','Custom Charts')+'</div>'
        +'<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px" class="btlx-grid">'+list.map(function(c){var t=isAr()?(c.titleAr||c.titleEn||'—'):(c.titleEn||c.titleAr||'—');
          return '<div class="btlx-card" style="background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:14px 16px;box-shadow:0 1px 3px rgba(16,40,80,.05);display:flex;flex-direction:column;min-height:300px"><div style="font-weight:800;font-size:13.5px;color:#1e3a5f;margin-bottom:8px">'+esc(t)+'</div><div style="position:relative;flex:1;min-height:220px"><canvas id="bd-dash-'+c.id+'"></canvas></div></div>';
        }).join('')+'</div>';
      setTimeout(function(){list.forEach(function(c){var cv=document.getElementById('bd-dash-'+c.id);if(cv)draw(cv,c);});},40);
    }
  };
})();
